import { useState } from 'react';
import type { FrontendProject } from '../types/project';
import projects from '../data/projects';
import SearchBar from '../components/SearchBar';
import ProjectGrid from '../components/ProjectGrid';
import ProjectModal from '../components/ProjectModal';
import SkillRadarChart from '../components/SkillRadarChart';
import { Box} from '@mui/material';
import Grid from '@mui/material/GridLegacy';

const Home = () => {
  const [query, setQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<FrontendProject | null>(null);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(query.toLowerCase()) ||
    project.techStack.some(tech =>
      tech.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <Box sx={{ my: 4, px: { xs: 2, md: 6 } }}>
      <SearchBar query={query} onChange={setQuery} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ProjectGrid
            projects={filteredProjects}
            onViewDetails={(project) => setSelectedProject(project)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SkillRadarChart />
        </Grid>
      </Grid>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </Box>
  );
};

export default Home;
