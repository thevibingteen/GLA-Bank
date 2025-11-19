import { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  type: 'send' | 'receive';
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
  status: 'active' | 'inactive';
}

interface BankContextType {
  accounts: Account[];
  transactions: Transaction[];
  sendMoney: (fromAccount: string, toAccount: string, amount: number, description: string) => void;
  approveTransaction: (transactionId: string) => void;
  rejectTransaction: (transactionId: string) => void;
  getAllAccounts: () => Account[];
  getAllTransactions: () => Transaction[];
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      userId: '1',
      name: 'Primary Checking',
      type: 'checking',
      balance: 5000,
      accountNumber: '****1234',
      status: 'active'
    },
    {
      id: '2',
      userId: '1',
      name: 'Savings Account',
      type: 'savings',
      balance: 10000,
      accountNumber: '****5678',
      status: 'active'
    },
    {
      id: '3',
      userId: '1',
      name: 'Credit Card',
      type: 'credit',
      balance: 0,
      accountNumber: '****9012',
      status: 'active'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const sendMoney = (fromAccount: string, toAccount: string, amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      fromAccount,
      toAccount,
      amount,
      description,
      status: 'pending',
      date: new Date().toISOString(),
      type: 'send'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const approveTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => {
        if (t.id === transactionId && t.status === 'pending') {
          // Update account balances
          setAccounts(accounts => 
            accounts.map(acc => {
              if (acc.id === t.fromAccount) {
                return { ...acc, balance: acc.balance - t.amount };
              }
              if (acc.id === t.toAccount) {
                return { ...acc, balance: acc.balance + t.amount };
              }
              return acc;
            })
          );
          return { ...t, status: 'approved' as const };
        }
        return t;
      })
    );
  };

  const rejectTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId ? { ...t, status: 'rejected' as const } : t
      )
    );
  };

  const getAllAccounts = () => accounts;
  const getAllTransactions = () => transactions;

  return (
    <BankContext.Provider value={{
      accounts,
      transactions,
      sendMoney,
      approveTransaction,
      rejectTransaction,
      getAllAccounts,
      getAllTransactions
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
