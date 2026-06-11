package com.finacalc.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SalaryRequest(
        @NotNull @DecimalMin("0") Double grossSalary,
        @Min(0) int dependents,
        Double otherIncome,
        boolean hasInsurance
) {}
