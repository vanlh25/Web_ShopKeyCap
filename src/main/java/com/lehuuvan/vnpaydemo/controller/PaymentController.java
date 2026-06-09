package com.lehuuvan.vnpaydemo.controller;

import com.lehuuvan.vnpaydemo.dto.CreatePaymentRequest;
import com.lehuuvan.vnpaydemo.dto.IpnResponse;
import com.lehuuvan.vnpaydemo.dto.PaymentResult;
import com.lehuuvan.vnpaydemo.model.PaymentOrder;
import com.lehuuvan.vnpaydemo.repository.PaymentOrderRepository;
import com.lehuuvan.vnpaydemo.service.PaymentService;
import com.lehuuvan.vnpaydemo.util.VnpayUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Controller
public class PaymentController {
    private final PaymentService paymentService;
    private final PaymentOrderRepository orderRepository;

    public PaymentController(PaymentService paymentService, PaymentOrderRepository orderRepository) {
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/")
    public String home(Model model) {
        if (!model.containsAttribute("paymentRequest")) {
            CreatePaymentRequest request = new CreatePaymentRequest();
            request.setAmount(10000L);
            model.addAttribute("paymentRequest", request);
        }
        List<PaymentOrder> orders = orderRepository.findAll();
        model.addAttribute("orders", orders);
        return "index";
    }

    @PostMapping("/pay")
    public String pay(@Valid @ModelAttribute("paymentRequest") CreatePaymentRequest paymentRequest,
            BindingResult bindingResult,
            HttpServletRequest servletRequest,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.paymentRequest",
                    bindingResult);
            redirectAttributes.addFlashAttribute("paymentRequest", paymentRequest);
            return "redirect:/";
        }
        try {
            String paymentUrl = paymentService.createPaymentUrl(paymentRequest.getAmount(), servletRequest);
            return "redirect:" + paymentUrl;
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
            return "redirect:/";
        }
    }

    @GetMapping("/vnpay-return")
    public String vnpayReturn(HttpServletRequest request, Model model) {
        Map<String, String> params = VnpayUtil.getVnpayParams(request);
        PaymentResult result = paymentService.processVnpayReturn(params);
        model.addAttribute("order", result.order());
        model.addAttribute("result", result);
        model.addAttribute("success", result.success());
        return "result";
    }

    @GetMapping("/api/vnpay-ipn")
    @ResponseBody
    public IpnResponse vnpayIpn(HttpServletRequest request) {
        Map<String, String> params = VnpayUtil.getVnpayParams(request);
        String code = paymentService.processIpn(params);
        return switch (code) {
            case "00" -> new IpnResponse("00", "Confirm Success");
            case "01" -> new IpnResponse("01", "Order not found");
            case "02" -> new IpnResponse("02", "Order already confirmed");
            case "04" -> new IpnResponse("04", "Invalid amount");
            case "97" -> new IpnResponse("97", "Invalid checksum");
            default -> new IpnResponse("99", "Unknown error");
        };
    }
}
