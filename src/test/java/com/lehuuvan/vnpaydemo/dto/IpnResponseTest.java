package com.lehuuvan.vnpaydemo.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IpnResponseTest {
    @Test
    void serializesUsingVnpayFieldNames() throws Exception {
        String json = new ObjectMapper().writeValueAsString(new IpnResponse("97", "Invalid checksum"));

        assertThat(json).isEqualTo("{\"RspCode\":\"97\",\"Message\":\"Invalid checksum\"}");
    }
}
