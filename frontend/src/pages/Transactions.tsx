import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import type { TransactionResponse } from '../types/transaction';
import { useAuth } from '../contexts/AuthContext';
import type { AccountResponse } from '../types/account';
import { accountService } from '../services/accountService';

export default function Transactions() {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<number | 'all' | undefined>('all');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAccounts();
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user, selectedAccount]); // Refetch when user or selectedAccount changes

    const fetchAccounts = async () => {
        try {
            const data = await accountService.getAllAccounts();
            setAccounts(data);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            let data: TransactionResponse[] = [];
            if (selectedAccount === 'all') {
                data = await transactionService.getAllTransactions();
            } else if (selectedAccount !== undefined) {
                data = await transactionService.getTransactionsByAccount(selectedAccount);
            }
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch transactions. Please try again later.');
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        try {
            await transactionService.deleteTransaction(id);
            await fetchTransactions(); // Refresh the list
        } catch (err) {
            setError('Failed to delete transaction. Please try again later.');
            console.error('Error deleting transaction:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-300"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                <button
                    onClick={() => navigate('/transactions/new')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    Add New Transaction
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Account:</label>
                <select
                    id="account-select"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="mt-1 block w-full md:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="all">All Accounts</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>


            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Category
                            </th>
                             <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Account
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Type
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Amount
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {transaction.description || '-'}
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {transaction.category || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                     {accounts.find(acc => acc.id === transaction.accountId)?.name || 'Unknown Account'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.type === 'INCOME'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : transaction.type === 'EXPENSE'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                        }`}
                                    >
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                     {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                         currency: accounts.find(acc => acc.id === transaction.accountId)?.currency || 'USD',
                                    }).format(transaction.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {transactions.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
                    No transactions found.
                </div>
            )}
        </div>
    );
} 