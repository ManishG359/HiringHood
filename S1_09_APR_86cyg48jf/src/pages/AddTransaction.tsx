import { useState } from 'react';
import { TextField, Button, MenuItem, Stack, Typography, Card, CardContent, Box } from '@mui/material';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function AddTransaction() {
  const { add } = useTransactions();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !date) {
      alert('Please fill in all fields');
      return;
    }

    add({
      id: uuidv4(),
      title,
      amount,
      type,
      date,
    });

    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
            Add New Transaction
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                fullWidth
                required
              />

              <TextField
                select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                fullWidth
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>

              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />

              <Button type="submit" variant="contained" fullWidth size="large">
                Add Transaction
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTransaction;
