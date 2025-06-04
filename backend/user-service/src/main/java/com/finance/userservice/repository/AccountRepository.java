package com.finance.userservice.repository;

import com.finance.userservice.entity.Account;
import com.finance.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    List<Account> findByUserAndActiveTrue(User user);
    Optional<Account> findByIdAndUser(Long id, User user);
    boolean existsByNameAndUser(String name, User user);
} 