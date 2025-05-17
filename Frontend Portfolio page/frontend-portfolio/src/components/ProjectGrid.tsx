import { Box } from '@mui/material';
import ProjectCard from './ProjectCard';
import type { FrontendProject } from '../types/project';

type ProjectGridProps = {
  projects: FrontendProject[];
  onViewDetails: (project: FrontendProject) => void;
};

const ProjectGrid = ({ projects, onViewDetails }: ProjectGridProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {projects.map(project => (
        <Box key={project.id} sx={{ width: '100%' }}>
          <ProjectCard project={project} onViewDetails={onViewDetails} />
        </Box>
      ))}
    </Box>
  );
};

export default ProjectGrid;
