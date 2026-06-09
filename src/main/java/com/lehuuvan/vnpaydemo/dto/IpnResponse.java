package com.lehuuvan.vnpaydemo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IpnResponse {
    @JsonProperty("RspCode")
    private String RspCode;

    @JsonProperty("Message")
    private String Message;

    public IpnResponse(String rspCode, String message) {
        RspCode = rspCode;
        Message = message;
    }

    @JsonProperty("RspCode")
    public String getRspCode() { return RspCode; }

    @JsonProperty("Message")
    public String getMessage() { return Message; }
}
