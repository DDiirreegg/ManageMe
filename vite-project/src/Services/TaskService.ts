import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { Task } from '../Models/Task';

const db = getFirestore();

class TaskService {
  private taskCollection = collection(db, 'tasks');

  async getAllTasks(storyId: string): Promise<Task[]> {
    const q = query(this.taskCollection, where('storyId', '==', storyId));
    const snapshot = await getDocs(q);
    const tasks: Task[] = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<void> {
    const taskWithDefaults: Partial<Task> = {
      ...task,
      assigneeId: task.assigneeId || undefined,
      endDate: task.endDate || undefined,
      startDate: task.startDate || undefined,
    };

    const cleanedTask = Object.fromEntries(Object.entries(taskWithDefaults).filter(([_, v]) => v !== undefined));

    await addDoc(this.taskCollection, cleanedTask);
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    const taskDocRef = doc(this.taskCollection, taskId);
    await updateDoc(taskDocRef, task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.taskCollection, taskId);
    await deleteDoc(taskDoc);
  }
}

export default new TaskService();
