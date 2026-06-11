package com.finacalc.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    public record BudgetResult(
            double monthlyIncome,
            double needs, double wants, double savings,
            List<Map<String, Object>> needsBreakdown,
            List<Map<String, Object>> wantsBreakdown,
            List<Map<String, Object>> savingsBreakdown
    ) {}

    public BudgetResult calculate(double monthlyIncome) {
        double needs   = monthlyIncome * 0.50;
        double wants   = monthlyIncome * 0.30;
        double savings = monthlyIncome * 0.20;

        List<Map<String, Object>> needsBreakdown = List.of(
            item("Tiền thuê nhà / thế chấp",      needs * 0.40),
            item("Ăn uống hàng ngày",              needs * 0.25),
            item("Điện / nước / internet",         needs * 0.10),
            item("Đi lại (xăng, xe)",              needs * 0.15),
            item("Bảo hiểm y tế",                  needs * 0.10)
        );

        List<Map<String, Object>> wantsBreakdown = List.of(
            item("Ăn ngoài / cà phê",             wants * 0.30),
            item("Giải trí / du lịch",             wants * 0.25),
            item("Mua sắm quần áo",                wants * 0.20),
            item("Gym / sở thích cá nhân",         wants * 0.15),
            item("Streaming / apps",               wants * 0.10)
        );

        List<Map<String, Object>> savingsBreakdown = List.of(
            item("Quỹ khẩn cấp (3-6 tháng)",      savings * 0.40),
            item("Đầu tư / chứng khoán",           savings * 0.35),
            item("Quỹ hưu trí",                    savings * 0.15),
            item("Mục tiêu ngắn hạn",              savings * 0.10)
        );

        return new BudgetResult(monthlyIncome, needs, wants, savings,
                needsBreakdown, wantsBreakdown, savingsBreakdown);
    }

    private Map<String, Object> item(String label, double amount) {
        return Map.of("label", label, "amount", Math.round(amount));
    }
}
