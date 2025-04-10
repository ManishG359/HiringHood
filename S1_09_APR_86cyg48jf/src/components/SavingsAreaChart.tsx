import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short' });
};

type Props = {
    selectedYear: number;
  };
  
  function SavingsAreaChart({ selectedYear }: Props) {
    const { transactions } = useTransactions();
  
    const filteredTransactions = transactions.filter(
      (tx) => new Date(tx.date).getFullYear() === selectedYear
    );

  const monthlyData: Record<string, number> = {};

  filteredTransactions.forEach((tx) => {
    const month = getMonthName(tx.date);
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    if (tx.title.toLowerCase().includes('saving')) {
      monthlyData[month] += tx.amount;
    }
  });

  let cumulative = 0;
  const data = Object.entries(monthlyData).map(([month, value]) => {
    cumulative += value;
    return {
      month,
      savings: cumulative,
    };
  });

  if (data.length === 0) {
    return <p>No data available for chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="savings" stroke="#00C49F" fill="#00C49F" name="Cumulative Savings" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default SavingsAreaChart;
