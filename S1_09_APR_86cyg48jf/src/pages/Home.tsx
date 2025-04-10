import { Typography, Stack, Card, CardContent, TextField, MenuItem, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import BalanceSummary from '../components/BalanceSummary';
import TransactionList from '../components/TransactionList';
import FinanceChart from '../components/FinanceChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import NetWorthLineChart from '../components/NetWorthLineChart';
import SavingsAreaChart from '../components/SavingsAreaChart';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line' | 'area'>('pie');

  const renderSelectedChart = () => {
    switch (chartType) {
      case 'pie':
        return <FinanceChart selectedYear={selectedYear} />;
      case 'bar':
        return <MonthlyBarChart selectedYear={selectedYear} />;
      case 'line':
        return <NetWorthLineChart selectedYear={selectedYear} />;
      case 'area':
        return <SavingsAreaChart selectedYear={selectedYear} />;
      default:
        return <Typography>Select a chart to display</Typography>;
    }
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Personal Finance Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your income, expenses, savings, and investments
        </Typography>
      </Box>

      {/* Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <TextField
          select
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          size="small"
        >
          {[2023, 2024, 2025].map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newType) => {
            if (newType !== null) setChartType(newType);
          }}
          size="small"
        >
          <ToggleButton value="pie">Pie Chart</ToggleButton>
          <ToggleButton value="bar">Bar Chart</ToggleButton>
          <ToggleButton value="line">Line Chart</ToggleButton>
          <ToggleButton value="area">Area Chart</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Balance Summary */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Balance Summary
          </Typography>
          <BalanceSummary selectedYear={selectedYear} />
        </CardContent>
      </Card>

      {/* Dynamic Chart with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              mt: 2,
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {chartType === 'pie' && 'Finance Overview'}
                {chartType === 'bar' && 'Monthly Income vs Expense'}
                {chartType === 'line' && 'Net Worth Growth'}
                {chartType === 'area' && 'Cumulative Savings'}
              </Typography>
              {renderSelectedChart()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Transactions */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Transactions
          </Typography>
          <TransactionList selectedYear={selectedYear} />
        </CardContent>
      </Card>
    </Stack>
  );
}

export default Home;
