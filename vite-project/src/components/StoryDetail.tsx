import React from 'react';
import { Story } from '../Models/Story';
import { Task } from '../Models/Task';
import { User } from '../Models/User'; 
import { Button, Typography, Box, List, ListItem, Grid, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface StoryDetailProps {
  story: Story;
  tasks: Task[];
  users: User[]; 
  onBack: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (storyId: string, taskId: string) => void;
  onAddTask: () => void;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ story, tasks, users, onBack, onEditTask, onDeleteTask, onAddTask }) => {

  const getAssigneeName = (assigneeId?: string) => {
    if (!users || users.length === 0) return 'Unassigned';
    const user = users.find(user => user.id === assigneeId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unassigned';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        onClick={onBack} 
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 2 }}
      >
        Back to Stories
      </Button>
      <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Story: {story.name}</Typography>
        <Typography variant="body1" gutterBottom>Description: {story.description}</Typography>
        <Typography variant="body1" gutterBottom>Priority: {story.priority}</Typography>
        <Typography variant="body1" gutterBottom>Status: {story.status}</Typography>
        <Typography variant="body1" gutterBottom>Created At: {story.createdAt.toLocaleDateString()}</Typography>

        <Button variant="outlined" onClick={onAddTask} sx={{ mt: 2 }}>Add Task</Button>
      </Paper>

      <Typography variant="h5" gutterBottom>Tasks</Typography>
      {tasks.length > 0 ? (
        <List>
          {tasks.map(task => (
            <ListItem key={task.id}>
              <Paper elevation={2} sx={{ p: 2, width: '100%', borderRadius: '8px' }}>
                <Typography variant="h6">Task: {task.name}</Typography>
                <Typography variant="body1">Description: {task.description}</Typography>
                <Typography variant="body1">Estimated hours: {task.estimatedHours}</Typography>
                <Typography variant="body1">Priority: {task.priority}</Typography>
                <Typography variant="body1">Status: {task.status}</Typography>
                <Typography variant="body1">Created: {task.createdAt.toLocaleDateString()}</Typography>
                {task.startDate && (
                  <Typography variant="body1">Start date: {task.startDate.toLocaleDateString()}</Typography>
                )}
                {task.endDate && (
                  <Typography variant="body1">End date: {task.endDate.toLocaleDateString()}</Typography>
                )}
                {task.assigneeId && (
                  <Typography variant="body1">Assignee: {getAssigneeName(task.assigneeId)}</Typography>
                )}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item>
                    <Button variant="contained" onClick={() => onEditTask(task)}>Edit</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="error" onClick={() => onDeleteTask(story.id, task.id)}>Delete</Button>
                  </Grid>
                </Grid>
              </Paper>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No tasks available.</Typography>
      )}
    </Box>
  );
};

export default StoryDetail;
