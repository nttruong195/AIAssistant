package com.finacalc.dto.response;

public record SalaryResponse(
        double grossSalary,
        double bhxh,
        double bhyt,
        double bhtn,
        double totalInsurance,
        double taxableIncome,
        double personalDeduction,
        double dependentDeduction,
        double totalDeduction,
        double taxBase,
        double pitTax,
        double netSalary,
        TaxBreakdown taxBreakdown
) {
    public record TaxBreakdown(
            double bracket1, double bracket2, double bracket3, double bracket4,
            double bracket5, double bracket6, double bracket7
    ) {}
}
