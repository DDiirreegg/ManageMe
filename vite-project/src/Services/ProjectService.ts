import { Story } from "../Models/Story";
import { Project } from "../Models/Project";

class ProjectService {
  private projects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
  private projectStories: { [key: string]: Story[] } = JSON.parse(localStorage.getItem('projectStories') || '{}');
  private currentProjectId: string | null = localStorage.getItem('currentProjectId');

  private saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
    localStorage.setItem('projectStories', JSON.stringify(this.projectStories));
    if (this.currentProjectId) {
      localStorage.setItem('currentProjectId', this.currentProjectId);
    }
  }

  getAllProjects(): Project[] {
    return this.projects;
  }

  createProject(project: Project) {
    this.projects.push(project);
    this.saveToLocalStorage();
  }

  deleteProject(projectId: string) {
    this.projects = this.projects.filter(project => project.id !== projectId);
    delete this.projectStories[projectId];
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null;
      localStorage.removeItem('currentProjectId');
    }
    this.saveToLocalStorage();
  }

  getAllStories(projectId: string): Story[] {
    return this.projectStories[projectId] || [];
  }

  getStoryById(projectId: string, storyId: string): Story | undefined {
    return this.projectStories[projectId]?.find(story => story.id === storyId);
  }

  createStory(projectId: string, story: Story) {
    if (!this.projectStories[projectId]) {
      this.projectStories[projectId] = [];
    }
    this.projectStories[projectId].push(story);
    this.saveToLocalStorage();
  }

  updateStory(projectId: string, updatedStory: Story) {
    const project = this.projectStories[projectId];
    if (project) {
      const index = project.findIndex(story => story.id === updatedStory.id);
      if (index !== -1) {
        project[index] = updatedStory;
        this.saveToLocalStorage();
      }
    }
  }

  deleteStory(projectId: string, storyId: string) {
    const project = this.projectStories[projectId];
    if (project) {
      this.projectStories[projectId] = project.filter(story => story.id !== storyId);
      this.saveToLocalStorage();
    }
  }

  setCurrentProject(projectId: string) {
    this.currentProjectId = projectId;
    this.saveToLocalStorage();
  }

  getCurrentProject(): string | null {
    return this.currentProjectId;
  }
}

export default new ProjectService();
