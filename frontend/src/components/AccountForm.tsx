import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AccountRequest, AccountResponse } from '../types/account';
import { AccountType } from '../types/account';
import { accountService } from '../services/accountService';

interface AccountFormProps {
    onSuccess?: () => void;
}

export default function AccountForm({ onSuccess }: AccountFormProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const accountId = id ? parseInt(id, 10) : undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<AccountRequest>({
        name: '',
        type: AccountType.CHECKING,
        currency: 'USD',
        balance: 0,
        description: '',
    });

    useEffect(() => {
        if (accountId) {
            fetchAccount();
        }
    }, [accountId]);

    const fetchAccount = async () => {
        try {
            setLoading(true);
            const account = await accountService.getAccount(accountId!);
            setFormData({
                name: account.name,
                type: account.type,
                currency: account.currency,
                balance: account.balance,
                description: account.description || '',
            });
        } catch (err) {
            setError('Failed to fetch account details. Please try again later.');
            console.error('Error fetching account:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (accountId) {
                await accountService.updateAccount(accountId, formData);
            } else {
                await accountService.createAccount(formData);
            }

            onSuccess?.();
            navigate('/accounts');
        } catch (err) {
            setError('Failed to save account. Please try again later.');
            console.error('Error saving account:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'balance' ? parseFloat(value) || 0 : value,
        }));
    };

    if (loading && accountId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {accountId ? 'Edit Account' : 'Create New Account'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Account Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Account Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {Object.values(AccountType).map((type) => (
                            <option key={type} value={type}>
                                {type.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Currency
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                        Initial Balance
                    </label>
                    <input
                        type="number"
                        id="balance"
                        name="balance"
                        value={formData.balance}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/accounts')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : accountId ? 'Update Account' : 'Create Account'}
                    </button>
                </div>
            </form>
        </div>
    );
} 