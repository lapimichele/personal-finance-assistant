package com.finance.userservice.service;

import com.finance.userservice.dto.request.AccountRequest;
import com.finance.userservice.dto.response.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Long id, AccountRequest request);
    void deleteAccount(Long id);
    AccountResponse getAccount(Long id);
    List<AccountResponse> getAllAccounts();
    List<AccountResponse> getActiveAccounts();
    void deactivateAccount(Long id);
    void activateAccount(Long id);
} 