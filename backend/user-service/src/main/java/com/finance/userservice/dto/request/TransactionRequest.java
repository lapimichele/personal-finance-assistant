package com.finance.userservice.dto.request;

import com.finance.userservice.entity.Transaction.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be zero or positive")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    @NotNull(message = "Transaction date is required")
    private LocalDateTime date;

    private String description;

    private String category;

    @NotNull(message = "Account is required")
    private Long accountId;
} 