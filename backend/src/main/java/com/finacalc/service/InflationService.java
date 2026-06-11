package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InflationService {

    public record InflationResult(
            double nominalRate,
            double inflationRate,
            double realRate,
            double initialAmount,
            double futureNominal,
            double futurePurchasingPower,
            double purchasingPowerLoss,
            int years,
            List<Map<String, Object>> projection
    ) {}

    /**
     * Tính lãi suất thực theo công thức Fisher: (1 + nominal) / (1 + inflation) - 1
     */
    public InflationResult calculate(double initialAmount, double nominalRate,
                                     double inflationRate, int years) {
        // Fisher equation
        double realRate = ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;

        double futureNominal = initialAmount * Math.pow(1 + nominalRate / 100, years);
        double futurePurchasingPower = initialAmount * Math.pow(1 + realRate / 100, years);
        double purchasingPowerLoss = futureNominal - futurePurchasingPower;

        List<Map<String, Object>> projection = new ArrayList<>();
        for (int y = 0; y <= years; y++) {
            double nominal = initialAmount * Math.pow(1 + nominalRate / 100, y);
            double real = initialAmount * Math.pow(1 + realRate / 100, y);
            projection.add(Map.of(
                    "year", y,
                    "nominal", Math.round(nominal),
                    "real", Math.round(real)
            ));
        }

        return new InflationResult(nominalRate, inflationRate, realRate,
                initialAmount, futureNominal, futurePurchasingPower,
                purchasingPowerLoss, years, projection);
    }
}
