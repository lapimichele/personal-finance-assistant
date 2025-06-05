package com.finance.userservice.repository;

import com.finance.userservice.entity.Transaction;
import com.finance.userservice.entity.Account;
import com.finance.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountUser(User user); // Find transactions for a specific user

    List<Transaction> findByAccount(Account account); // Find transactions for a specific account

    Optional<Transaction> findByIdAndAccountUser(Long id, User user); // Find a specific transaction by ID and user

    // You can add more specific query methods here as needed,
    // e.g., findByAccountAndType, findByAccountAndDateBetween, etc.
} 