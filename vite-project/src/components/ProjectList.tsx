import React from 'react';
import { Project } from '../Models/Project';
import ProjectService from '../Services/ProjectService';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onProjectChange: (projectId: string) => void;
  onAddProject: () => void;
  isProjectsVisible: boolean;
  toggleProjectsVisibility: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, currentProjectId, onProjectChange, onAddProject, isProjectsVisible, toggleProjectsVisibility }) => {
  return (
    <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc' }}>
      <button className="rounded-button" onClick={toggleProjectsVisibility}>Projects</button>
      {isProjectsVisible && (
        <div>
          {projects.map(project => (
            <button
              key={project.id}
              className={`project-item ${project.id === currentProjectId ? 'selected-project' : ''}`}
              onClick={() => onProjectChange(project.id)}
            >
              {project.name}
            </button>
          ))}
          <button className="project-item" onClick={onAddProject}>Add Project</button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
