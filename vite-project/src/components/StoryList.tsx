import React from 'react';
import { Story } from '../Models/Story';
import { Button, List, ListItem, Typography, Box, Grid, Paper } from '@mui/material';

interface StoryListProps {
  stories: Story[];
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  onAddStory: () => void;
  onViewStory: (story: Story) => void; 
}

const StoryList: React.FC<StoryListProps> = ({ stories, onEditStory, onDeleteStory, onAddStory, onViewStory }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" color="primary" onClick={onAddStory} sx={{ mb: 2 }}>New Story</Button>
      <List>
        {stories.map(story => (
          <ListItem key={story.id} sx={{ mb: 2 }}>
            <Paper
              sx={{
                p: 2,
                width: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f9f9f9',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
              onClick={() => onViewStory(story)}
            >
              <Typography variant="h6">
                Story name: {story.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Description: {story.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Priority: {story.priority}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: {story.status}
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" onClick={(e) => { e.stopPropagation(); onEditStory(story); }}>Edit</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={(e) => { e.stopPropagation(); onDeleteStory(story.id); }}>Delete</Button>
                </Grid>
              </Grid>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StoryList;
