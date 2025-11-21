import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { accountsAPI, transactionsAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  _id?: string;
  fromAccount?: string | { _id: string; name: string; accountNumber: string };
  toAccount?: string | { _id: string; name: string; accountNumber: string };
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal' | 'transfer';
  category?: string;
}

export interface Account {
  id?: string;
  _id?: string;
  userId?: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
  status: 'active' | 'inactive' | 'closed';
}

interface BankContextType {
  accounts: Account[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  sendMoney: (fromAccount: string, toAccount: string, amount: number, description: string) => Promise<void>;
  approveTransaction: (transactionId: string) => Promise<void>;
  rejectTransaction: (transactionId: string) => Promise<void>;
  getAllAccounts: () => Account[];
  getAllTransactions: () => Transaction[];
  addAccount: (name: string, type: 'checking' | 'savings' | 'credit', initialBalance?: number) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize account data
  const normalizeAccount = (acc: any): Account => ({
    id: acc._id || acc.id,
    _id: acc._id,
    userId: acc.userId,
    name: acc.name,
    type: acc.type,
    balance: acc.balance,
    accountNumber: acc.accountNumber,
    status: acc.status
  });

  // Normalize transaction data
  const normalizeTransaction = (tx: any): Transaction => ({
    id: tx._id || tx.id,
    _id: tx._id,
    fromAccount: tx.fromAccount?._id || tx.fromAccount,
    toAccount: tx.toAccount?._id || tx.toAccount,
    amount: tx.amount,
    description: tx.description,
    status: tx.status,
    date: tx.date || tx.createdAt,
    type: tx.type,
    category: tx.category
  });

  // Load accounts from API
  const loadAccounts = useCallback(async () => {
    if (!isAuthenticated) {
      setAccounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await accountsAPI.getAll();
      setAccounts(data.map(normalizeAccount));
    } catch (err: any) {
      console.error('Failed to load accounts:', err);
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await transactionsAPI.getAll({ limit: 100 });
      setTransactions(data.map(normalizeTransaction));
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load data on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      loadAccounts();
      loadTransactions();
    } else {
      setAccounts([]);
      setTransactions([]);
    }
  }, [isAuthenticated, loadAccounts, loadTransactions]);

  const sendMoney = async (fromAccount: string, toAccount: string, amount: number, description: string) => {
    try {
      setError(null);
      await transactionsAPI.create({
        fromAccount,
        toAccount,
        amount,
        description,
        type: 'send'
      });
      await loadTransactions();
      await loadAccounts(); // Refresh to get updated balances
    } catch (err: any) {
      console.error('Failed to send money:', err);
      setError(err.message || 'Failed to send money');
      throw err;
    }
  };

  const approveTransaction = async (transactionId: string) => {
    try {
      setError(null);
      await transactionsAPI.approve(transactionId);
      await loadTransactions();
      await loadAccounts(); // Refresh to get updated balances
    } catch (err: any) {
      console.error('Failed to approve transaction:', err);
      setError(err.message || 'Failed to approve transaction');
      throw err;
    }
  };

  const rejectTransaction = async (transactionId: string) => {
    try {
      setError(null);
      await transactionsAPI.reject(transactionId);
      await loadTransactions();
    } catch (err: any) {
      console.error('Failed to reject transaction:', err);
      setError(err.message || 'Failed to reject transaction');
      throw err;
    }
  };

  const getAllAccounts = () => accounts;
  const getAllTransactions = () => transactions;

  const addAccount = async (name: string, type: 'checking' | 'savings' | 'credit', initialBalance: number = 0) => {
    try {
      setError(null);
      const newAccount = await accountsAPI.create(name, type, initialBalance);
      setAccounts(prev => [...prev, normalizeAccount(newAccount)]);
    } catch (err: any) {
      console.error('Failed to add account:', err);
      setError(err.message || 'Failed to add account');
      throw err;
    }
  };

  const refreshAccounts = loadAccounts;
  const refreshTransactions = loadTransactions;

  return (
    <BankContext.Provider value={{
      accounts,
      transactions,
      loading,
      error,
      sendMoney,
      approveTransaction,
      rejectTransaction,
      getAllAccounts,
      getAllTransactions,
      addAccount,
      refreshAccounts,
      refreshTransactions
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}
