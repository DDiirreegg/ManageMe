import React, { useState, useEffect, FormEvent } from 'react';
import { Project } from './Models/Project';
import ProjectService from './Services/ProjectService';
import { Story } from './Models/Story';
import TaskService from './Services/TaskService';
import { Task } from './Models/Task';
import UserService from './Services/UserService';
import { User } from './Models/User';
import Modal from 'react-modal';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import TaskForm from './components/TaskForm';
import StoryForm from './components/StoryForm';
import LoginForm from './components/LoginForm';
import ProfileContainer from './components/ProfileContainer';
import Settings from './components/Settings';
import NotificationList from './components/Notification/NotificationList';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Container, Button, Typography, Box } from '@mui/material';
import { notificationService, Notification } from './Services/NotificationService';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<{ [storyId: string]: Task[] }>({});
  const [projectName, setProjectName] = useState('');
  const [editingStory, setEditingStory] = useState<Story | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(UserService.getCurrentUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [isStoryForm, setIsStoryForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'settings' | 'notifications'>('projects');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleLoginSuccess = (token: string, refreshToken: string) => {
    setAccessToken(token);
    setRefreshToken(refreshToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setProjects(ProjectService.getAllProjects());
    if (currentProjectId) {
      const projectStories = ProjectService.getAllStories(currentProjectId);
      setStories(projectStories);

      const projectTasks: { [storyId: string]: Task[] } = {};
      projectStories.forEach(story => {
        projectTasks[story.id] = TaskService.getAllTasks(story.id);
      });
      setTasks(projectTasks);
    }
  }, [currentProjectId]);

  const handleSubmitStory = (story: Story) => {
    if (currentProjectId) {
      if (editingStory) {
        ProjectService.updateStory(currentProjectId, story);
        setEditingStory(undefined);
      } else {
        ProjectService.createStory(currentProjectId, story);
      }
      setStories(ProjectService.getAllStories(currentProjectId));
      setIsModalOpen(false);

      if (story.priority === 'medium' || story.priority === 'high') {
        const projectName = projects.find(p => p.id === currentProjectId)?.name;
        const notification: Notification = {
          title: 'New Story Created',
          message: `A new story "${story.name}" with priority ${story.priority} has been created in project "${projectName}".`,
          date: new Date().toISOString(),
          priority: story.priority,
          read: false
        };
        notificationService.send(notification);
      }
    }
  };

  const handleSubmitTask = (task: Task) => {
    if (viewingStory) {
      if (editingTask) {
        TaskService.updateTask(viewingStory.id, task);
        setEditingTask(undefined);
      } else {
        TaskService.createTask(viewingStory.id, task);
      }
      setTasks(prevTasks => ({
        ...prevTasks,
        [viewingStory.id]: TaskService.getAllTasks(viewingStory.id),
      }));
      setIsModalOpen(false);

      if (task.priority === 'medium' || task.priority === 'high') {
        const projectName = projects.find(p => p.id === currentProjectId)?.name;
        const storyName = viewingStory.name;
        const notification: Notification = {
          title: 'New Task Created',
          message: `A new task "${task.name}" with priority ${task.priority} has been created in story "${storyName}" of project "${projectName}".`,
          date: new Date().toISOString(),
          priority: task.priority,
          read: false
        };
        notificationService.send(notification);
      }
    }
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setIsStoryForm(true);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsStoryForm(false);
    setIsModalOpen(true);
  };

  const handleDeleteStory = (id: string) => {
    if (currentProjectId) {
      ProjectService.deleteStory(currentProjectId, id);
      setStories(ProjectService.getAllStories(currentProjectId));
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        delete newTasks[id];
        return newTasks;
      });
    }
  };

  const handleDeleteTask = (storyId: string, taskId: string) => {
    TaskService.deleteTask(storyId, taskId);
    setTasks(prevTasks => ({
      ...prevTasks,
      [storyId]: TaskService.getAllTasks(storyId),
    }));
  };

  const handleProjectChange = (projectId: string) => {
    ProjectService.setCurrentProject(projectId);
    setCurrentProjectId(projectId);
    setViewingStory(null);
  };

  const handleDeleteProject = (projectId: string) => {
    ProjectService.deleteProject(projectId);
    setProjects(ProjectService.getAllProjects());
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
  };

  const handleAssigneeChange = (task: Task, userId: string) => {
    const updatedTask: Task = {
      ...task,
      assigneeId: userId,
      status: 'doing',
      startDate: new Date()
    };
    TaskService.updateTask(task.storyId, updatedTask);
    setTasks(prevTasks => ({
      ...prevTasks,
      [task.storyId]: TaskService.getAllTasks(task.storyId),
    }));
  };

  const handleTaskStatusChange = (task: Task, newStatus: 'todo' | 'doing' | 'done') => {
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      endDate: newStatus === 'done' ? new Date() : undefined
    };
    TaskService.updateTask(task.storyId, updatedTask);
    setTasks(prevTasks => ({
      ...prevTasks,
      [task.storyId]: TaskService.getAllTasks(task.storyId),
    }));
  };

  const openModal = (isStory: boolean) => {
    setIsStoryForm(isStory);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

  const handleSubmitProject = (e: FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
    };
    ProjectService.createProject(newProject);
    setProjects(ProjectService.getAllProjects());
    setProjectName('');
    setIsProjectModalOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const users = UserService.getAllUsers();

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} username={currentUser?.firstName || 'User'} onTabChange={setActiveTab} darkMode={darkMode} />
        <Container sx={{ flex: 1, padding: '10px' }}>
          {activeTab === 'profile' && <ProfileContainer />}
          {activeTab === 'projects' && (
            <>
              {!currentProjectId ? (
                <>
                  <Typography variant="h4" align="center" gutterBottom>My Projects</Typography>
                  <ProjectList
                    projects={projects}
                    currentProjectId={currentProjectId}
                    onProjectChange={handleProjectChange}
                    onAddProject={openProjectModal}
                    onDeleteProject={handleDeleteProject}
                  />
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={() => setCurrentProjectId(null)}>Back to Projects</Button>
                  <Typography variant="h4" gutterBottom>Project: {projects.find(p => p.id === currentProjectId)?.name}</Typography>
                  {viewingStory ? (
                    <StoryDetail
                      story={viewingStory}
                      tasks={tasks[viewingStory.id] || []}
                      onBack={() => setViewingStory(null)}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={() => openModal(false)}
                      users={users}
                    />
                  ) : (
                    <StoryList
                      stories={stories}
                      onEditStory={handleEditStory}
                      onDeleteStory={handleDeleteStory}
                      onAddStory={() => openModal(true)}
                      onViewStory={setViewingStory}
                    />
                  )}
                </>
              )}
            </>
          )}
          {activeTab === 'settings' && <Settings onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
          {activeTab === 'notifications' && <NotificationList />}
        </Container>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={isStoryForm ? (editingStory ? "Edit Story" : "New Story") : (editingTask ? "Edit Task" : "New Task")}
        >
          <h2>{isStoryForm ? (editingStory ? "Edit Story" : "New Story") : (editingTask ? "Edit Task" : "New Task")}</h2>
          {isStoryForm ? (
            <StoryForm
              onSubmit={handleSubmitStory}
              onCancel={closeModal}
              editingStory={editingStory}
            />
          ) : (
            <TaskForm
              stories={stories}
              users={users}
              onSubmit={handleSubmitTask}
              onCancel={closeModal}
              editingTask={editingTask}
            />
          )}
        </Modal>

        <Modal
          isOpen={isProjectModalOpen}
          onRequestClose={closeProjectModal}
          contentLabel="New Project"
        >
          <h2>New Project</h2>
          <form onSubmit={handleSubmitProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <Button variant="contained" type="submit">Add Project</Button>
          </form>
          <Button variant="contained" onClick={closeProjectModal}>Close</Button>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default App;
