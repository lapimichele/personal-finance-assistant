import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../services/accountService';
import type { AccountResponse } from '../types/account';
import { AccountType } from '../types/account';
import { useAuth } from '../contexts/AuthContext';

export default function Accounts() {
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAccounts();
    }, [user, navigate]);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountService.getAllAccounts();
            setAccounts(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch accounts. Please try again later.');
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: number) => {
        try {
            await accountService.deactivateAccount(id);
            await fetchAccounts();
        } catch (err) {
            setError('Failed to deactivate account. Please try again later.');
            console.error('Error deactivating account:', err);
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await accountService.activateAccount(id);
            await fetchAccounts();
        } catch (err) {
            setError('Failed to activate account. Please try again later.');
            console.error('Error activating account:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }
        try {
            await accountService.deleteAccount(id);
            await fetchAccounts();
        } catch (err) {
            setError('Failed to delete account. Please try again later.');
            console.error('Error deleting account:', err);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Accounts</h1>
                <button
                    onClick={() => navigate('/accounts/new')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    Add New Account
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        className="bg-white rounded-lg shadow-md p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{account.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{account.type}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    account.active
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}
                            >
                                {account.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                            <p className="">
                                <span className="font-medium">Balance:</span>{' '}
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: account.currency,
                                }).format(account.balance)}
                            </p>
                            {account.description && (
                                <p className="">
                                    <span className="font-medium">Description:</span>{' '}
                                    {account.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => navigate(`/accounts/${account.id}/edit`)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Edit
                            </button>
                            {account.active ? (
                                <button
                                    onClick={() => handleDeactivate(account.id)}
                                    className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                                >
                                    Deactivate
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleActivate(account.id)}
                                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                >
                                    Activate
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(account.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {accounts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg dark:text-gray-400">
                        You don't have any accounts yet. Create your first account to get started!
                    </p>
                </div>
            )}
        </div>
    );
} 