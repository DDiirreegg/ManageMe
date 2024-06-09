import { Project } from "../Models/Project";

class ProjectService {
  private projects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
  private currentProjectId: string | null = localStorage.getItem('currentProjectId');

  private saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
    if (this.currentProjectId) {
      localStorage.setItem('currentProjectId', this.currentProjectId);
    } else {
      localStorage.removeItem('currentProjectId');
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
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null;
    }
    this.saveToLocalStorage();
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
