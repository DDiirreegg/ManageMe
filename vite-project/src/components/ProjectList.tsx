import React from 'react';
import { Project } from '../Models/Project';
import { Button, Box, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onProjectChange: (projectId: string) => void;
  onAddProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, currentProjectId, onProjectChange, onAddProject, onDeleteProject }) => {
  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={onAddProject}
            sx={{ mb: 2 }}
          >
            Add Project
          </Button>
        </Grid>
        {projects.map(project => (
          <Grid item xs={12} key={project.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', p: 1 }}>
              <Button
                variant={project.id === currentProjectId ? 'contained' : 'outlined'}
                color={project.id === currentProjectId ? 'primary' : 'inherit'}
                onClick={() => onProjectChange(project.id)}
                sx={{ flex: 1, textTransform: 'none' }}
              >
                {project.name}
              </Button>
              <IconButton
                onClick={() => onDeleteProject(project.id)}
                color="secondary"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectList;
