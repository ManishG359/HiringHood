import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { SentimentSatisfiedAlt, SentimentNeutral, SentimentDissatisfied } from '@mui/icons-material';

interface Trend {
  question: string;
  avgScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface TrendCardProps {
  trend: Trend;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'neutral':
        return 'warning';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <SentimentSatisfiedAlt color="success" fontSize="large" />;
      case 'neutral':
        return <SentimentNeutral color="warning" fontSize="large" />;
      case 'negative':
        return <SentimentDissatisfied color="error" fontSize="large" />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {trend.question}
          </Typography>
          {getSentimentIcon(trend.sentiment)}
        </Box>
        <Typography variant="body2" color="text.secondary">
        Average Score: {typeof trend.avgScore === 'number' ? trend.avgScore.toFixed(2) : 'N/A'}
        </Typography>

        <Chip label={trend.sentiment} color={getSentimentColor(trend.sentiment)} size="small" sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
};

export default TrendCard;
