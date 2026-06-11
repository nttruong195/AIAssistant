package com.finacalc.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LoanRequest(
        @NotNull @DecimalMin("1") Double loanAmount,
        @NotNull @DecimalMin("0") Double annualRate,
        @NotNull @Min(1) Integer termMonths,
        Double downPayment,
        String loanType
) {}
