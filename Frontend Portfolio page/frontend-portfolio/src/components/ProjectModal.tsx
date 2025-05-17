import {Box,Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  useTheme,
  Collapse,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FrontendProject } from '../types/project';
import { Dialog as ImageDialog } from '@mui/material';



type ProjectModalProps = {
  project: FrontendProject;
  onClose: () => void;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';


  const [showScreenshots, setShowScreenshots] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        sx: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
        }}
      >
        {project.title}
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
        >
          {project.description}
        </Typography>

        <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2 }}>
          Features
        </Typography>
        <List>
          {project.features.map((feature, idx) => (
            <ListItem
              key={idx}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              
              sx={{
                backgroundColor: isDark ? 'rgba(100, 181, 246, 0.15)' : '#e3f2fd',
                borderRadius: 2,
                mb: 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2 }}>
          Challenges & Solutions
        </Typography>
        <List>
          {project.challenges.map((challenge, idx) => (
            <ListItem
              key={idx}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              sx={{
                backgroundColor: isDark ? 'rgba(255, 183, 197, 0.12)' : '#fce4ec',
                borderRadius: 2,
                mb: 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ListItemText primary={challenge} />
            </ListItem>
          ))}
        </List>

        {/* Toggle Screenshots */}
        {project.screenshots.length > 0 && (
          <>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowScreenshots((prev) => !prev)}
              >
                {showScreenshots ? 'Hide Screenshots' : 'View Screenshots'}
              </Button>
            </Box>

            <Collapse in={showScreenshots} timeout="auto" unmountOnExit>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, mt: 2 }}>
                Screenshots
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 1,
                  justifyContent: 'center',
                }}
              >
                {project.screenshots.map((src: string, index: number) => (
                  <Box
                    key={index}
                    component="img"
                    src={src}
                    alt={`Screenshot ${index + 1}`}
                    onClick={() => setSelectedImage(src)}
                    sx={{
                      width: '100%',
                      maxWidth: 240,
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Collapse>
          </>
        )}

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button
            href={project.githubUrl}
            target="_blank"
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            View on GitHub
          </Button>
        </Box>
        <ImageDialog
  open={Boolean(selectedImage)}
  onClose={() => setSelectedImage(null)}
  maxWidth="md"
  fullWidth
  sx={{
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }}
>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      p: 2,
      bgcolor: 'transparent',
    }}
  >
    <Box
      component="img"
      src={selectedImage || ''}
      alt="Preview"
      sx={{
        maxHeight: '100%',
        maxWidth: '100%',
        borderRadius: 2,
        boxShadow: 3,
      }}
    />
  </Box>
</ImageDialog>

      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
