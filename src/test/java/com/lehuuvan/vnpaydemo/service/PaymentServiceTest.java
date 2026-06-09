package com.lehuuvan.vnpaydemo.service;

import com.lehuuvan.vnpaydemo.config.VnpayProperties;
import com.lehuuvan.vnpaydemo.dto.PaymentResult;
import com.lehuuvan.vnpaydemo.model.OrderStatus;
import com.lehuuvan.vnpaydemo.model.PaymentOrder;
import com.lehuuvan.vnpaydemo.repository.PaymentOrderRepository;
import com.lehuuvan.vnpaydemo.util.VnpayUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PaymentServiceTest {
    private static final String SECRET = "test-secret";

    private PaymentOrderRepository repository;
    private PaymentService service;
    private PaymentOrder order;

    @BeforeEach
    void setUp() {
        VnpayProperties properties = new VnpayProperties();
        properties.setHashSecret(SECRET);
        repository = mock(PaymentOrderRepository.class);
        service = new PaymentService(properties, repository);

        order = new PaymentOrder();
        order.setTxnRef("ORDER-1");
        order.setAmount(10_000L);
        order.setStatus(OrderStatus.PENDING);
        when(repository.findByTxnRef("ORDER-1")).thenReturn(Optional.of(order));
        when(repository.save(any(PaymentOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void invalidSignatureDoesNotChangeOrSaveOrder() {
        Map<String, String> params = baseParams();
        params.put("vnp_SecureHash", "invalid");

        PaymentResult result = service.processVnpayReturn(params);

        assertThat(result.success()).isFalse();
        assertThat(result.validSignature()).isFalse();
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(repository, never()).save(any());
    }

    @Test
    void mismatchedAmountDoesNotMarkOrderPaid() {
        Map<String, String> params = signedParams("999900");

        PaymentResult result = service.processVnpayReturn(params);

        assertThat(result.success()).isFalse();
        assertThat(result.validSignature()).isTrue();
        assertThat(result.validAmount()).isFalse();
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(repository, never()).save(any());
    }

    @Test
    void validSuccessfulReturnMarksOrderPaid() {
        PaymentResult result = service.processVnpayReturn(signedParams("1000000"));

        assertThat(result.success()).isTrue();
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PAID);
        verify(repository).save(order);
    }

    @Test
    void failedReturnLeavesOrderPendingForIpnToConfirm() {
        Map<String, String> params = baseParams();
        params.put("vnp_ResponseCode", "24");
        params.put("vnp_TransactionStatus", "02");
        String signData = VnpayUtil.buildQueryString(params, false);
        params.put("vnp_SecureHash", VnpayUtil.hmacSHA512(SECRET, signData));

        PaymentResult result = service.processVnpayReturn(params);

        assertThat(result.success()).isFalse();
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(repository, never()).save(any());
    }

    @Test
    void invalidIpnSignatureIsRejectedWithoutSaving() {
        Map<String, String> params = baseParams();
        params.put("vnp_SecureHash", "invalid");

        assertThat(service.processIpn(params)).isEqualTo("97");
        verify(repository, never()).save(any());
    }

    private Map<String, String> baseParams() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", "ORDER-1");
        params.put("vnp_Amount", "1000000");
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_TransactionStatus", "00");
        return params;
    }

    private Map<String, String> signedParams(String amount) {
        Map<String, String> params = baseParams();
        params.put("vnp_Amount", amount);
        String signData = VnpayUtil.buildQueryString(params, false);
        params.put("vnp_SecureHash", VnpayUtil.hmacSHA512(SECRET, signData));
        return params;
    }
}
