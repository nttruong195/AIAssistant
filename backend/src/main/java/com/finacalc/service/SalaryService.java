package com.finacalc.service;

import com.finacalc.dto.request.SalaryRequest;
import com.finacalc.dto.response.SalaryResponse;
import org.springframework.stereotype.Service;

@Service
public class SalaryService {

    private static final double PERSONAL_DEDUCTION    = 11_000_000;
    private static final double DEPENDENT_DEDUCTION   = 4_400_000;
    private static final double BHXH_RATE             = 0.08;
    private static final double BHYT_RATE             = 0.015;
    private static final double BHTN_RATE             = 0.01;
    private static final double BHXH_CAP              = 36_000_000;  // 20 × lương cơ sở 1.8tr
    private static final double BHTN_CAP              = 93_600_000;  // 20 × lương vùng cao nhất

    // Các mốc thu nhập tính thuế lũy tiến (tháng)
    private static final double[] TAX_BRACKETS = {
        5_000_000, 5_000_000, 8_000_000, 14_000_000, 20_000_000, 28_000_000, Double.MAX_VALUE
    };
    private static final double[] TAX_RATES = { 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35 };

    public SalaryResponse calculate(SalaryRequest req) {
        double gross       = req.grossSalary();
        double otherIncome = req.otherIncome() != null ? req.otherIncome() : 0;

        double bhxh          = req.hasInsurance() ? Math.min(gross, BHXH_CAP) * BHXH_RATE : 0;
        double bhyt          = req.hasInsurance() ? Math.min(gross, BHXH_CAP) * BHYT_RATE : 0;
        double bhtn          = req.hasInsurance() ? Math.min(gross, BHTN_CAP) * BHTN_RATE : 0;
        double totalInsurance = bhxh + bhyt + bhtn;

        double taxableIncome      = gross + otherIncome - totalInsurance;
        double personalDeduction  = PERSONAL_DEDUCTION;
        double dependentDeduction = req.dependents() * DEPENDENT_DEDUCTION;
        double taxBase            = Math.max(0, taxableIncome - personalDeduction - dependentDeduction);

        double[] taxPerBracket = calcProgressiveTax(taxBase);
        double totalTax = 0;
        for (double t : taxPerBracket) totalTax += t;

        return new SalaryResponse(
                round(gross), round(bhxh), round(bhyt), round(bhtn),
                round(totalInsurance), round(taxableIncome),
                round(personalDeduction), round(dependentDeduction),
                round(personalDeduction + dependentDeduction), round(taxBase),
                round(totalTax), round(gross - totalInsurance - totalTax),
                new SalaryResponse.TaxBreakdown(
                        round(taxPerBracket[0]), round(taxPerBracket[1]), round(taxPerBracket[2]),
                        round(taxPerBracket[3]), round(taxPerBracket[4]), round(taxPerBracket[5]),
                        round(taxPerBracket[6])
                )
        );
    }

    private double[] calcProgressiveTax(double taxBase) {
        double[] result = new double[TAX_BRACKETS.length];
        double remaining = taxBase;
        for (int i = 0; i < TAX_BRACKETS.length && remaining > 0; i++) {
            double taxable = Math.min(remaining, TAX_BRACKETS[i]);
            result[i] = taxable * TAX_RATES[i];
            remaining -= taxable;
        }
        return result;
    }

    private double round(double v) { return Math.round(v * 100.0) / 100.0; }
}
