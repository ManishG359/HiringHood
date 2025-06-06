import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Stack, TextField, Checkbox,
  FormControlLabel, Button, Snackbar, Alert
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const JobTimelineEditor: React.FC = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('');
  const [parallelTracks, setParallelTracks] = useState('');
  const [startDate, setStartDate] = useState('');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [holidays, setHolidays] = useState('');
  const [minDays, setMinDays] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${jobId}`);
        const j = res.data;
        setJob(j);
        if (j.hiringTimeline) {
          setCandidates(j.hiringTimeline.candidates || '');
          setDailyCapacity(j.hiringTimeline.dailyCapacity || '');
          setParallelTracks(j.hiringTimeline.parallelTracks || '');
          setStartDate(j.hiringTimeline.startDate || '');
          setExcludeWeekends(j.hiringTimeline.excludeWeekends || false);
          setHolidays((j.hiringTimeline.holidays || []).join(', '));
          setMinDays(j.hiringTimeline.calculatedDays || null);
        }
      } catch (err) {
        setError('Failed to load job data.');
      }
    };
    fetchJob();
  }, [jobId]);

  const handleSave = async () => {
    const payload = {
      candidates: parseInt(candidates),
      dailyCapacity: parseInt(dailyCapacity),
      parallelTracks: parseInt(parallelTracks),
      startDate,
      excludeWeekends,
      holidays: holidays.split(',').map(h => h.trim()).filter(Boolean),
    };

    try {
      const res = await axiosInstance.post('/scheduler/timeline/save', {
        jobId,
        payload,
      });
      setMinDays(res.data.timeline.calculatedDays);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save timeline.');
    }
  };

  return (
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>Job Timeline Editor</Typography>
      {job && <Typography variant="subtitle1" mb={2}><strong>Job:</strong> {job.title}</Typography>}

      <Stack spacing={2}>
        <TextField
          label="Number of Candidates"
          type="number"
          value={candidates}
          onChange={(e) => setCandidates(e.target.value)}
        />
        <TextField
          label="Daily Interview Capacity"
          type="number"
          value={dailyCapacity}
          onChange={(e) => setDailyCapacity(e.target.value)}
        />
        <TextField
          label="Parallel Interview Tracks"
          type="number"
          value={parallelTracks}
          onChange={(e) => setParallelTracks(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox checked={excludeWeekends} onChange={(e) => setExcludeWeekends(e.target.checked)} />}
          label="Exclude Weekends"
        />
        <TextField
          label="Holidays (comma-separated YYYY-MM-DD)"
          value={holidays}
          onChange={(e) => setHolidays(e.target.value)}
        />

        <Button variant="contained" onClick={handleSave}>Save Timeline</Button>
        {minDays !== null && (
          <Typography variant="body1">Calculated Duration: <strong>{minDays} day(s)</strong></Typography>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Timeline saved successfully
          </Alert>
        </Snackbar>
      </Stack>
    </Paper>
  );
};

export default JobTimelineEditor;
