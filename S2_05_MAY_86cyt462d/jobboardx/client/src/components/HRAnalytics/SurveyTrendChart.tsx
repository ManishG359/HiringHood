import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography, Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Trend {
  question: string;
  avgScore: number;
}

interface SurveyTrendChartProps {
  trends: Trend[];
}

const SurveyTrendChart: React.FC<SurveyTrendChartProps> = ({ trends }) => {
  const data = {
    labels: trends.map(t => t.question),
    datasets: [
      {
        label: 'Average Score',
        data: trends.map(t => t.avgScore),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Score: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Survey Trend (Avg Scores)
        </Typography>
        <Box sx={{ padding: 2 }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveyTrendChart;
