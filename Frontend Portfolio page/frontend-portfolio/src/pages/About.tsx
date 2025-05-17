import { Box, Typography, Container, Avatar, Chip, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import manishPhoto from '/assets/Manish_Pic.jpg';
import { useEffect, useState } from 'react';

const typedStrings = [
  'I am a passionate and detail-oriented software developer...',
  'React Enthusiast ✨',
  'I love building user-friendly web applications...',
];

const useTypedText = (strings: string[], typeSpeed = 40, backSpeed = 50, loop = true) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setText(strings[index].substring(0, subIndex));
      if (!deleting && subIndex === strings[index].length) {
        if (!loop && index === strings.length - 1) return;
        setDeleting(true);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % strings.length);
      } else {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, deleting ? backSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting]);

  return text;
};

const About = () => {
  const typedText = useTypedText(typedStrings);

  const skills = [
    { label: 'JavaScript', color: '#F7DF1E' },
    { label: 'TypeScript', color: '#3178C6' },
    { label: 'React', color: '#61DAFB' },
    { label: 'Redux', color: '#764ABC' },
    { label: 'Node.js', color: '#68A063' },
    { label: 'MongoDB', color: '#4DB33D' },
    { label: 'Docker', color: '#2496ED' },
    { label: 'AWS Lambda', color: '#FF9900' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const glassCardStyle = {
    backdropFilter: 'blur(12px)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    p: 3,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
    },
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #1f1c2c, #928DAB)',
        minHeight: '100vh',
        py: 6,
        color: 'white',
      }}
    >
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Avatar
            src={manishPhoto}
            alt="Manish"
            sx={{
              width: 160,
              height: 160,
              mx: 'auto',
              mb: 3,
              border: '4px solid white',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.08)',
              },
            }}
          />
        </motion.div>
        <Typography variant="h3" fontWeight={700}>
          Welcome to Manish's Portfolio
        </Typography>
        <Typography variant="h6" mt={2} fontStyle="italic" sx={{ color: '#f0f0f0' }}>
          {typedText}
        </Typography>
      </Box>

      <Container maxWidth="md">
        {[
          {
            title: 'Education',
            content: [
              'B.Tech in CSE, Gayatri Vidya Parishad College (2021 - 2025) – CGPA: 7.6',
              'Class XII, SVK Junior College (2019 - 2021) – CGPA: 8.9',
            ],
          },
          {
            title: 'Professional Experience',
            content: [
              '**OutSystems Developer Intern, Savvy IT Solutions (05/2024)** - Developed responsive admission app & employee dashboard using OutSystems.',
              '**Engineering Intern, HiringHood (03/2025)** - Built Blog CMS with CRUD, role-based auth, RTK Query, MUI, and Node backend.',
            ],
          },
          {
            title: 'Other Notable Projects',
            content: ['Finance Tracker', 'Weather App', 'Recipe Book'],
          },
          {
            title: 'Academic Projects',
            content: ['NPM CLI Quiz Tool', 'Telegram Chatbot', 'Waste Management Site'],
          },
        ].map((section, idx) => (
          <motion.div
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <Paper sx={{ ...glassCardStyle, mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {section.title}
              </Typography>
              {section.content.map((line, i) => (
                <Typography
                  key={i}
                  sx={{ mb: 1 }}
                  dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                  }}
                />
              ))}
            </Paper>
          </motion.div>
        ))}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Paper sx={{ ...glassCardStyle }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Chip
                    label={skill.label}
                    sx={{
                      backgroundColor: skill.color,
                      color: '#000',
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      fontSize: '0.95rem',
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                      transition: '0.3s',
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
