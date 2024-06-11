import React, { useState, useEffect, FormEvent } from 'react';
import { Project } from './Models/Project';
import ProjectService from './Services/ProjectService';
import StoryService from './Services/StoryService';
import TaskService from './Services/TaskService';
import UserService from './Services/UserService';
import { Story } from './Models/Story';
import { Task } from './Models/Task';
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
import { createTheme, ThemeProvider, CssBaseline, Paper, Box, Typography, Button, Container, TextField, useTheme } from '@mui/material';
import { notificationService, Notification } from './Services/NotificationService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<{ [storyId: string]: Task[] }>({});
  const [users, setUsers] = useState<User[]>([]);
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
    const fetchData = async () => {
      const fetchedProjects = await ProjectService.getAllProjects();
      setProjects(fetchedProjects);

      if (currentProjectId) {
        const fetchedStories = await StoryService.getAllStories(currentProjectId);
        setStories(fetchedStories);

        const projectTasks: { [storyId: string]: Task[] } = {};
        for (const story of fetchedStories) {
          const tasks = await TaskService.getAllTasks(story.id);
          projectTasks[story.id] = tasks;
        }
        setTasks(projectTasks);
      }
    };

    const fetchUsers = async () => {
      const fetchedUsers = await UserService.getAllUsers();
      setUsers(fetchedUsers);
    };

    fetchData();
    fetchUsers();
  }, [currentProjectId]);

  const handleSubmitStory = async (story: Story) => {
    if (currentProjectId) {
      const { id, ...storyWithoutId } = story;
      if (editingStory) {
        await StoryService.updateStory(currentProjectId, story);
        setEditingStory(undefined);
      } else {
        await StoryService.createStory(currentProjectId, storyWithoutId);
      }
      const updatedStories = await StoryService.getAllStories(currentProjectId);
      setStories(updatedStories);
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

  const handleSubmitTask = async (task: Task) => {
    if (viewingStory) {
      if (editingTask) {
        await TaskService.updateTask(task.id, task);
        setEditingTask(undefined);
      } else {
        await TaskService.createTask(task);
      }
      const updatedTasks = await TaskService.getAllTasks(viewingStory.id);
      setTasks(prevTasks => ({
        ...prevTasks,
        [viewingStory.id]: updatedTasks,
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
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsStoryForm(false);
    setIsModalOpen(true);
  };
  
  const handleDeleteTask = async (storyId: string, taskId: string) => {
    await TaskService.deleteTask(taskId);
    const updatedTasks = await TaskService.getAllTasks(storyId);
    setTasks(prevTasks => ({
      ...prevTasks,
      [storyId]: updatedTasks,
    }));
  };
  

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setIsStoryForm(true);
    setIsModalOpen(true);
  };

  const handleDeleteStory = async (id: string) => {
    if (currentProjectId) {
      await StoryService.deleteStory(currentProjectId, id);
      const updatedStories = await StoryService.getAllStories(currentProjectId);
      setStories(updatedStories);
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        delete newTasks[id];
        return newTasks;
      });
    }
  };

  const handleProjectChange = async (projectId: string) => {
    setCurrentProjectId(projectId);
    setViewingStory(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    await ProjectService.deleteProject(projectId);
    const updatedProjects = await ProjectService.getAllProjects();
    setProjects(updatedProjects);
    if (currentProjectId === projectId) {
        setCurrentProjectId(null);
    }
};


  // const handleAssigneeChange = async (task: Task, userId: string) => {
  //   const updatedTask: Task = {
  //     ...task,
  //     assigneeId: userId,
  //     status: 'doing',
  //     startDate: new Date()
  //   };
  //   await TaskService.updateTask(task.id, updatedTask);
  //   const updatedTasks = await TaskService.getAllTasks(task.storyId);
  //   setTasks(prevTasks => ({
  //     ...prevTasks,
  //     [task.storyId]: updatedTasks,
  //   }));
  // };

  // const handleTaskStatusChange = async (task: Task, newStatus: 'todo' | 'doing' | 'done') => {
  //   const updatedTask: Task = {
  //     ...task,
  //     status: newStatus,
  //     endDate: newStatus === 'done' ? new Date() : undefined
  //   };
  //   await TaskService.updateTask(task.id, updatedTask);
  //   const updatedTasks = await TaskService.getAllTasks(task.storyId);
  //   setTasks(prevTasks => ({
  //     ...prevTasks,
  //     [task.storyId]: updatedTasks,
  //   }));
  // };

  const openModal = (isStory: boolean) => {
    setIsStoryForm(isStory);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

  const handleSubmitProject = async (e: FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
    };
    await ProjectService.createProject(newProject);
    const updatedProjects = await ProjectService.getAllProjects();
    setProjects(updatedProjects);
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
                    onDeleteProject={handleDeleteProject}
                  />
                </>
              ) : (
                <>
                  <Button 
                    variant="contained" 
                    onClick={() => setCurrentProjectId(null)}
                    startIcon={<ArrowBackIcon />} 
                    sx={{ mb: 2 }}
                  >
                    Back to Stories
                  </Button>
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
          style={{
            overlay: { 
              backgroundColor: 'rgba(0, 0, 0, 0.75)' 
            },
            content: { 
              color: darkMode ? '#fff' : '#000',
              background: darkMode ? '#333' : '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: darkMode ? '1px solid #555' : '1px solid #ddd'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {isStoryForm ? (editingStory ? "Edit Story" : "New Story") : (editingTask ? "Edit Task" : "New Task")}
            </Typography>
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
          </Box>
        </Modal>

        <Modal
          isOpen={isProjectModalOpen}
          onRequestClose={closeProjectModal}
          contentLabel="New Project"
          style={{
            overlay: { 
              backgroundColor: 'rgba(0, 0, 0, 0.75)' 
            },
            content: { 
              color: darkMode ? '#fff' : '#000',
              background: darkMode ? '#333' : '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: darkMode ? '1px solid #555' : '1px solid #ddd'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>New Project</Typography>
            <form onSubmit={handleSubmitProject}>
              <TextField
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>Add Project</Button>
              <Button variant="outlined" onClick={closeProjectModal}>Close</Button>
            </form>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default App;
