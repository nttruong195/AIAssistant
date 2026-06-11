package com.finacalc.service.strategy;

import com.finacalc.dto.response.LoanResponse;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Phương pháp trả đều (Annuity) — số tiền mỗi tháng cố định
 */
@Component("FIXED")
public class FixedLoanStrategy implements LoanCalculationStrategy {

    @Override
    public LoanResponse calculate(double principal, double monthlyRate, int months,
                                  double downPayment, List<LoanResponse.MonthlyBreakdown> schedule) {
        double monthlyPayment = monthlyRate == 0
                ? principal / months
                : principal * monthlyRate * Math.pow(1 + monthlyRate, months)
                  / (Math.pow(1 + monthlyRate, months) - 1);

        double balance = principal;
        double totalInterest = 0;

        for (int m = 1; m <= months; m++) {
            double interest = balance * monthlyRate;
            double principalPart = monthlyPayment - interest;
            balance -= principalPart;
            totalInterest += interest;

            if (m <= 24 || m == months) {
                schedule.add(new LoanResponse.MonthlyBreakdown(
                        m, round(monthlyPayment), round(principalPart),
                        round(interest), round(Math.max(0, balance))
                ));
            }
        }

        return new LoanResponse(round(principal), round(monthlyPayment),
                round(monthlyPayment * months), round(totalInterest), round(downPayment), schedule);
    }

    private double round(double v) { return Math.round(v * 100.0) / 100.0; }
}
