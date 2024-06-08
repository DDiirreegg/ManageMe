import { Task } from '../Models/Task';

class TaskService {
  private tasks: { [key: string]: Task[] } = JSON.parse(localStorage.getItem('tasks') || '{}');

  private saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getAllTasks(storyId: string): Task[] {
    return this.tasks[storyId] || [];
  }

  getTaskById(storyId: string, taskId: string): Task | undefined {
    return this.tasks[storyId]?.find(task => task.id === taskId);
  }

  createTask(storyId: string, task: Task) {
    if (!this.tasks[storyId]) {
      this.tasks[storyId] = [];
    }
    this.tasks[storyId].push(task);
    this.saveToLocalStorage();
  }

  updateTask(storyId: string, updatedTask: Task) {
    const storyTasks = this.tasks[storyId];
    if (storyTasks) {
      const index = storyTasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        storyTasks[index] = updatedTask;
        this.saveToLocalStorage();
      }
    }
  }

  deleteTask(storyId: string, taskId: string) {
    const storyTasks = this.tasks[storyId];
    if (storyTasks) {
      this.tasks[storyId] = storyTasks.filter(task => task.id !== taskId);
      this.saveToLocalStorage();
    }
  }
}

export default new TaskService();
