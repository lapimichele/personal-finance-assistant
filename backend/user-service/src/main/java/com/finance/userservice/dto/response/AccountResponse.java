package com.finance.userservice.dto.response;

import com.finance.userservice.entity.Account.AccountType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private Long id;
    private String name;
    private AccountType type;
    private String currency;
    private BigDecimal balance;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 