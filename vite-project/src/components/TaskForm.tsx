import React, { useState, FormEvent } from 'react';
import { Story } from '../Models/Story';
import { Task } from '../Models/Task';
import { User } from '../Models/User';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid } from '@mui/material';

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
    onSubmit(task);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        required
      />
      <FormControl required sx={{ minWidth: 120 }}>
        <InputLabel>Priority</InputLabel>
        <Select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
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
        label="Estimated Hours"
        type="number"
        value={estimatedHours}
        onChange={(e) => setEstimatedHours(Number(e.target.value))}
        required
      />
      <FormControl required sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
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
            label="End Date"
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
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TaskForm;
