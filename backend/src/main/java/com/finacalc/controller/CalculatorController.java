package com.finacalc.controller;

import com.finacalc.dto.request.CompoundInterestRequest;
import com.finacalc.dto.request.LoanRequest;
import com.finacalc.dto.request.SalaryRequest;
import com.finacalc.dto.response.CompoundInterestResponse;
import com.finacalc.dto.response.LoanResponse;
import com.finacalc.dto.response.SalaryResponse;
import com.finacalc.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/calc")
@Validated
public class CalculatorController {

    private final CompoundInterestService compoundInterestService;
    private final LoanService             loanService;
    private final SalaryService           salaryService;
    private final SavingsService          savingsService;
    private final GoalPlannerService      goalPlannerService;
    private final RentVsBuyService        rentVsBuyService;
    private final RoiService              roiService;
    private final InsuranceService        insuranceService;
    private final BudgetService           budgetService;
    private final TaxInvestmentService    taxInvestmentService;
    private final FireRetirementService   fireRetirementService;
    private final BreakevenService        breakevenService;
    private final InflationService        inflationService;

    public CalculatorController(CompoundInterestService compoundInterestService,
                                LoanService loanService, SalaryService salaryService,
                                SavingsService savingsService, GoalPlannerService goalPlannerService,
                                RentVsBuyService rentVsBuyService, RoiService roiService,
                                InsuranceService insuranceService, BudgetService budgetService,
                                TaxInvestmentService taxInvestmentService,
                                FireRetirementService fireRetirementService,
                                BreakevenService breakevenService, InflationService inflationService) {
        this.compoundInterestService = compoundInterestService;
        this.loanService             = loanService;
        this.salaryService           = salaryService;
        this.savingsService          = savingsService;
        this.goalPlannerService      = goalPlannerService;
        this.rentVsBuyService        = rentVsBuyService;
        this.roiService              = roiService;
        this.insuranceService        = insuranceService;
        this.budgetService           = budgetService;
        this.taxInvestmentService    = taxInvestmentService;
        this.fireRetirementService   = fireRetirementService;
        this.breakevenService        = breakevenService;
        this.inflationService        = inflationService;
    }

    // ── Health check ──────────────────────────────────────────
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    // ── Existing ──────────────────────────────────────────────
    @PostMapping("/compound-interest")
    public ResponseEntity<CompoundInterestResponse> compoundInterest(@Valid @RequestBody CompoundInterestRequest req) {
        return ResponseEntity.ok(compoundInterestService.calculate(req));
    }

    @PostMapping("/home-loan")
    public ResponseEntity<LoanResponse> homeLoan(@Valid @RequestBody LoanRequest req) {
        return ResponseEntity.ok(loanService.calculate(req));
    }

    @PostMapping("/car-loan")
    public ResponseEntity<LoanResponse> carLoan(@Valid @RequestBody LoanRequest req) {
        return ResponseEntity.ok(loanService.calculate(req));
    }

    @PostMapping("/salary")
    public ResponseEntity<SalaryResponse> salary(@Valid @RequestBody SalaryRequest req) {
        return ResponseEntity.ok(salaryService.calculate(req));
    }

    // ── New ───────────────────────────────────────────────────

    @PostMapping("/savings")
    public ResponseEntity<?> savings(@RequestBody SavingsRequest req) {
        return ResponseEntity.ok(savingsService.calculate(req.principal(), req.annualRate(), req.termMonths(), req.interestType()));
    }

    @PostMapping("/goal-planner")
    public ResponseEntity<?> goalPlanner(@RequestBody GoalRequest req) {
        return ResponseEntity.ok(goalPlannerService.calculate(req.goalAmount(), req.currentSavings(), req.monthsLeft(), req.annualRate()));
    }

    @PostMapping("/rent-vs-buy")
    public ResponseEntity<?> rentVsBuy(@RequestBody RentVsBuyRequest req) {
        return ResponseEntity.ok(rentVsBuyService.calculate(req.housePrice(), req.downPayment(), req.annualRate(),
                req.termYears(), req.monthlyRent(), req.annualRentIncrease(), req.annualAppreciation()));
    }

    @PostMapping("/roi")
    public ResponseEntity<?> roi(@RequestBody RoiRequest req) {
        return ResponseEntity.ok(roiService.calculate(req.initialInvestment(), req.finalValue(), req.months()));
    }

    @PostMapping("/insurance")
    public ResponseEntity<?> insurance(@RequestBody InsuranceRequest req) {
        return ResponseEntity.ok(insuranceService.calculate(req.age(), req.gender(), req.coverageAmount(), req.termYears()));
    }

    @PostMapping("/budget")
    public ResponseEntity<?> budget(@RequestBody BudgetRequest req) {
        return ResponseEntity.ok(budgetService.calculate(req.monthlyIncome()));
    }

    @PostMapping("/tax-investment")
    public ResponseEntity<?> taxInvestment(@RequestBody TaxInvestmentRequest req) {
        return ResponseEntity.ok(taxInvestmentService.calculate(req.type(), req.principal(), req.profit(), req.rentalIncome()));
    }

    @PostMapping("/fire")
    public ResponseEntity<?> fire(@RequestBody FireRequest req) {
        return ResponseEntity.ok(fireRetirementService.calculate(req.currentAge(), req.currentSavings(),
                req.monthlyExpenses(), req.annualReturn(), req.monthlySavings()));
    }

    @PostMapping("/breakeven")
    public ResponseEntity<?> breakeven(@RequestBody BreakevenRequest req) {
        return ResponseEntity.ok(breakevenService.calculate(req.fixedCosts(), req.variableCostPerUnit(),
                req.pricePerUnit(), req.targetProfit()));
    }

    @PostMapping("/inflation")
    public ResponseEntity<?> inflation(@RequestBody InflationRequest req) {
        return ResponseEntity.ok(inflationService.calculate(req.initialAmount(), req.nominalRate(),
                req.inflationRate(), req.years()));
    }

    // ── Request records ───────────────────────────────────────
    record SavingsRequest(double principal, double annualRate, int termMonths, String interestType) {}
    record GoalRequest(double goalAmount, double currentSavings, int monthsLeft, double annualRate) {}
    record RentVsBuyRequest(double housePrice, double downPayment, double annualRate, int termYears,
                            double monthlyRent, double annualRentIncrease, double annualAppreciation) {}
    record RoiRequest(double initialInvestment, double finalValue, int months) {}
    record InsuranceRequest(int age, String gender, double coverageAmount, int termYears) {}
    record BudgetRequest(double monthlyIncome) {}
    record TaxInvestmentRequest(String type, double principal, double profit, double rentalIncome) {}
    record FireRequest(int currentAge, double currentSavings, double monthlyExpenses, double annualReturn, double monthlySavings) {}
    record BreakevenRequest(double fixedCosts, double variableCostPerUnit, double pricePerUnit, double targetProfit) {}
    record InflationRequest(double initialAmount, double nominalRate, double inflationRate, int years) {}
}
