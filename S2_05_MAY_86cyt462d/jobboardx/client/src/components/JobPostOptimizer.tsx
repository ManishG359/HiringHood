import { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import axiosInstance from '../services/axiosInstance';

interface JobPostOptimizerProps {
  initialDescription: string;
  companyId: string;
  onOptimized: (text: string) => void;
}

const JobPostOptimizer: React.FC<JobPostOptimizerProps> = ({ initialDescription, companyId, onOptimized }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!initialDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/jobs/optimize', {
        jobDescription: initialDescription,
        companyId
      });
      onOptimized(response.data.optimizedDescription);
    } catch (err: any) {
      console.error('❌ Failed to fetch AI suggestions', err);
      setError('Failed to optimize the job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" mt={2}>
        ✨ AI Job Description Optimizer
      </Typography>
      <Button onClick={handleOptimize} disabled={loading} sx={{ my: 1 }} variant="outlined">
        {loading ? <CircularProgress size={20} /> : 'Generate AI Suggestions'}
      </Button>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default JobPostOptimizer;
