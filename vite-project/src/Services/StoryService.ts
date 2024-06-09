import { Story } from "../Models/Story";

class StoryService {
  private projectStories: { [key: string]: Story[] } = JSON.parse(localStorage.getItem('projectStories') || '{}');

  private saveToLocalStorage() {
    localStorage.setItem('projectStories', JSON.stringify(this.projectStories));
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
}

export default new StoryService();
