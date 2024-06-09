import React from 'react';
import { Project } from '../Models/Project';
import { Button, Box, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onProjectChange: (projectId: string) => void;
  onAddProject: () => void;
  onDeleteProject: (projectId: string) => void; // добавлено
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, currentProjectId, onProjectChange, onAddProject, onDeleteProject }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          {projects.map(project => (
            <Box key={project.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Button
                variant={project.id === currentProjectId ? 'contained' : 'outlined'}
                onClick={() => onProjectChange(project.id)}
                sx={{ flex: 1 }}
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
          ))}
        </Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={onAddProject}>Add Project</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectList;
