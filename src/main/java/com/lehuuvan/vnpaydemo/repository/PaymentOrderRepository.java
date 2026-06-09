package com.lehuuvan.vnpaydemo.repository;

import com.lehuuvan.vnpaydemo.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    Optional<PaymentOrder> findByTxnRef(String txnRef);
}
