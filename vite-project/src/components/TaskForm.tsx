import React, { useState, FormEvent } from 'react';
import { Story } from '../Models/Story';
import { Task } from '../Models/Task';
import { User } from '../Models/User';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Paper } from '@mui/material';

interface TaskFormProps {
  stories: Story[];
  users: User[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  editingTask?: Task;
}

const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const TaskForm: React.FC<TaskFormProps> = ({ stories, users, onSubmit, onCancel, editingTask }) => {
  const [name, setName] = useState(editingTask?.name || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingTask?.priority || 'low');
  const [storyId, setStoryId] = useState(editingTask?.storyId || stories[0]?.id || '');
  const [estimatedHours, setEstimatedHours] = useState<number>(editingTask?.estimatedHours || 0);
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>(editingTask?.status || 'todo');
  const [assigneeId, setAssigneeId] = useState<string | ''>(editingTask?.assigneeId || '');
  const [startDate, setStartDate] = useState(
    editingTask?.startDate && isValidDate(new Date(editingTask.startDate)) ? new Date(editingTask.startDate).toISOString().slice(0, 10) : ''
  );
  const [endDate, setEndDate] = useState(
    editingTask?.endDate && isValidDate(new Date(editingTask.endDate)) ? new Date(editingTask.endDate).toISOString().slice(0, 10) : ''
  );

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
      startDate: status === 'doing' && startDate ? new Date(startDate) : undefined,
      endDate: status === 'done' && endDate ? new Date(endDate) : undefined,
      assigneeId: status !== 'todo' ? assigneeId || undefined : undefined,
    };
    
    const cleanedTask = Object.fromEntries(Object.entries(task).filter(([_, v]) => v !== undefined));

    onSubmit(cleanedTask as Task);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="New task"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          required
        />
        <FormControl required sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
            <MenuItem value="low">low</MenuItem>
            <MenuItem value="medium">medium</MenuItem>
            <MenuItem value="high">high</MenuItem>
          </Select>
        </FormControl>
        <FormControl required sx={{ minWidth: 120 }}>
          <InputLabel>Story</InputLabel>
          <Select value={storyId} onChange={(e) => setStoryId(e.target.value)}>
            {stories.map(story => (
              <MenuItem key={story.id} value={story.id}>{story.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Estimated hours"
          type="number"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(Number(e.target.value))}
          required
        />
        <FormControl required sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
            <MenuItem value="todo">К todo</MenuItem>
            <MenuItem value="doing">doing</MenuItem>
            <MenuItem value="done">done</MenuItem>
          </Select>
        </FormControl>
        {status === 'doing' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Assignee</InputLabel>
              <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {status === 'done' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="End day"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl sx={{ minWidth: 60 }}>
              <InputLabel>Assignee</InputLabel>
              <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            {editingTask ? 'Update task' : 'Add task'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskForm;
