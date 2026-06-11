package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FireRetirementService {

    public record FireResult(
            double fireNumber,
            double currentSavings,
            double monthlySavingsNeeded,
            double monthlyExpenses,
            int yearsToFire,
            int retireAge,
            double safeWithdrawalRate,
            List<Map<String, Object>> projection
    ) {}

    /**
     * @param currentAge        tuổi hiện tại
     * @param currentSavings    tiết kiệm hiện có
     * @param monthlyExpenses   chi tiêu hàng tháng khi nghỉ hưu (VNĐ)
     * @param annualReturn      lợi nhuận đầu tư hàng năm (%)
     * @param monthlySavings    số tiền tiết kiệm/đầu tư mỗi tháng hiện tại
     */
    public FireResult calculate(int currentAge, double currentSavings,
                                double monthlyExpenses, double annualReturn,
                                double monthlySavings) {
        // FIRE number = chi tiêu hàng năm / 4% (quy tắc 4%)
        double safeWithdrawalRate = 4.0;
        double annualExpenses = monthlyExpenses * 12;
        double fireNumber = annualExpenses / (safeWithdrawalRate / 100);

        double monthlyRate = annualReturn / 100 / 12;
        double balance = currentSavings;
        int months = 0;

        List<Map<String, Object>> projection = new ArrayList<>();
        projection.add(Map.of("year", currentAge, "balance", Math.round(balance), "fire", Math.round(fireNumber)));

        while (balance < fireNumber && months < 600) { // max 50 năm
            balance = balance * (1 + monthlyRate) + monthlySavings;
            months++;
            if (months % 12 == 0) {
                int age = currentAge + months / 12;
                projection.add(Map.of("year", age, "balance", Math.round(balance), "fire", Math.round(fireNumber)));
            }
        }

        int yearsToFire = months / 12;
        int retireAge = currentAge + yearsToFire;

        // Nếu chưa đạt trong 50 năm → tính toán số tiền cần tiết kiệm thêm
        double monthlySavingsNeeded = monthlySavings;
        if (balance < fireNumber) {
            // FV formula: PV*(1+r)^n + PMT*((1+r)^n - 1)/r = FV
            // Tính PMT cần thiết
            double n = 360; // 30 năm
            double factor = (Math.pow(1 + monthlyRate, n) - 1) / monthlyRate;
            double fvCurrent = currentSavings * Math.pow(1 + monthlyRate, n);
            monthlySavingsNeeded = Math.max(0, (fireNumber - fvCurrent) / factor);
        }

        return new FireResult(fireNumber, currentSavings, monthlySavingsNeeded,
                monthlyExpenses, yearsToFire, retireAge, safeWithdrawalRate, projection);
    }
}
