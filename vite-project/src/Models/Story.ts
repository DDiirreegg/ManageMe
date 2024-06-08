export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdAt: Date;
  status: 'todo' | 'doing' | 'done';
  ownerId: string;
}
