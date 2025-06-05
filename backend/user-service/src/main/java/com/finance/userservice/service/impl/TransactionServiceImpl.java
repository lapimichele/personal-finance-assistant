package com.finance.userservice.service.impl;

import com.finance.userservice.dto.request.TransactionRequest;
import com.finance.userservice.dto.response.TransactionResponse;
import com.finance.userservice.entity.Account;
import com.finance.userservice.entity.Transaction;
import com.finance.userservice.entity.User;
import com.finance.userservice.exception.ResourceNotFoundException;
import com.finance.userservice.repository.AccountRepository;
import com.finance.userservice.repository.TransactionRepository;
import com.finance.userservice.service.TransactionService;
import com.finance.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserService userService;

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(request.getAccountId(), currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(request.getCategory());
        transaction.setAccount(account);
        transaction.setUser(currentUser);

        // Update account balance based on transaction type
        updateAccountBalance(account, transaction);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id) {
        User currentUser = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndAccountUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        User currentUser = userService.getCurrentUser();
        return transactionRepository.findByAccountUser(currentUser).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByAccount(Long accountId) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(accountId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        return transactionRepository.findByAccount(account).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User currentUser = userService.getCurrentUser();
        Transaction existingTransaction = transactionRepository.findByIdAndAccountUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        Account newAccount = accountRepository.findByIdAndUser(request.getAccountId(), currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        // Revert old transaction's effect on account balance
        revertAccountBalance(existingTransaction.getAccount(), existingTransaction);

        existingTransaction.setAmount(request.getAmount());
        existingTransaction.setType(request.getType());
        existingTransaction.setDate(request.getDate());
        existingTransaction.setDescription(request.getDescription());
        existingTransaction.setCategory(request.getCategory());
        existingTransaction.setAccount(newAccount);

        // Apply new transaction's effect on account balance
        updateAccountBalance(newAccount, existingTransaction);

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        return mapToTransactionResponse(updatedTransaction);
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        User currentUser = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndAccountUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        // Revert transaction's effect on account balance
        revertAccountBalance(transaction.getAccount(), transaction);

        transactionRepository.delete(transaction);
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setDate(transaction.getDate());
        response.setDescription(transaction.getDescription());
        response.setCategory(transaction.getCategory());
        response.setAccountId(transaction.getAccount().getId());
        response.setCreatedAt(transaction.getCreatedAt());
        response.setUpdatedAt(transaction.getUpdatedAt());
        return response;
    }

    private void updateAccountBalance(Account account, Transaction transaction) {
        switch (transaction.getType()) {
            case INCOME:
                account.setBalance(account.getBalance().add(transaction.getAmount()));
                break;
            case EXPENSE:
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
                break;
            case TRANSFER:
                // Transfer logic would involve debiting one account and crediting another
                // This is a simplified example, actual transfer would be more complex
                // For now, we'll treat transfers as expenses from the source account
                 account.setBalance(account.getBalance().subtract(transaction.getAmount()));
                break;
        }
        accountRepository.save(account);
    }

    private void revertAccountBalance(Account account, Transaction transaction) {
         switch (transaction.getType()) {
            case INCOME:
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
                break;
            case EXPENSE:
                account.setBalance(account.getBalance().add(transaction.getAmount()));
                break;
            case TRANSFER:
                 // Reverting a transfer would involve crediting the source account
                 // This is a simplified example
                 account.setBalance(account.getBalance().add(transaction.getAmount()));
                break;
        }
        accountRepository.save(account);
    }
} 