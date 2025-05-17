
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, Typography, Paper, Grid, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion'; 

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Static skills list
const skills = [
  { label: 'React', proficiency: 90 },
  { label: 'TypeScript', proficiency: 90 },
  { label: 'JavaScript', proficiency: 88 },
  { label: 'Axios', proficiency: 84 },
  { label: 'Redux Toolkit', proficiency: 80 },
  { label: 'JWT Auth', proficiency: 79 },
  { label: 'MUI', proficiency: 78 },
  { label: 'Styled Components', proficiency: 77 },
  { label: 'Next.js', proficiency: 75 },
  { label: 'Formik/Yup', proficiency: 74 },
  { label: 'Framer Motion', proficiency: 70 },
  { label: 'CSS', proficiency: 60 },

];

const SkillRadarChart = () => {
  // Sort skills in descending order of proficiency
  const sortedSkills = [...skills].sort((a, b) => b.proficiency - a.proficiency);

  const data = {
    labels: skills.map((s) => s.label),
    datasets: [
      {
        label: 'Skill Proficiency',
        data: skills.map((s) => s.proficiency),
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 2
        
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 }
      }
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 4 ,backgroundColor: '242, 236, 210'}}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} >
        <Typography variant="h6" gutterBottom>
          Skill Radar (Static Proficiency)
        </Typography>
        <Radar data={data} options={options} />
        <Box sx={{backgroundColor: '242, 236, 210' }}>
          <Typography variant="subtitle1" gutterBottom>
            Skill Breakdown:
          </Typography>
          <Grid container spacing={2}>
            {sortedSkills.map((skill, index) => (
             
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>{skill.label}</strong>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={skill.proficiency}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </motion.div>
              
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default SkillRadarChart;
