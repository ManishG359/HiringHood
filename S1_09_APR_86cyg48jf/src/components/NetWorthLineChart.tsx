import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

// Utility: Get month name
const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short' });
};

type Props = {
    selectedYear: number;
  };
  
  function NetWorthLineChart({ selectedYear }: Props) {
    const { transactions } = useTransactions();
  
    const filteredTransactions = transactions.filter(
      (tx) => new Date(tx.date).getFullYear() === selectedYear
    );
  

  // Group transactions by month and calculate net worth
  const monthlyData: Record<string, number> = {};

  filteredTransactions.forEach((tx) => {
    const month = getMonthName(tx.date);
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    if (tx.type === 'income') {
      monthlyData[month] += tx.amount;
    } else {
      monthlyData[month] -= tx.amount;
    }
  });

  // Cumulative sum
  let cumulative = 0;
  const data = Object.entries(monthlyData).map(([month, value]) => {
    cumulative += value;
    return {
      month,
      netWorth: cumulative,
    };
  });

  if (data.length === 0) {
    return <p>No data available for chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="netWorth" stroke="#8884d8" name="Net Worth" isAnimationActive animationDuration={800} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default NetWorthLineChart;
