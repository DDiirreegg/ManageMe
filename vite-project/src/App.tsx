import React, { useState, useEffect, FormEvent } from 'react';
import { Project } from './Models/Project';
import ProjectService from './Services/ProjectService';
import { Story } from './Models/Story';
import TaskService from './Services/TaskService';
import { Task } from './Models/Task';
import UserService from './Services/UserService';
import { User } from './Models/User';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import TaskForm from './components/TaskForm';
import StoryForm from './components/StoryForm';
import LoginForm from './components/LoginForm';
import ProfileContainer from './components/ProfileContainer';
import Settings from './components/Settings';
import { createTheme, ThemeProvider, CssBaseline, Container, Button, Typography, Box, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'settings'>('projects');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]); // Добавьте состояние для пользователей

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
    setUsers(UserService.getAllUsers()); // Получите пользователей из сервиса
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
                      users={users} // Передайте пользователей в StoryDetail
                      onBack={() => setViewingStory(null)}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={() => openModal(false)}
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
        </Container>

        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
          <DialogTitle>{isStoryForm ? (editingStory ? "Edit Story" : "New Story") : (editingTask ? "Edit Task" : "New Task")}</DialogTitle>
          <DialogContent>
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
          </DialogContent>
        </Dialog>

        <Dialog open={isProjectModalOpen} onClose={closeProjectModal} maxWidth="xs" fullWidth>
          <DialogTitle>New Project</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmitProject} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">Add Project</Button>
            <Button variant="outlined" onClick={closeProjectModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default App;
