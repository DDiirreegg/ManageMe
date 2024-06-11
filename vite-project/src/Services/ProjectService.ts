import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Project } from '../Models/Project';

class ProjectService {
  private projectCollection = collection(db, 'projects');

  async getAllProjects(): Promise<Project[]> {
    const snapshot = await getDocs(this.projectCollection);
    const projects: Project[] = [];
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    return projects;
  }

  async createProject(project: Project): Promise<void> {
    const projectRef = await addDoc(this.projectCollection, {
        name: project.name
    });
    project.id = projectRef.id;
}

  async deleteProject(projectId: string): Promise<void> {
    const projectDoc = doc(this.projectCollection, projectId);
    await deleteDoc(projectDoc);
}
}

export default new ProjectService();
