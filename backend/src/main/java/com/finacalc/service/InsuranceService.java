package com.finacalc.service;

import org.springframework.stereotype.Service;

@Service
public class InsuranceService {

    public record InsuranceResult(
            int age, String gender, double coverageAmount, int termYears,
            double monthlyPremium, double annualPremium,
            double totalPremium, double coverageRatio
    ) {}

    public InsuranceResult calculate(int age, String gender, double coverageAmount, int termYears) {
        // Tỷ lệ phí cơ bản theo tuổi (‰ của mệnh giá / năm)
        double baseRate = getBaseRate(age);

        // Hệ số giới tính (nữ sống lâu hơn → phí thấp hơn ~5%)
        double genderFactor = "FEMALE".equalsIgnoreCase(gender) ? 0.95 : 1.0;

        // Hệ số thời hạn (dài hơn → tổng phí cao hơn nhưng hàng năm thấp hơn)
        double termFactor = 1.0 + (termYears - 10) * 0.01;

        double annualPremium  = coverageAmount * baseRate / 1000.0 * genderFactor * termFactor;
        double monthlyPremium = annualPremium / 12.0;
        double totalPremium   = annualPremium * termYears;
        double coverageRatio  = coverageAmount / totalPremium;

        return new InsuranceResult(age, gender, coverageAmount, termYears,
                monthlyPremium, annualPremium, totalPremium, coverageRatio);
    }

    private double getBaseRate(int age) {
        if (age < 25) return 3.5;
        if (age < 30) return 4.2;
        if (age < 35) return 5.0;
        if (age < 40) return 6.5;
        if (age < 45) return 8.5;
        if (age < 50) return 11.0;
        if (age < 55) return 14.5;
        return 18.0;
    }
}
