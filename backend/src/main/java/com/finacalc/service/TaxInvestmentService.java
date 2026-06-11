package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TaxInvestmentService {

    public record TaxResult(
            double grossProfit,
            double taxAmount,
            double taxRate,
            double netProfit,
            String taxType,
            List<Map<String, Object>> breakdown
    ) {}

    /**
     * @param type  "stock" | "rental" | "bond"
     * @param principal   vốn đầu tư
     * @param profit      lợi nhuận trước thuế
     * @param rentalIncome thu nhập cho thuê/năm (chỉ dùng khi type=rental)
     */
    public TaxResult calculate(String type, double principal, double profit, double rentalIncome) {
        double taxAmount;
        double taxRate;
        String taxType;
        List<Map<String, Object>> breakdown = new ArrayList<>();

        switch (type) {
            case "stock" -> {
                // Thuế TNCN chứng khoán: 0.1% trên doanh thu bán (không phải lợi nhuận)
                // Tính xấp xỉ: doanh thu = principal + profit
                double revenue = principal + profit;
                taxRate = 0.1;
                taxAmount = revenue * taxRate / 100;
                taxType = "Chứng khoán — 0.1% trên doanh thu bán";
                breakdown.add(Map.of("label", "Doanh thu bán", "value", revenue));
                breakdown.add(Map.of("label", "Thuế TNCN (0.1%)", "value", taxAmount));
            }
            case "rental" -> {
                // Thuế cho thuê nhà: 5% VAT + 5% TNCN = 10% trên doanh thu
                // Miễn nếu < 100tr/năm
                if (rentalIncome < 100_000_000) {
                    taxRate = 0;
                    taxAmount = 0;
                    taxType = "Cho thuê nhà — Miễn thuế (< 100 triệu/năm)";
                } else {
                    taxRate = 10;
                    taxAmount = rentalIncome * 0.10;
                    taxType = "Cho thuê nhà — 10% (5% VAT + 5% TNCN)";
                }
                breakdown.add(Map.of("label", "Thu nhập cho thuê/năm", "value", rentalIncome));
                breakdown.add(Map.of("label", "Thuế phải nộp (10%)", "value", taxAmount));
            }
            default -> {
                // Trái phiếu doanh nghiệp / tiết kiệm: 5% trên lãi
                taxRate = 5;
                taxAmount = profit * 0.05;
                taxType = "Lãi trái phiếu / tiết kiệm — 5% trên lãi";
                breakdown.add(Map.of("label", "Lãi phát sinh", "value", profit));
                breakdown.add(Map.of("label", "Thuế TNCN (5%)", "value", taxAmount));
            }
        }

        double netProfit = profit - taxAmount;
        return new TaxResult(profit, taxAmount, taxRate, netProfit, taxType, breakdown);
    }
}
