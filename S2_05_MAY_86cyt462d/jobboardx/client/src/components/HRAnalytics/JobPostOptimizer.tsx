import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';

interface JobPostOptimizerProps {
  initialDescription: string;
  companyId: string;
}

const JobPostOptimizer: React.FC<JobPostOptimizerProps> = ({ initialDescription, companyId }) => {
  const [jobDescription, setJobDescription] = useState(initialDescription);
  const [optimizedText, setOptimizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/jobs/optimize', {
        companyId,
        jobDescription
      });
      setOptimizedText(res.data.optimizedDescription);
    } catch (err: any) {
      setError('❌ Failed to fetch AI suggestions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI-Powered Job Description Optimizer
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Your Current Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={handleOptimize} disabled={loading}>
          {loading ? 'Optimizing...' : 'Get AI Suggestions'}
        </Button>

        {loading && <CircularProgress size={24} sx={{ ml: 2, mt: 2 }} />}

        {optimizedText && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600}>
              Optimized Description:
            </Typography>
            <Card sx={{ mt: 1, backgroundColor: '#f4f6f8' }}>
              <CardContent>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {optimizedText}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPostOptimizer;
