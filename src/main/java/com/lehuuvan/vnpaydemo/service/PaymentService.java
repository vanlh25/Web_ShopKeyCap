package com.lehuuvan.vnpaydemo.service;

import com.lehuuvan.vnpaydemo.config.VnpayProperties;
import com.lehuuvan.vnpaydemo.dto.PaymentResult;
import com.lehuuvan.vnpaydemo.model.OrderStatus;
import com.lehuuvan.vnpaydemo.model.PaymentOrder;
import com.lehuuvan.vnpaydemo.repository.PaymentOrderRepository;
import com.lehuuvan.vnpaydemo.util.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {
    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter VNPAY_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VnpayProperties vnpayProperties;
    private final PaymentOrderRepository orderRepository;

    public PaymentService(VnpayProperties vnpayProperties, PaymentOrderRepository orderRepository) {
        this.vnpayProperties = vnpayProperties;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public String createPaymentUrl(Long amount, HttpServletRequest request) {
        validateConfig();

        String txnRef = System.currentTimeMillis() + "";
        String orderInfo = "Thanh toan don hang " + txnRef;

        PaymentOrder order = new PaymentOrder();
        order.setTxnRef(txnRef);
        order.setAmount(amount);
        order.setOrderInfo(orderInfo);
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        LocalDateTime now = LocalDateTime.now(VN_ZONE);
        LocalDateTime expireAt = now.plusMinutes(vnpayProperties.getExpireMinutes());

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", vnpayProperties.getVersion());
        params.put("vnp_Command", vnpayProperties.getCommand());
        params.put("vnp_TmnCode", vnpayProperties.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount * 100));
        params.put("vnp_CurrCode", vnpayProperties.getCurrCode());
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", vnpayProperties.getOrderType());
        params.put("vnp_Locale", vnpayProperties.getLocale());
        params.put("vnp_ReturnUrl", vnpayProperties.getReturnUrl());
        params.put("vnp_IpAddr", VnpayUtil.getIpAddress(request));
        params.put("vnp_CreateDate", now.format(VNPAY_DATE_FORMAT));
        params.put("vnp_ExpireDate", expireAt.format(VNPAY_DATE_FORMAT));

        String signData = VnpayUtil.buildQueryString(params, false);
        String secureHash = VnpayUtil.hmacSHA512(vnpayProperties.getHashSecret(), signData);
        String queryString = VnpayUtil.buildQueryString(params, false);

        return vnpayProperties.getPayUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    @Transactional
    public PaymentResult processVnpayReturn(Map<String, String> params) {
        boolean validSignature = VnpayUtil.verifySecureHash(params, vnpayProperties.getHashSecret());
        String txnRef = params.get("vnp_TxnRef");
        Optional<PaymentOrder> optionalOrder = orderRepository.findByTxnRef(txnRef == null ? "" : txnRef);

        if (optionalOrder.isEmpty()) {
            PaymentOrder notFound = new PaymentOrder();
            notFound.setTxnRef(txnRef == null ? "UNKNOWN" : txnRef);
            notFound.setAmount(parseAmount(params.get("vnp_Amount")));
            notFound.setStatus(OrderStatus.FAILED);
            copyVnpayFields(notFound, params);
            return new PaymentResult(notFound, validSignature, false, false, "Không tìm thấy đơn hàng");
        }

        PaymentOrder order = optionalOrder.get();

        if (!validSignature) {
            return new PaymentResult(order, false, false, false, "Chữ ký VNPAY không hợp lệ");
        }

        if (!order.getAmount().equals(parseAmount(params.get("vnp_Amount")))) {
            return new PaymentResult(order, true, false, false, "Số tiền giao dịch không khớp với đơn hàng");
        }

        boolean paid = isPaid(params);
        if (order.getStatus() != OrderStatus.PAID && paid) {
            copyVnpayFields(order, params);
            order.setStatus(OrderStatus.PAID);
            order = orderRepository.save(order);
        }

        boolean success = order.getStatus() == OrderStatus.PAID && paid;
        String message = success ? "Thanh toán thành công" : "Giao dịch không thành công";
        return new PaymentResult(order, true, true, success, message);
    }

    @Transactional
    public String processIpn(Map<String, String> params) {
        if (!VnpayUtil.verifySecureHash(params, vnpayProperties.getHashSecret())) {
            return "97"; // Invalid checksum
        }

        String txnRef = params.get("vnp_TxnRef");
        Optional<PaymentOrder> optionalOrder = orderRepository.findByTxnRef(txnRef == null ? "" : txnRef);
        if (optionalOrder.isEmpty()) {
            return "01"; // Order not found
        }

        PaymentOrder order = optionalOrder.get();
        Long vnpAmount = parseAmount(params.get("vnp_Amount"));
        if (!order.getAmount().equals(vnpAmount)) {
            return "04"; // Invalid amount
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            return "02"; // Order already confirmed
        }

        copyVnpayFields(order, params);
        order.setStatus(isPaid(params) ? OrderStatus.PAID : OrderStatus.FAILED);
        orderRepository.save(order);
        return "00";
    }

    private boolean isPaid(Map<String, String> params) {
        return "00".equals(params.get("vnp_ResponseCode")) && "00".equals(params.get("vnp_TransactionStatus"));
    }

    private Long parseAmount(String vnpAmount) {
        try {
            return Long.parseLong(vnpAmount) / 100;
        } catch (Exception ex) {
            return 0L;
        }
    }

    private void copyVnpayFields(PaymentOrder order, Map<String, String> params) {
        order.setBankCode(params.get("vnp_BankCode"));
        order.setBankTranNo(params.get("vnp_BankTranNo"));
        order.setCardType(params.get("vnp_CardType"));
        order.setPayDate(params.get("vnp_PayDate"));
        order.setResponseCode(params.get("vnp_ResponseCode"));
        order.setTransactionNo(params.get("vnp_TransactionNo"));
        order.setTransactionStatus(params.get("vnp_TransactionStatus"));
        if (params.get("vnp_OrderInfo") != null) {
            order.setOrderInfo(params.get("vnp_OrderInfo"));
        }
    }

    private void validateConfig() {
        if ("YOUR_TMN_CODE".equals(vnpayProperties.getTmnCode()) || "YOUR_HASH_SECRET".equals(vnpayProperties.getHashSecret())) {
            throw new IllegalStateException("Chưa cấu hình VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET. Xem README.md để cấu hình.");
        }
    }
}
