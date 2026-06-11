package com.finacalc.service.strategy;

import com.finacalc.dto.response.LoanResponse;

import java.util.List;

public interface LoanCalculationStrategy {
    LoanResponse calculate(double principal, double monthlyRate, int months, double downPayment,
                           List<LoanResponse.MonthlyBreakdown> schedule);
}
