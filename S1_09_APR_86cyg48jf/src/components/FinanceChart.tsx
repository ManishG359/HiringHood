import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type Props = {
    selectedYear: number;
  };
  
  function FinanceChart({ selectedYear }: Props) {
    const { transactions } = useTransactions();
  
    const filteredTransactions = transactions.filter(
      (tx) => new Date(tx.date).getFullYear() === selectedYear
    );

  const data = [
    {
      name: 'Investments',
      value: filteredTransactions
        .filter((tx) => tx.title.toLowerCase().includes('investment'))
        .reduce((acc, tx) => acc + tx.amount, 0),
    },
    {
      name: 'Savings',
      value: filteredTransactions
        .filter((tx) => tx.title.toLowerCase().includes('saving'))
        .reduce((acc, tx) => acc + tx.amount, 0),
    },
    {
      name: 'Expenses',
      value: filteredTransactions
        .filter((tx) => tx.type === 'expense')
        .reduce((acc, tx) => acc + tx.amount, 0),
    },
    {
      name: 'Income',
      value: filteredTransactions
        .filter((tx) => tx.type === 'income')
        .reduce((acc, tx) => acc + tx.amount, 0),
    },
  ];

  const filteredData = data.filter(item => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={130}
          label
          isAnimationActive={true} // 🔥
          animationDuration={800}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default FinanceChart;
