import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import { LinearProgress, styled } from '@mui/material';
import SurveyTrendChart from './SurveyTrendChart';
import SentimentPie from './SentimentPie';
import TrendCard from './TrendCard';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../BackToEmployerDashboard';

const exportTrendsToCSV = (trends: any[]) => {
  const header = ['Question', 'Average Score', 'Sentiment'];
  const rows = trends.map(t => [t.question, t.avgScore, t.sentiment]);

  const csvContent =
    [header, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'survey_trends.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const calculateAttritionRisk = (trends: any[]) => {
  if (trends.length === 0) return 0;

  const totalRisk = trends.reduce((acc, trend) => {
    if (trend.avgScore < 3) {
      return acc + 100; // 100% risk for avgScore < 3
    } else if (trend.avgScore === 3) {
      return acc + 50; // 50% risk for avgScore === 3
    } else {
      return acc; // 0% risk for avgScore > 3
    }
  }, 0);

  return totalRisk / trends.length; // Average risk percentage
};
const GradientProgressBar = styled(LinearProgress)<{ value: number }>`
  height: 20px;
  border-radius: 10px;
  background-color: #e0e0e0;
  & .MuiLinearProgress-bar {
    background: ${({ value }) =>
      value > 50
        ? 'linear-gradient(90deg, #f44336, #ff7961)' // Red gradient for > 50%
        : value === 50
        ? 'linear-gradient(90deg, #ff9800, #ffc107)' // Orange gradient for 50%
        : 'linear-gradient(90deg, #4caf50, #81c784)'}; // Green gradient for < 50%
  }
`;

const HRAnalyticsTab = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCompanyId(parsed.companyId || '682ad866708775bce0311681');
    }
  }, []);

  useEffect(() => {
    if (!companyId) return;
    const fetchTrends = async () => {
      try {
        const response = await axiosInstance.get(`/surveys/${companyId}`);
        const extractedTrends: any[] = [];
        response.data.trends.forEach((survey: any) => {
          if (Array.isArray(survey.questions)) {
            survey.questions.forEach((q: any) => {
              extractedTrends.push({
                question: q.question || q.text,
                avgScore: parseFloat(q.avgScore),
                sentiment: q.sentiment
              });
            });
          }
        });

        setTrends(extractedTrends);
      } catch (err) {
        setError('Failed to load survey trends.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [companyId]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>;

  const overallAttritionRisk = calculateAttritionRisk(trends);

  return (
    <Container>
      <BackToDashboardButton />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          HR Analytics Overview
        </Typography>
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => exportTrendsToCSV(trends)}>
          Export as CSV
        </Button>
        <Grid container spacing={3}>
          <Grid size={{xs:12,md:8}} >
            <SurveyTrendChart trends={trends} />
          </Grid>
          <Grid size={{xs:12,md:4}}>
            <SentimentPie trends={trends} />
          </Grid>
          {trends.length > 0 ? (
            trends.map((trend, index) => (
              <Grid size={{xs:12,md:4}} key={index}>
                <TrendCard trend={trend} />
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No trends available.
            </Typography>
          )}
        </Grid>

        {/* Attrition Risk Summary */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Attrition Risk Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Overall Attrition Risk: {overallAttritionRisk.toFixed(2)}%
          </Typography>
          <GradientProgressBar value={overallAttritionRisk} variant="determinate" />
        </Box>
        <Grid sx={{mt: 4}}>
        <Grid size={{xs:12,md:4}}width="60%">
          
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Manage Surveys
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create and distribute employee surveys.
                </Typography>
                <Button fullWidth variant="contained" onClick={() => navigate('/employer/surveys')}>
                  Open Survey Manager
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HRAnalyticsTab;
