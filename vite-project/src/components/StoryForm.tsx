import React, { useState, FormEvent } from 'react';
import { Story } from '../Models/Story';

interface StoryFormProps {
  onSubmit: (story: Story) => void;
  onCancel: () => void;
  editingStory?: Story;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, onCancel, editingStory }) => {
  const [name, setName] = useState(editingStory?.name || '');
  const [description, setDescription] = useState(editingStory?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingStory?.priority || 'low');
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>(editingStory?.status || 'todo');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const story: Story = {
      id: editingStory?.id || Date.now().toString(),
      name,
      description,
      priority,
      projectId: editingStory?.projectId || '',
      createdAt: editingStory?.createdAt || new Date(),
      status,
      ownerId: editingStory?.ownerId || '',
    };
    onSubmit(story);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Story Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Story Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <button className="rounded-button" type="submit">{editingStory ? 'Update Story' : 'Add Story'}</button>
      <button className="rounded-button" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default StoryForm;
