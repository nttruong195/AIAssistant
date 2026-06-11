package com.finacalc.dto.response;

import java.util.List;

public record LoanResponse(
        double loanAmount,
        double monthlyPayment,
        double totalPayment,
        double totalInterest,
        double downPayment,
        List<MonthlyBreakdown> schedule
) {
    public record MonthlyBreakdown(int month, double payment, double principal, double interest, double balance) {}
}
