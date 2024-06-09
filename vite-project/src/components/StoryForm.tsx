import React, { useState, FormEvent } from 'react';
import { Story } from '../Models/Story';
import { TextField, Button, Select, MenuItem, Box, FormControl, InputLabel, Paper, Typography } from '@mui/material';

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
    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', width: '100%', maxWidth: '500px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {editingStory ? 'Edit Story' : 'Add Story'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Story Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Story Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          required
          fullWidth
        />
        <FormControl fullWidth required>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="doing">Doing</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" type="submit">
            {editingStory ? 'Update Story' : 'Add Story'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default StoryForm;
