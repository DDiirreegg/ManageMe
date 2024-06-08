import React, { useState, useEffect, FormEvent } from 'react';
import {Project} from './Models/Project';
import ProjectService from './Services/ProjectService';
import { Story } from './Models/Story';
import TaskService from './Services/TaskService';
import { Task } from './Models/Task';
import UserService from './Services/UserService';
import { User } from './Models/User'
import Modal from 'react-modal';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import TaskForm from './components/TaskForm';
import StoryForm from './components/StoryForm';
import LoginForm from './components/LoginForm';
import axios from 'axios';
import './styles/style.css'; 

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<{ [storyId: string]: Task[] }>({});
  const [projectName, setProjectName] = useState('');
  const [editingStory, setEditingStory] = useState<Story | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(ProjectService.getCurrentProject());
  const [currentUser, setCurrentUser] = useState<User | null>(UserService.getCurrentUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [isStoryForm, setIsStoryForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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

      // Загрузить задачи для всех историй в текущем проекте
      const projectTasks: { [storyId: string]: Task[] } = {};
      projectStories.forEach(story => {
        projectTasks[story.id] = TaskService.getAllTasks(story.id);
      });
      setTasks(projectTasks);
    }
  }, [currentProjectId]);

  const handleSubmitStory = (story: Story) => {
    console.log('Submitting story:', story);
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
    console.log('Submitting task:', task);
    if (viewingStory) {
      if (editingTask) {
        TaskService.updateTask(viewingStory.id, task);
        setEditingTask(undefined);
      } else {
        TaskService.createTask(viewingStory.id, task);
      }
      // Обновить задачи для текущей истории
      setTasks(prevTasks => ({
        ...prevTasks,
        [viewingStory.id]: TaskService.getAllTasks(viewingStory.id),
      }));
      setIsModalOpen(false);
    }
  };

  const handleEditStory = (story: Story) => {
    console.log('Editing story:', story);
    setEditingStory(story);
    setIsStoryForm(true);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('Editing task:', task);
    setEditingTask(task);
    setIsStoryForm(false);
    setIsModalOpen(true);
  };

  const handleDeleteStory = (id: string) => {
    console.log('Deleting story:', id);
    if (currentProjectId) {
      ProjectService.deleteStory(currentProjectId, id);
      setStories(ProjectService.getAllStories(currentProjectId));
      // Удалить задачи, связанные с историей
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        delete newTasks[id];
        return newTasks;
      });
    }
  };

  const handleDeleteTask = (storyId: string, taskId: string) => {
    console.log('Deleting task:', taskId);
    TaskService.deleteTask(storyId, taskId);
    setTasks(prevTasks => ({
      ...prevTasks,
      [storyId]: TaskService.getAllTasks(storyId),
    }));
  };

  const handleProjectChange = (projectId: string) => {
    console.log('Changing project:', projectId);
    ProjectService.setCurrentProject(projectId);
    setCurrentProjectId(projectId);
    setIsProjectsVisible(false);
  };

  const handleAssigneeChange = (task: Task, userId: string) => {
    const updatedTask: Task = { 
      ...task, 
      assigneeId: userId, 
      status: 'doing', 
      startDate: new Date() 
    };
    console.log('Updating task with assignee:', updatedTask);
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
    console.log('Updating task status:', updatedTask);
    TaskService.updateTask(task.storyId, updatedTask);
    setTasks(prevTasks => ({
      ...prevTasks,
      [task.storyId]: TaskService.getAllTasks(task.storyId),
    }));
  };

  const openModal = (isStory: boolean) => {
    console.log(`Opening modal for ${isStory ? 'story' : 'task'}`);
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
    console.log('Submitting project:', newProject);
    ProjectService.createProject(newProject);
    setProjects(ProjectService.getAllProjects());
    setProjectName('');
    setIsProjectModalOpen(false);
  };

  const toggleProjectsVisibility = () => setIsProjectsVisible(!isProjectsVisible);

  const users = UserService.getAllUsers();

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div style={{ display: 'flex', flex: 1 }}>
        <ProjectList
          projects={projects}
          currentProjectId={currentProjectId}
          onProjectChange={handleProjectChange}
          onAddProject={openProjectModal}
          isProjectsVisible={isProjectsVisible}
          toggleProjectsVisibility={toggleProjectsVisibility}
        />
        <div style={{ flex: 1, padding: '10px' }}>
          {viewingStory ? (
            <StoryDetail
              story={viewingStory}
              tasks={tasks[viewingStory.id] || []}
              onBack={() => setViewingStory(null)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={() => openModal(false)}
            />
          ) : currentProjectId ? (
            <>
              <h2>Project: {projects.find(p => p.id === currentProjectId)?.name}</h2>
              <StoryList
                stories={stories}
                onEditStory={handleEditStory}
                onDeleteStory={handleDeleteStory}
                onAddStory={() => openModal(true)}
                onViewStory={setViewingStory} // Передаем новый пропс для просмотра истории
              />
            </>
          ) : (
            <p>Please select a project.</p>
          )}
        </div>
      </div>

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
          <button className="rounded-button" type="submit">Add Project</button>
        </form>
        <button className="rounded-button" onClick={closeProjectModal}>Close</button>
      </Modal>
    </div>
  );
};

export default App;
