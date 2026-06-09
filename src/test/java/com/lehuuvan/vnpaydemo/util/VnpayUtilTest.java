package com.lehuuvan.vnpaydemo.util;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class VnpayUtilTest {
    @Test
    void buildsCanonicalVnpayQueryUsingFormUrlEncoding() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TmnCode", "TESTCODE");
        params.put("vnp_OrderInfo", "Thanh toan don hang 123");

        assertThat(VnpayUtil.buildQueryString(params, false))
                .isEqualTo("vnp_OrderInfo=Thanh+toan+don+hang+123&vnp_TmnCode=TESTCODE");
    }

    @Test
    void secureHashCanBeVerifiedFromDecodedResponseValues() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", "ORDER-1");
        params.put("vnp_OrderInfo", "Thanh toan don hang ORDER-1");

        String signData = VnpayUtil.buildQueryString(params, false);
        params.put("vnp_SecureHash", VnpayUtil.hmacSHA512("test-secret", signData));

        assertThat(VnpayUtil.verifySecureHash(params, "test-secret")).isTrue();
    }
}
