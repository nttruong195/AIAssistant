package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SavingsService {

    public record SavingsResult(
            double principal, double annualRate, int termMonths,
            double interest, double finalAmount, double effectiveRate,
            List<Map<String, Object>> monthlyBreakdown
    ) {}

    public SavingsResult calculate(double principal, double annualRate, int termMonths, String interestType) {
        double monthlyRate = annualRate / 100.0 / 12.0;
        double interest;

        if ("MONTHLY".equals(interestType)) {
            interest = principal * monthlyRate * termMonths;
        } else {
            interest = principal * (annualRate / 100.0) * (termMonths / 12.0);
        }

        double finalAmount   = principal + interest;
        double effectiveRate = (interest / principal) / (termMonths / 12.0) * 100;

        List<Map<String, Object>> breakdown = new ArrayList<>();
        double monthlyInterest = interest / termMonths;
        for (int m = 1; m <= Math.min(termMonths, 24); m++) {
            breakdown.add(Map.of(
                "month", m,
                "interest", Math.round(monthlyInterest),
                "cumulative", Math.round(monthlyInterest * m),
                "balance", Math.round(principal + monthlyInterest * m)
            ));
        }

        return new SavingsResult(principal, annualRate, termMonths, interest, finalAmount, effectiveRate, breakdown);
    }
}
