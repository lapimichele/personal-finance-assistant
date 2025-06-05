export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER'
}

export interface TransactionRequest {
    amount: number;
    type: TransactionType;
    date: string; // Using string for simplicity, can use Date object
    description?: string;
    category?: string;
    accountId: number;
}

export interface TransactionResponse extends TransactionRequest {
    id: number;
    createdAt: string;
    updatedAt: string;
} 