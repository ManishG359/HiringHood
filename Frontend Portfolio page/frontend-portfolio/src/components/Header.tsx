import  { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { FrontendProject } from '../types/project';

type ProjectModalProps = {
  project: FrontendProject;
  onClose: () => void;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [showImages, setShowImages] = useState(false); // State to toggle images

  const handleToggleImages = () => {
    setShowImages((prev) => !prev);
  };

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

        <Button
          variant="outlined"
          onClick={handleToggleImages}
          sx={{
            mt: 3,
            mb: 2,
            display: 'block',
            mx: 'auto',
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
              color: '#fff',
            },
          }}
        >
          {showImages ? 'Hide Images' : 'View Images'}
        </Button>

        {showImages && project.screenshots.length > 0 && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;