import React, { useState, FormEvent } from 'react';
import { Story } from '../Models/Story';
import { Task } from '../Models/Task';
import { User } from '../Models/User';

interface TaskFormProps {
  stories: Story[];
  users: User[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  editingTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ stories, users, onSubmit, onCancel, editingTask }) => {
  const [name, setName] = useState(editingTask?.name || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingTask?.priority || 'low');
  const [storyId, setStoryId] = useState(editingTask?.storyId || stories[0]?.id || '');
  const [estimatedHours, setEstimatedHours] = useState<number>(editingTask?.estimatedHours || 0);
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>(editingTask?.status || 'todo');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(editingTask?.assigneeId || undefined);
  const [startDate, setStartDate] = useState(editingTask?.startDate ? editingTask.startDate.toISOString().slice(0, 10) : '');
  const [endDate, setEndDate] = useState(editingTask?.endDate ? editingTask.endDate.toISOString().slice(0, 10) : '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: editingTask?.id || Date.now().toString(),
      name,
      description,
      priority,
      storyId,
      estimatedHours,
      status,
      createdAt: editingTask?.createdAt || new Date(),
      startDate: status === 'doing' ? new Date(startDate) : undefined,
      endDate: status === 'done' ? new Date(endDate) : undefined,
      assigneeId: status !== 'todo' ? assigneeId : undefined,
    };
    console.log('Submitting task:', task); // Отладочное сообщение
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select value={storyId} onChange={(e) => setStoryId(e.target.value)}>
        {stories.map(story => (
          <option key={story.id} value={story.id}>{story.name}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Estimated Hours"
        value={estimatedHours}
        onChange={(e) => setEstimatedHours(Number(e.target.value))}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      {status === 'doing' && (
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
        </div>
      )}
      {status === 'done' && (
        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
        </div>
      )}
      <button className="rounded-button" type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
      <button className="rounded-button" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default TaskForm;
