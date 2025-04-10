import { Typography, Stack } from '@mui/material';
import { useTransactions } from '../hooks/useTransactions';

type Props = {
  selectedYear: number;
};

function BalanceSummary({ selectedYear }: Props) {
  const { transactions } = useTransactions();

  const filteredTransactions = transactions.filter(
    (tx) => new Date(tx.date).getFullYear() === selectedYear
  );

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Stack spacing={1}>
      <Typography>💰 Balance: ₹{balance.toFixed(2)}</Typography>
      <Typography color="green">⬆️ Income: ₹{totalIncome.toFixed(2)}</Typography>
      <Typography color="red">⬇️ Expenses: ₹{totalExpense.toFixed(2)}</Typography>
    </Stack>
  );
}

export default BalanceSummary;
