package com.finance.userservice.service;

import com.finance.userservice.dto.request.TransactionRequest;
import com.finance.userservice.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {

    TransactionResponse createTransaction(TransactionRequest request);

    TransactionResponse getTransactionById(Long id);

    List<TransactionResponse> getAllTransactions();

    List<TransactionResponse> getTransactionsByAccount(Long accountId);

    TransactionResponse updateTransaction(Long id, TransactionRequest request);

    void deleteTransaction(Long id);

    // You can add more methods for filtering, reporting, etc. later
} 