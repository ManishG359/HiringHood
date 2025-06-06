import React, { useState } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import styled from 'styled-components';
import { splitInterviewSlots } from '../services/schedulerService';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
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
  color: #1976D2;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: fixed;
`;

const StyledStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StyledTextField = styled.input<{ error?: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1.5px solid ${({ error }) => (error ? '#f44336' : '#84AE92')};
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #5A827E;
    background: #FAFFCA;
  }
`;

const StyledButton = styled.button`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px; 
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start; 
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.5rem;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(90, 130, 126, 0.08);
`;

const StyledTh = styled.th`
  background: #84AE92;
  color: #fff;
  font-weight: 600;
  padding: 10px;
  text-align: left;
`;

const StyledTd = styled.td`
  padding: 10px;
  border-bottom: 1px solid #B9D4AA;
  color: #333;
`;

const Alert = styled(MuiAlert)`
  border-radius: 8px;
  font-weight: 500;
`;

interface TeamAssignment {
  team: string;
  slots: number[];
}

const SplitInterviews: React.FC = () => {
  const [slots, setSlots] = useState('');
  const [numTeams, setNumTeams] = useState<number | string>('');
  const [bufferTime, setBufferTime] = useState<number | string>(0);
  const [result, setResult] = useState<TeamAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const exportToCSV = () => {
    if (result.length === 0) return;

    const header = ['Team', 'Slots'];
    const rows = result.map(team => [team.team, team.slots.join(' | ')]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'interview_team_slots.csv');
    link.click();
  };

  const handleSubmit = async () => {
    const slotArray = slots
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0);

    const teams = typeof numTeams === 'string' ? parseInt(numTeams) : numTeams;
    const buffer = typeof bufferTime === 'string' ? parseInt(bufferTime) : bufferTime;

    if (slotArray.length === 0 || isNaN(teams) || teams <= 0) {
      setError('Please enter valid slot durations and a positive number of teams.');
      return;
    }

    try {
      const payload = { slots: slotArray, numTeams: teams, bufferTime: buffer };
      const response = await splitInterviewSlots(payload);

      setResult(response.data.teams); 
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'An error occurred');
      setResult([]);
    }
  };
 console.log("Result state:", result);

  return (
    <>
      <PageBackground />
      <StyledPaper>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <div
            style={{
             
              fontWeight: 600,
              background: 'none',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            <BackToDashboardButton />
          </div>
        </div>
        <Title>Interview Slot Optimizer</Title>
        <StyledStack>
          <StyledTextField
            as="input"
            type="text"
            placeholder="Interview Durations (comma-separated, in minutes)"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            error={!!error && slots === ''}
            
          />
          <StyledTextField
            as="input"
            type="number"
            placeholder="Number of Teams"
            value={numTeams}
            onChange={(e) => setNumTeams(e.target.value)}
            error={!!error && (numTeams === '' || Number(numTeams) <= 0)}
          />
          <StyledTextField
            as="input"
            type="number"
            placeholder="Buffer Time (in minutes)"
            value={bufferTime}
            onChange={(e) => setBufferTime(e.target.value)}
            aria-label="Buffer Time"
          />
          <label style={{ color: '#5A827E', fontWeight: 500, marginTop: '-1rem', marginBottom: '0.5rem' }}>
            Buffer Time (in minutes)
          </label>

          <StyledButton onClick={handleSubmit}>Optimize</StyledButton>



          {error && <Alert severity="error">{error}</Alert>}
          <Snackbar
  open={success}
  autoHideDuration={3000}
  onClose={() => setSuccess(false)}
  action={
    <IconButton
      size="large"
      aria-label="close"
      onClick={() => setSuccess(false)}
      sx={{ color: '#d32f2f' }} 
    >
      <CloseIcon fontSize="large" />
    </IconButton>
  }
>
  <Alert severity="success" onClose={() => setSuccess(false)}>
    Optimization complete
  </Alert>
</Snackbar>

          {result.length > 0 && (
            <>
              <Title as="h3" style={{ fontSize: '1.2rem', marginTop: '1.5rem', color: '#1976d2' }}>
                Team Assignments
              </Title>
              <StyledTable>
                <thead>
                  <tr>
                    <StyledTh>Team</StyledTh>
                    <StyledTh>Slots</StyledTh>
                  </tr>
                </thead>
                <tbody>
                  {result.map((team) => (
                    <tr key={team.team}>
                      <StyledTd>{team.team}</StyledTd>
                      <StyledTd>{team.slots.join(', ')}</StyledTd>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
             <StyledButton onClick={exportToCSV} disabled={result.length === 0} style={{ marginLeft: '1rem' }}>
            Export to CSV 
          </StyledButton>
            </>
          )}
        </StyledStack>
      </StyledPaper>
    </>
  );
};

export default SplitInterviews;