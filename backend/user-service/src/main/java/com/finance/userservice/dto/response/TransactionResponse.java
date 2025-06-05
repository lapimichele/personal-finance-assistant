package com.finance.userservice.dto.response;

import com.finance.userservice.entity.Transaction.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDateTime date;
    private String description;
    private String category;
    private Long accountId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 