import { useSelector} from 'react-redux';
import { RootState} from '../redux/store';
import { getTransactions, addTransaction, deleteTransaction } from '../redux/transactionsSlice';
import { Transaction } from '../types';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';

export const useTransactions = () => {
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  const add = (transaction: Transaction) => dispatch(addTransaction(transaction));
  const remove = (id: string) => dispatch(deleteTransaction(id));

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    loading,
    error,
    add,
    remove,
  };
};
