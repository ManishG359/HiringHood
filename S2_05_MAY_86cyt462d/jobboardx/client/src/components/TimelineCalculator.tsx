import React, { useEffect, useState } from 'react';
import {
  TextField, Checkbox, FormControlLabel, Button, Typography,
  Snackbar, Alert as MuiAlert, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import BackToDashboardButton from './BackToEmployerDashboard';


const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const StyledPaper = styled.div`
  background: linear-gradient(135deg, #FAFFCA 0%, #B9D4AA 100%);
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12);
  max-width: 600px;
  margin: 40px auto;
`;

const Title = styled.h2`
  color: #5A827E;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StyledStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StyledTextField = styled(TextField)`

     & input {
      background: #FAFFCA;
      color: black 
    }
        & label.Mui-focused {
    color: #5A827E; 
  }

    & input::placeholder {
      color: black
     
    }

    & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #84AE92;
      
    }

      &:hover fieldset {
      border-color: #5A827E;
      background: #black;
      
    }
    &.Mui-focused fieldset {
      border-color: #5A827E ; 
      
    }

 
    & input::placeholder {
      color: white !important; 
      opacity: 1;
    }
    
  }
  & label {
    color: black
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  align-self: flex-start;
  box-shadow: none;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    box-shadow: none;
  }
`;

const Alert = styled(MuiAlert)`
  border-radius: 8px;
  font-weight: 500;
`;

const TimelineCalculator: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const [candidates, setCandidates] = useState<number>(0);
  const [dailyCapacity, setDailyCapacity] = useState<number>(0);
  const [parallelTracks, setParallelTracks] = useState<number>(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);
  const [holidays, setHolidays] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [minDays, setMinDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchApplicantCount = async () => {
      if (jobId) {
        try {
          const res = await axiosInstance.get(`/jobs/${jobId}`);
          const job = res.data;
          setCandidates(job.hiringTimeline?.candidates || job.applicantCount || 0);
          setDailyCapacity(job.hiringTimeline?.dailyCapacity || 0);
          setParallelTracks(job.hiringTimeline?.parallelTracks || 0);
          setStartDate(dayjs(job.hiringTimeline?.startDate || undefined));
          setExcludeWeekends(job.hiringTimeline?.excludeWeekends ?? true);
        } catch (err) {
          console.error('❌ Failed to prefill timeline:', err);
        }
      }
    };
    fetchApplicantCount();
  }, [jobId]);

  const handleSubmit = async () => {
    try {
      if (!candidates || !dailyCapacity || !parallelTracks || !startDate) {
        setError('Please fill all required fields');
        return;
      }

      const holidayArray = holidays
        .split(',')
        .map(d => d.trim())
        .filter(d => d);

      const payload = {
        jobId,
        candidates,
        dailyCapacity,
        parallelTracks,
        startDate: startDate.format('YYYY-MM-DD'),
        excludeWeekends,
        holidays: holidayArray
      };

      const res = await axiosInstance.post(`/scheduler/timeline`, payload);
      setDates(res.data.scheduleDates);
      setMinDays(res.data.minDays);
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong');
      setDates([]);
    }
  };

  return (
    <>
      <PageBackground />
      <StyledPaper>
        <BackToDashboardButton />
        <Title>Hiring Timeline Calculator</Title>
        <StyledStack>
          <StyledTextField
            label="Candidates"
            type="number"
            value={candidates}
            onChange={(e) => setCandidates(parseInt(e.target.value))}
            fullWidth
          />
          <StyledTextField
            label="Daily Capacity"
            type="number"
            value={dailyCapacity}
            onChange={(e) => setDailyCapacity(parseInt(e.target.value))}
            fullWidth
          />
          <StyledTextField
            label="Parallel Tracks"
            type="number"
            value={parallelTracks}
            onChange={(e) => setParallelTracks(parseInt(e.target.value))}
            fullWidth
          />
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  '& label.Mui-focused': { color: '#5A827E' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#84AE92' },
                    '&:hover fieldset': { borderColor: '#5A827E' },
                    '&.Mui-focused fieldset': { borderColor: '#5A827E', background: '#FAFFCA' }
                  }
                }
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                sx={{
                  color: '#84AE92',
                  '&.Mui-checked': { color: '#5A827E' }
                }}
              />
            }
            label="Exclude Weekends"
          />
          <StyledTextField
            label="Holidays (comma-separated YYYY-MM-DD)"
            value={holidays}
            onChange={(e) => setHolidays(e.target.value)}
            fullWidth
          />

          <StyledButton variant="contained" onClick={handleSubmit}>Calculate</StyledButton>

          {error && <Alert severity="error">{error}</Alert>}
          <Snackbar
            open={success}
            autoHideDuration={3000}
            onClose={() => setSuccess(false)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSuccess(false)}
                
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <Alert severity="success" onClose={() => setSuccess(false)}>
              Timeline calculated & saved
            </Alert>
          </Snackbar>

          {minDays !== null && (
            <>
              <Typography variant="h6" sx={{ color: '#5A827E' }}>Minimum Days: {minDays}</Typography>
              <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>Schedule Dates:</Typography>
              <ul>
                {dates.map((date, idx) => (
                  <li key={idx}>{date}</li>
                ))}
              </ul>
            </>
          )}
        </StyledStack>
      </StyledPaper>
    </>
  );
};

export default TimelineCalculator;