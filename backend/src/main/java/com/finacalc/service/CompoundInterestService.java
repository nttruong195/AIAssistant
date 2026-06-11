package com.finacalc.service;

import com.finacalc.dto.request.CompoundInterestRequest;
import com.finacalc.dto.response.CompoundInterestResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompoundInterestService {

    public CompoundInterestResponse calculate(CompoundInterestRequest req) {
        double p = req.principal();
        double ratePerPeriod = (req.annualRate() / 100.0) / req.compoundFrequency();
        double contribPerPeriod = (req.monthlyContribution() != null ? req.monthlyContribution() : 0)
                * 12.0 / req.compoundFrequency();

        double balance = p;
        double totalContributed = p;
        List<CompoundInterestResponse.YearlyBreakdown> breakdowns = new ArrayList<>();

        for (int year = 1; year <= req.years(); year++) {
            double interestThisYear = 0;
            for (int i = 0; i < req.compoundFrequency(); i++) {
                double interest = balance * ratePerPeriod;
                interestThisYear += interest;
                balance += interest + contribPerPeriod;
                totalContributed += contribPerPeriod;
            }
            breakdowns.add(new CompoundInterestResponse.YearlyBreakdown(
                    year, round(balance), round(interestThisYear), round(totalContributed)
            ));
        }

        double ear = Math.pow(1 + ratePerPeriod, req.compoundFrequency()) - 1;
        return new CompoundInterestResponse(
                round(balance), round(totalContributed),
                round(balance - totalContributed), round(ear * 100), breakdowns
        );
    }

    private double round(double v) { return Math.round(v * 100.0) / 100.0; }
}
