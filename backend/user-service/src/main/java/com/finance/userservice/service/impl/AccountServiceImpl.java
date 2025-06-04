package com.finance.userservice.service.impl;

import com.finance.userservice.dto.request.AccountRequest;
import com.finance.userservice.dto.response.AccountResponse;
import com.finance.userservice.entity.Account;
import com.finance.userservice.entity.User;
import com.finance.userservice.exception.ResourceNotFoundException;
import com.finance.userservice.repository.AccountRepository;
import com.finance.userservice.service.AccountService;
import com.finance.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;

    @Override
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        User currentUser = userService.getCurrentUser();

        if (accountRepository.existsByNameAndUser(request.getName(), currentUser)) {
            throw new IllegalArgumentException("Account with this name already exists");
        }

        Account account = new Account();
        account.setName(request.getName());
        account.setType(request.getType());
        account.setCurrency(request.getCurrency());
        account.setBalance(request.getBalance());
        account.setDescription(request.getDescription());
        account.setUser(currentUser);

        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }

    @Override
    @Transactional
    public AccountResponse updateAccount(Long id, AccountRequest request) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        if (!account.getName().equals(request.getName()) &&
            accountRepository.existsByNameAndUser(request.getName(), currentUser)) {
            throw new IllegalArgumentException("Account with this name already exists");
        }

        account.setName(request.getName());
        account.setType(request.getType());
        account.setCurrency(request.getCurrency());
        account.setBalance(request.getBalance());
        account.setDescription(request.getDescription());

        Account updatedAccount = accountRepository.save(account);
        return mapToAccountResponse(updatedAccount);
    }

    @Override
    @Transactional
    public void deleteAccount(Long id) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        accountRepository.delete(account);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccount(Long id) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return mapToAccountResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        User currentUser = userService.getCurrentUser();
        return accountRepository.findByUser(currentUser).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getActiveAccounts() {
        User currentUser = userService.getCurrentUser();
        return accountRepository.findByUserAndActiveTrue(currentUser).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deactivateAccount(Long id) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        account.setActive(false);
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void activateAccount(Long id) {
        User currentUser = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        account.setActive(true);
        accountRepository.save(account);
    }

    private AccountResponse mapToAccountResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setName(account.getName());
        response.setType(account.getType());
        response.setCurrency(account.getCurrency());
        response.setBalance(account.getBalance());
        response.setDescription(account.getDescription());
        response.setActive(account.isActive());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }
} 