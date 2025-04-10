import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTransactions } from '../hooks/useTransactions';

type Props = {
  selectedYear: number;
};

function TransactionList({ selectedYear }: Props) {
  const { transactions, remove } = useTransactions();

  const filteredTransactions = transactions.filter(
    (tx) => new Date(tx.date).getFullYear() === selectedYear
  );

  if (filteredTransactions.length === 0) {
    return <Typography>No transactions for {selectedYear}.</Typography>;
  }

  return (
    <List>
      {filteredTransactions.map((tx) => (
        <ListItem
          key={tx.id}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => remove(tx.id)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={`${tx.title} - ₹${tx.amount.toFixed(2)}`}
            secondary={new Date(tx.date).toLocaleDateString()}
            primaryTypographyProps={{
              style: { color: tx.type === 'income' ? 'green' : 'red' },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default TransactionList;
