package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BreakevenService {

    public record BreakevenResult(
            double fixedCosts,
            double variableCostPerUnit,
            double pricePerUnit,
            double contributionMargin,
            double contributionMarginRatio,
            double breakevenUnits,
            double breakevenRevenue,
            double targetUnits,
            double targetRevenue,
            List<Map<String, Object>> chart
    ) {}

    /**
     * @param fixedCosts         chi phí cố định/tháng
     * @param variableCostPerUnit chi phí biến đổi/đơn vị
     * @param pricePerUnit       giá bán/đơn vị
     * @param targetProfit       lợi nhuận mục tiêu (0 = chỉ tính hòa vốn)
     */
    public BreakevenResult calculate(double fixedCosts, double variableCostPerUnit,
                                     double pricePerUnit, double targetProfit) {
        double contributionMargin = pricePerUnit - variableCostPerUnit;
        double contributionMarginRatio = contributionMargin / pricePerUnit * 100;
        double breakevenUnits = fixedCosts / contributionMargin;
        double breakevenRevenue = breakevenUnits * pricePerUnit;
        double targetUnits = (fixedCosts + targetProfit) / contributionMargin;
        double targetRevenue = targetUnits * pricePerUnit;

        // Chart: doanh thu và chi phí theo số lượng
        List<Map<String, Object>> chart = new ArrayList<>();
        int steps = 10;
        double maxUnits = targetUnits * 1.5;
        for (int i = 0; i <= steps; i++) {
            double units = maxUnits * i / steps;
            double revenue = units * pricePerUnit;
            double totalCost = fixedCosts + units * variableCostPerUnit;
            double profit = revenue - totalCost;
            chart.add(Map.of(
                    "units", Math.round(units),
                    "revenue", Math.round(revenue),
                    "totalCost", Math.round(totalCost),
                    "profit", Math.round(profit)
            ));
        }

        return new BreakevenResult(fixedCosts, variableCostPerUnit, pricePerUnit,
                contributionMargin, contributionMarginRatio,
                breakevenUnits, breakevenRevenue, targetUnits, targetRevenue, chart);
    }
}
