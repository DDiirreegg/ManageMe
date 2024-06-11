import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { Story } from '../Models/Story';

const db = getFirestore();

class StoryService {
  private storyCollection = collection(db, 'stories');

  async getAllStories(projectId: string): Promise<Story[]> {
    const q = query(this.storyCollection, where('projectId', '==', projectId));
    const snapshot = await getDocs(q);
    const stories: Story[] = [];
    snapshot.forEach(doc => {
      stories.push({ id: doc.id, ...doc.data() } as Story);
    });
    return stories;
  }

  async createStory(projectId: string, story: Omit<Story, 'id'>): Promise<void> {
    const storyToSave = { ...story, projectId };
    await addDoc(this.storyCollection, storyToSave);
  }

  async updateStory(projectId: string, story: Partial<Story>): Promise<void> {
    if (!story.id) throw new Error('Story ID is required for update');
    const storyDoc = doc(this.storyCollection, story.id);
    await updateDoc(storyDoc, story);
  }

  async deleteStory(projectId: string, storyId: string): Promise<void> {
    const storyDoc = doc(this.storyCollection, storyId);
    await deleteDoc(storyDoc);
  }
}

export default new StoryService();
