export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  storyId: string;
  estimatedHours: number;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  assigneeId?: string;
}
