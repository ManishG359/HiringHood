import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';

interface TimelineSummaryProps {
  startDate?: string;
  calculatedDays?: number;
  calculatedDates?: string[];
  candidates?: number;
}

const TimelineSummary: React.FC<TimelineSummaryProps> = ({
  startDate,
  calculatedDays,
  calculatedDates,
  candidates
}) => {
  if (!startDate || !calculatedDays) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        Interview Timeline
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2">
          <strong>Start Date:</strong> {dayjs(startDate).format('MMM D, YYYY')}
        </Typography>
        <Typography variant="body2">
          <strong>Expected Duration:</strong> {calculatedDays} day{calculatedDays > 1 ? 's' : ''}
        </Typography>
        {calculatedDates && calculatedDates.length > 0 && (
          <Typography variant="body2">
            <strong>Scheduled Dates:</strong> {calculatedDates.join(', ')}
          </Typography>
        )}
        {candidates !== undefined && (
          <Typography variant="body2">
            <strong>Applicants So Far:</strong> {candidates}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TimelineSummary;
