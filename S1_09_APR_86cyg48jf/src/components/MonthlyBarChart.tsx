import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

// Utility function to get month name
const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short' });
};

type Props = {
    selectedYear: number;
  };
  
  function MonthlyBarChart({ selectedYear }: Props) {
    const { transactions } = useTransactions();
  
    const filteredTransactions = transactions.filter(
      (tx) => new Date(tx.date).getFullYear() === selectedYear
    );

  const monthlyData: Record<string, { income: number; expense: number }> = {};

  filteredTransactions.forEach((tx) => {
    const month = getMonthName(tx.date);
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthlyData[month].income += tx.amount;
    } else {
      monthlyData[month].expense += tx.amount;
    }
  });

  const data = Object.entries(monthlyData).map(([month, values]) => ({
    month,
    ...values,
  }));

  if (data.length === 0) {
    return <p>No data available for chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#00C49F" name="Income" />
        <Bar dataKey="expense" fill="#FF8042" name="Expense" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyBarChart;
