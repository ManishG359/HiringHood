import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Trend {
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface SentimentPieProps {
  trends: Trend[];
}

const SentimentPie: React.FC<SentimentPieProps> = ({ trends }) => {
  const sentimentCounts = trends.reduce(
    (acc, trend) => {
      acc[trend.sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          sentimentCounts.positive,
          sentimentCounts.neutral,
          sentimentCounts.negative,
        ],
        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350'],
        borderWidth: 1,
        borderColor: '#fff',
        hoverOffset: 6,
      },
    ],
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Sentiment Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pie data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentPie;
