package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RoiService {

    public record RoiResult(
            double initialInvestment, double finalValue,
            double profit, double roiPercent,
            double annualizedReturn, int months,
            List<Map<String, Object>> projection
    ) {}

    public RoiResult calculate(double initialInvestment, double finalValue, int months) {
        double profit          = finalValue - initialInvestment;
        double roiPercent      = (profit / initialInvestment) * 100;
        double years           = months / 12.0;
        double annualizedReturn = (Math.pow(finalValue / initialInvestment, 1.0 / years) - 1) * 100;

        // Chiếu theo đường tăng tuyến tính
        List<Map<String, Object>> projection = new ArrayList<>();
        for (int m = 0; m <= months; m += Math.max(1, months / 12)) {
            double value = initialInvestment + (profit / months) * m;
            projection.add(Map.of("month", m, "value", Math.round(value)));
        }

        return new RoiResult(initialInvestment, finalValue, profit,
                roiPercent, annualizedReturn, months, projection);
    }
}
