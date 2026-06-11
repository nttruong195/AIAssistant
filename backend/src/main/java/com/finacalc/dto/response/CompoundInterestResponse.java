package com.finacalc.dto.response;

import java.util.List;

public record CompoundInterestResponse(
        double finalAmount,
        double totalContributed,
        double totalInterest,
        double effectiveRate,
        List<YearlyBreakdown> yearlyBreakdowns
) {
    public record YearlyBreakdown(int year, double balance, double interestEarned, double totalContributed) {}
}
