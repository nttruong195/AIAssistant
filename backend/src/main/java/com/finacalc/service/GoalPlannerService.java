package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GoalPlannerService {

    public record GoalResult(
            double goalAmount, double currentSavings, int monthsLeft,
            double monthlyNeeded, double totalContributed, double totalInterest,
            List<Map<String, Object>> yearlyProjection
    ) {}

    public GoalResult calculate(double goalAmount, double currentSavings,
                                 int monthsLeft, double annualRate) {
        double monthlyRate = annualRate / 100.0 / 12.0;
        double monthlyNeeded;

        if (monthlyRate == 0) {
            monthlyNeeded = (goalAmount - currentSavings) / monthsLeft;
        } else {
            // FV = PV*(1+r)^n + PMT*((1+r)^n - 1)/r  => solve for PMT
            double growth = Math.pow(1 + monthlyRate, monthsLeft);
            monthlyNeeded = (goalAmount - currentSavings * growth) * monthlyRate / (growth - 1);
        }

        double totalContributed = currentSavings + monthlyNeeded * monthsLeft;
        double totalInterest    = goalAmount - totalContributed;

        List<Map<String, Object>> projection = new ArrayList<>();
        double balance = currentSavings;
        for (int m = 1; m <= monthsLeft; m++) {
            balance = balance * (1 + monthlyRate) + monthlyNeeded;
            if (m % 12 == 0 || m == monthsLeft) {
                projection.add(Map.of(
                    "month", m,
                    "year", m / 12,
                    "balance", Math.round(balance),
                    "contributed", Math.round(currentSavings + monthlyNeeded * m)
                ));
            }
        }

        return new GoalResult(goalAmount, currentSavings, monthsLeft,
                monthlyNeeded, totalContributed, Math.max(0, totalInterest), projection);
    }
}
