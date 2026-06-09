package com.lehuuvan.vnpaydemo.dto;

import com.lehuuvan.vnpaydemo.model.PaymentOrder;

public record PaymentResult(
        PaymentOrder order,
        boolean validSignature,
        boolean validAmount,
        boolean success,
        String message
) {
}
