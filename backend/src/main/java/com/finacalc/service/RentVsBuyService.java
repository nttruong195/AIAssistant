package com.finacalc.service;

import org.springframework.stereotype.Service;

@Service
public class RentVsBuyService {

    public record RentVsBuyResult(
            double housePrice, double monthlyRent, double monthlyMortgage,
            double totalBuyCost, double totalRentCost,
            double buyEquity, double breakEvenYears,
            String recommendation
    ) {}

    public RentVsBuyResult calculate(double housePrice, double downPayment,
                                      double annualRate, int termYears,
                                      double monthlyRent, double annualRentIncrease,
                                      double annualAppreciation) {
        double loanAmount    = housePrice - downPayment;
        double monthlyRate   = annualRate / 100.0 / 12.0;
        int    termMonths    = termYears * 12;

        // Tính trả góp hàng tháng
        double monthlyMortgage = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)
                / (Math.pow(1 + monthlyRate, termMonths) - 1);

        // Chi phí mua sau N năm (góp + thuế + bảo trì ~1%/năm)
        double maintenance   = housePrice * 0.01 * termYears;
        double totalBuyCost  = downPayment + monthlyMortgage * termMonths + maintenance;

        // Giá trị nhà sau N năm
        double futureHouseValue = housePrice * Math.pow(1 + annualAppreciation / 100.0, termYears);
        double buyEquity        = futureHouseValue - (loanAmount * 0.2); // ước tính còn nợ ~20%

        // Tổng tiền thuê sau N năm (tăng đều hàng năm)
        double totalRentCost = 0;
        double rent = monthlyRent;
        for (int y = 0; y < termYears; y++) {
            totalRentCost += rent * 12;
            rent *= (1 + annualRentIncrease / 100.0);
        }

        // Break-even: khi nào mua rẻ hơn thuê
        double breakEvenYears = totalBuyCost > totalRentCost ? -1 :
                (downPayment / (monthlyRent * 12 - monthlyMortgage * 12));

        String recommendation = buyEquity > totalRentCost * 0.3
                ? "Nên MUA — tích lũy tài sản tốt hơn"
                : "Nên THUÊ — linh hoạt hơn trong giai đoạn này";

        return new RentVsBuyResult(housePrice, monthlyRent, monthlyMortgage,
                totalBuyCost, totalRentCost, buyEquity, breakEvenYears, recommendation);
    }
}
