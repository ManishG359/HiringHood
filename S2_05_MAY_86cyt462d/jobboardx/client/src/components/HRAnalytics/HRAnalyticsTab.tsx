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


const PageBackground = styled('div')`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const StyledContainer = styled(Container)`
  max-width: 1200px !important;
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: linear-gradient(135deg, #FAFFCA 0%, #B9D4AA 100%);
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    color: #fff !important;
    box-shadow: none !important;
  }
`;

const OutlinedButton = styled(Button)`
  border: 2px solid #5A827E !important;
  color: #5A827E !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  margin: 0.5rem 0 !important;
  background: #fff !important;
  &:hover {
    background: #e6f2ee !important;
    border-color: #1976d2 !important;
    color: #1976d2 !important;
  }
`;

const SectionTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  text-align: center;
`;

const CardTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  text-align: center;
`;

const CardDescription = styled(Typography)`
  color: #333;
  text-align: center;
  margin-bottom: 1rem !important;
`;

const StyledStack = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const GradientProgressBar = styled(LinearProgress)<{ value: number }>`
  height: 20px;
  border-radius: 10px;
  background-color: #e0e0e0;
  & .MuiLinearProgress-bar {
    background: ${({ value }) =>
      value > 50
        ? 'linear-gradient(90deg, #f44336, #ff7961)' 
        : value === 50
        ? 'linear-gradient(90deg, #ff9800, #ffc107)' 
        : 'linear-gradient(90deg, #4caf50, #81c784)'}; 
  }
`;



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
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <PageBackground />
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <BackToDashboardButton />
        </Box>
        <SectionTitle variant="h4" gutterBottom>
          HR Analytics Overview
        </SectionTitle>
        <OutlinedButton sx={{ mb: 2 }} onClick={() => exportTrendsToCSV(trends)}>
          Export as CSV
        </OutlinedButton>
        <StyledStack>
          <StyledCard sx={{ flex: 2, minWidth: 320, maxWidth: 600 }}>
            <CardContent>
              <CardTitle variant="h6">Survey Trends</CardTitle>
              <SurveyTrendChart trends={trends} />
            </CardContent>
          </StyledCard>
          <StyledCard sx={{ flex: 1, minWidth: 250, maxWidth: 350 }}>
            <CardContent>
              <CardTitle variant="h6">Sentiment Overview</CardTitle>
              <SentimentPie trends={trends} />
            </CardContent>
          </StyledCard>
        </StyledStack>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {trends.length > 0 ? (
            trends.map((trend, index) => (
              <Grid size={{ xs: 12, md: 4  }}  key={index}>
                <StyledCard>
                  <CardContent>
                    <TrendCard trend={trend} />
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No trends available.
            </Typography>
          )}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <StyledCard sx={{ flex: 1, maxWidth: 600 }}>
            <CardContent>
              <CardTitle variant="h6">Attrition Risk Summary</CardTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Overall Attrition Risk: {overallAttritionRisk.toFixed(2)}%
              </Typography>
              <GradientProgressBar value={overallAttritionRisk} variant="determinate" />
            </CardContent>
          </StyledCard>

          <StyledCard sx={{ flex: 1, maxWidth: 400 }}>
            <CardContent>
              <CardTitle variant="h6">Manage Surveys</CardTitle>
              <CardDescription variant="body2">
                Create and distribute employee surveys.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/employer/surveys')}>
                Open Survey Manager
              </StyledButton>
            </CardContent>
          </StyledCard>
        </Box>
      </StyledContainer>
    </Box>
  );
};

export default HRAnalyticsTab;