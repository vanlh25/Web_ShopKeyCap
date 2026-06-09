package com.lehuuvan.vnpaydemo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreatePaymentRequest {
    @NotNull(message = "Số tiền không được để trống")
    @Min(value = 1000, message = "Số tiền tối thiểu là 1.000 VND")
    @Max(value = 100000000, message = "Số tiền tối đa là 100.000.000 VND")
    private Long amount;

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
}
