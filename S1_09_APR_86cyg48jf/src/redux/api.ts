import axios from 'axios';
import { Transaction } from '../types';

const API_URL = 'https://67f4029dcbef97f40d2d085f.mockapi.io/finance/api/transactions';

export const fetchTransactions = async () => {
  const response = await axios.get<Transaction[]>(API_URL);
  return response.data;
};

export const createTransaction = async (transaction: Transaction) => {
  const response = await axios.post<Transaction>(API_URL, transaction);
  return response.data;
};

export const deleteTransactionApi = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
