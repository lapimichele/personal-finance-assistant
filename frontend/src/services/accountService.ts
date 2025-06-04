import { api } from './api';
import type { AccountResponse } from '../types/account';
import type { AccountRequest } from '../types/account';

export const accountService = {
    createAccount: async (request: AccountRequest): Promise<AccountResponse> => {
        const response = await api.post<AccountResponse>('/accounts', request);
        return response.data;
    },

    updateAccount: async (id: number, request: AccountRequest): Promise<AccountResponse> => {
        const response = await api.put<AccountResponse>(`/accounts/${id}`, request);
        return response.data;
    },

    deleteAccount: async (id: number): Promise<void> => {
        await api.delete(`/accounts/${id}`);
    },

    getAccount: async (id: number): Promise<AccountResponse> => {
        const response = await api.get<AccountResponse>(`/accounts/${id}`);
        return response.data;
    },

    getAllAccounts: async (): Promise<AccountResponse[]> => {
        const response = await api.get<AccountResponse[]>('/accounts');
        return response.data;
    },

    getActiveAccounts: async (): Promise<AccountResponse[]> => {
        const response = await api.get<AccountResponse[]>('/accounts/active');
        return response.data;
    },

    deactivateAccount: async (id: number): Promise<void> => {
        await api.post(`/accounts/${id}/deactivate`);
    },

    activateAccount: async (id: number): Promise<void> => {
        await api.post(`/accounts/${id}/activate`);
    }
}; 