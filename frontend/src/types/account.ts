export enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    CREDIT_CARD = 'CREDIT_CARD',
    INVESTMENT = 'INVESTMENT',
    LOAN = 'LOAN',
    OTHER = 'OTHER'
}

export interface AccountRequest {
    name: string;
    type: AccountType;
    currency: string;
    balance: number;
    description?: string;
}

export interface AccountResponse {
    id: number;
    name: string;
    type: AccountType;
    currency: string;
    balance: number;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
} 