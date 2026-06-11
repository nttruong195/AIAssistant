package com.finacalc.service;

import com.finacalc.dto.request.LoanRequest;
import com.finacalc.dto.response.LoanResponse;
import com.finacalc.service.strategy.LoanCalculationStrategy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;

@Service
public class LoanService {

    private final Map<String, LoanCalculationStrategy> strategies;

    // Spring tự inject Map<beanName, bean> cho tất cả LoanCalculationStrategy
    public LoanService(Map<String, LoanCalculationStrategy> strategies) {
        this.strategies = strategies;
    }

    public LoanResponse calculate(LoanRequest req) {
        double downPayment = req.downPayment() != null ? req.downPayment() : 0;
        double principal = req.loanAmount() - downPayment;
        double monthlyRate = (req.annualRate() / 100.0) / 12.0;
        String type = req.loanType() != null ? req.loanType().toUpperCase() : "FIXED";

        LoanCalculationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("Loại vay không hợp lệ: " + type + ". Chỉ hỗ trợ FIXED hoặc DECLINING.");
        }

        return strategy.calculate(principal, monthlyRate, req.termMonths(), downPayment, new ArrayList<>());
    }
}
