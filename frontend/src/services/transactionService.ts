import { api } from './api';
import type { TransactionRequest, TransactionResponse } from '../types/transaction';

export const transactionService = {
    createTransaction: async (request: TransactionRequest): Promise<TransactionResponse> => {
        const response = await api.post<TransactionResponse>('/transactions', request);
        return response.data;
    },

    getTransactionById: async (id: number): Promise<TransactionResponse> => {
        const response = await api.get<TransactionResponse>(`/transactions/${id}`);
        return response.data;
    },

    getAllTransactions: async (): Promise<TransactionResponse[]> => {
        const response = await api.get<TransactionResponse[]>('/transactions');
        return response.data;
    },

    getTransactionsByAccount: async (accountId: number): Promise<TransactionResponse[]> => {
        const response = await api.get<TransactionResponse[]>(`/transactions/account/${accountId}`);
        return response.data;
    },

    updateTransaction: async (id: number, request: TransactionRequest): Promise<TransactionResponse> => {
        const response = await api.put<TransactionResponse>(`/transactions/${id}`, request);
        return response.data;
    },

    deleteTransaction: async (id: number): Promise<void> => {
        await api.delete(`/transactions/${id}`);
    },
}; 