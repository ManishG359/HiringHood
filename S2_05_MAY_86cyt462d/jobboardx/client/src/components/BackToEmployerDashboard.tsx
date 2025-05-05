
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BackToDashboardButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" onClick={() => navigate('/employer/dashboard')}>
      ⬅ Back to Dashboard
    </Button>
  );
}

export default BackToDashboardButton;
