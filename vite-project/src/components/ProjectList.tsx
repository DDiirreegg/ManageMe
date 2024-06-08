import React from 'react';
import { Project } from '../Models/Project';
import { Button, ButtonGroup, Box, Grid } from '@mui/material';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onProjectChange: (projectId: string) => void;
  onAddProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, currentProjectId, onProjectChange, onAddProject }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <ButtonGroup orientation="vertical" variant="contained" color="primary">
            {projects.map(project => (
              <Button
                key={project.id}
                variant={project.id === currentProjectId ? 'contained' : 'outlined'}
                onClick={() => onProjectChange(project.id)}
                sx={{ mb: 1 }}
              >
                {project.name}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={onAddProject}>Add Project</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectList;
