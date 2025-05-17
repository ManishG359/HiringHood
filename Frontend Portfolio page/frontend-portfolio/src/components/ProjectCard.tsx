import { Card, CardContent, CardActions, Typography, Button, Chip, Stack } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { FrontendProject } from '../types/project';

const StyledCard = styled(motion(Card))`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type ProjectCardProps = {
  project: FrontendProject;
  onViewDetails: (project: FrontendProject) => void;
};

const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  return (
    <StyledCard
      elevation={3}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>{project.title}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {project.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          {project.techStack.map((tech, index) => (
            <Chip key={index} label={tech} size="small" />
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" href={project.liveDemoUrl} target="_blank" sx={{
      '&:hover': {
        backgroundColor: '#1976d2',
        color: 'white'
      }
    }}>Live Demo</Button>
        <Button size="small" onClick={() => onViewDetails(project)}sx={{
      '&:hover': {
        backgroundColor: '#1976d2',
        color: 'white'
      }
    }}>View Details</Button>
      </CardActions>
    </StyledCard>
  );
};

export default ProjectCard;
