package com.finacalc.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CompoundInterestRequest(
        @NotNull @DecimalMin("0") Double principal,
        @NotNull @DecimalMin("0") Double annualRate,
        @NotNull @Min(1) Integer years,
        @NotNull @Min(1) Integer compoundFrequency,
        Double monthlyContribution
) {}
