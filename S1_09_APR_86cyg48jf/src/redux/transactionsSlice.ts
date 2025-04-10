import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types';
import { fetchTransactions, createTransaction, deleteTransactionApi } from './api';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

// Thunks
export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async () => {
    return await fetchTransactions();
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: Transaction) => {
    return await createTransaction(transaction);
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    await deleteTransactionApi(id);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      })

      // Add transaction
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      })

      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.transactions = state.transactions.filter((tx) => tx.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;
