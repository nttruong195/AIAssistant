package com.finacalc.service.strategy;

import com.finacalc.dto.response.LoanResponse;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Phương pháp dư nợ giảm dần — gốc cố định, lãi giảm theo tháng
 */
@Component("DECLINING")
public class DecliningLoanStrategy implements LoanCalculationStrategy {

    @Override
    public LoanResponse calculate(double principal, double monthlyRate, int months,
                                  double downPayment, List<LoanResponse.MonthlyBreakdown> schedule) {
        double principalPerMonth = principal / months;
        double balance = principal;
        double totalPayment = 0;
        double totalInterest = 0;
        double firstMonthPayment = 0;

        for (int m = 1; m <= months; m++) {
            double interest = balance * monthlyRate;
            double payment = principalPerMonth + interest;
            balance -= principalPerMonth;
            totalPayment += payment;
            totalInterest += interest;
            if (m == 1) firstMonthPayment = payment;

            if (m <= 24 || m == months) {
                schedule.add(new LoanResponse.MonthlyBreakdown(
                        m, round(payment), round(principalPerMonth),
                        round(interest), round(Math.max(0, balance))
                ));
            }
        }

        return new LoanResponse(round(principal), round(firstMonthPayment),
                round(totalPayment), round(totalInterest), round(downPayment), schedule);
    }

    private double round(double v) { return Math.round(v * 100.0) / 100.0; }
}
