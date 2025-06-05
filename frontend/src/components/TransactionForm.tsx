import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import type { TransactionRequest, TransactionResponse } from '../types/transaction';
import { TransactionType } from '../types/transaction';
import type { AccountResponse } from '../types/account';
import { useAuth } from '../contexts/AuthContext';

const transactionFormSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.nativeEnum(TransactionType, { required_error: "Transaction type is required" }),
    date: z.string().min(1, "Date is required"), // Use string for simplicity with input type="date"
    description: z.string().optional(),
    category: z.string().optional(),
    accountId: z.number({ required_error: "Account is required" }).positive("Account is required"),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export default function TransactionForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const transactionId = id ? parseInt(id, 10) : undefined;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);

    const { handleSubmit, register, control, setValue, formState: { errors } } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            amount: 0,
            type: TransactionType.EXPENSE,
            date: '', // Initialize with empty string
            description: '',
            category: '',
            accountId: undefined, // Will be set after fetching accounts or for edit
        },
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAccounts();
        if (transactionId) {
            fetchTransaction(transactionId);
        }
    }, [user, transactionId, navigate]);

    const fetchAccounts = async () => {
        try {
            const data = await accountService.getAllAccounts();
            setAccounts(data);
            // Set a default account if creating a new transaction and accounts are available
            if (!transactionId && data.length > 0) {
                setValue('accountId', data[0].id);
            }
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError('Failed to load accounts.');
        }
    };

    const fetchTransaction = async (id: number) => {
        try {
            setLoading(true);
            const transaction = await transactionService.getTransactionById(id);
            setValue('amount', transaction.amount); // Removed .toNumber()
            setValue('type', transaction.type);
            // Format date to YYYY-MM-DD for input type="date"
            setValue('date', new Date(transaction.date).toISOString().split('T')[0]);
            setValue('description', transaction.description || '');
            setValue('category', transaction.category || '');
            setValue('accountId', transaction.accountId);
            setError(null);
        } catch (err) {
            setError('Failed to fetch transaction details. Please try again later.');
            console.error('Error fetching transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: TransactionFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const transactionData = {
                 ...values,
                 date: new Date(values.date).toISOString(), // Convert date string to ISO string for backend
                 amount: values.amount, // Ensure amount is number
            };

            if (transactionId) {
                await transactionService.updateTransaction(transactionId, transactionData as TransactionRequest);
            } else {
                await transactionService.createTransaction(transactionData as TransactionRequest);
            }

            navigate('/transactions');
        } catch (err: any) {
             // Check if the error has a response and a message
             const errorMessage = err.response?.data?.message || 'Failed to save transaction. Please try again later.';
             setError(errorMessage);
             console.error('Error saving transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && transactionId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-300"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {transactionId ? 'Edit Transaction' : 'Add New Transaction'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        step="0.01"
                        {...register('amount', { valueAsNumber: true })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    />
                    {errors.amount && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>}
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Transaction Type
                    </label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                            >
                                {Object.values(TransactionType).map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.type && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>}
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date
                    </label>
                     <input
                        type="date"
                        id="date"
                        {...register('date')}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    />
                    {errors.date && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    />
                    {errors.description && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category (Optional)
                    </label>
                    <input
                        type="text"
                        id="category"
                         {...register('category')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    />
                    {errors.category && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>}
                </div>

                <div>
                     <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account
                    </label>
                    <Controller
                         name="accountId"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                required
                                // Convert value to number for react-hook-form
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                            >
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                         )}
                    />
                    {errors.accountId && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.accountId.message}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/transactions')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800 dark:focus:ring-blue-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                    >
                        {loading ? 'Saving...' : transactionId ? 'Update Transaction' : 'Create Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
} 