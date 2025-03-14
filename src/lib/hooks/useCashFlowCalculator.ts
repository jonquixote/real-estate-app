import { useState } from 'react';

export interface PropertyDetails {
  price: number;
  closingCosts: number;
  renovationCosts: number;
  afterRepairValue?: number;
}

export interface FinancingDetails {
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  loanPoints: number;
  pmiPercent?: number;
}

export interface IncomeDetails {
  monthlyRent: number;
  otherIncome: number;
  annualRentGrowth: number;
  vacancyRate: number;
}

export interface ExpenseDetails {
  propertyTaxRate: number;
  propertyTaxAnnualIncrease: number;
  insuranceAnnual: number;
  insuranceAnnualIncrease: number;
  maintenancePercent: number;
  capexPercent: number;
  managementPercent: number;
  utilitiesMonthly: number;
  hoaMonthly: number;
  otherExpensesMonthly: number;
  annualExpenseGrowth: number;
}

export interface CashFlowResult {
  // Purchase metrics
  purchasePrice: number;
  totalCashInvested: number;
  loanAmount: number;
  
  // Monthly breakdown
  monthlyRent: number;
  effectiveGrossIncome: number;
  monthlyExpenses: {
    mortgage: number;
    propertyTax: number;
    insurance: number;
    maintenance: number;
    capex: number;
    management: number;
    utilities: number;
    hoa: number;
    other: number;
    pmi?: number;
    total: number;
  };
  monthlyCashFlow: number;
  annualCashFlow: number;
  
  // Return metrics
  cashOnCashReturn: number;
  capRate: number;
  netOperatingIncome: number;
  grossRentMultiplier: number;
  
  // Long-term projections
  yearlyProjections: Array<{
    year: number;
    grossIncome: number;
    operatingExpenses: number;
    netOperatingIncome: number;
    mortgagePayment: number;
    cashFlow: number;
    propertyValue: number;
    loanBalance: number;
    equity: number;
    returnOnEquity: number;
  }>;
  
  // IRR calculations
  fiveYearIRR: number;
  tenYearIRR: number;
  fifteenYearIRR: number;
  
  // Total returns
  totalEquityBuildup: number;
  totalAppreciation: number;
  totalCashFlow: number;
  totalReturn: number;
  returnOnInvestment: number;
}

export const useCashFlowCalculator = () => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    price: 0,
    closingCosts: 0,
    renovationCosts: 0,
    afterRepairValue: 0
  });
  
  const [financingDetails, setFinancingDetails] = useState<FinancingDetails>({
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
    loanPoints: 0,
    pmiPercent: 0.5
  });
  
  const [incomeDetails, setIncomeDetails] = useState<IncomeDetails>({
    monthlyRent: 0,
    otherIncome: 0,
    annualRentGrowth: 2,
    vacancyRate: 5
  });
  
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails>({
    propertyTaxRate: 1.2,
    propertyTaxAnnualIncrease: 2,
    insuranceAnnual: 1200,
    insuranceAnnualIncrease: 3,
    maintenancePercent: 5,
    capexPercent: 5,
    managementPercent: 8,
    utilitiesMonthly: 0,
    hoaMonthly: 0,
    otherExpensesMonthly: 0,
    annualExpenseGrowth: 2
  });
  
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(3);
  
  const updatePropertyDetails = (details: Partial<PropertyDetails>) => {
    setPropertyDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  
  const updateFinancingDetails = (details: Partial<FinancingDetails>) => {
    setFinancingDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  
  const updateIncomeDetails = (details: Partial<IncomeDetails>) => {
    setIncomeDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  
  const updateExpenseDetails = (details: Partial<ExpenseDetails>) => {
    setExpenseDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  
  const calculateCashFlow = (): CashFlowResult => {
    // Purchase calculations
    const purchasePrice = propertyDetails.price;
    const downPayment = purchasePrice * (financingDetails.downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const closingCosts = propertyDetails.closingCosts;
    const renovationCosts = propertyDetails.renovationCosts;
    const totalCashInvested = downPayment + closingCosts + renovationCosts;
    
    // Loan calculations
    const monthlyInterestRate = financingDetails.interestRate / 100 / 12;
    const numberOfPayments = financingDetails.loanTerm * 12;
    const monthlyMortgage = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // PMI calculation
    const loanToValue = (loanAmount / purchasePrice) * 100;
    const hasPMI = loanToValue > 80;
    const monthlyPMI = hasPMI ? (loanAmount * (financingDetails.pmiPercent || 0) / 100) / 12 : 0;
    
    // Income calculations
    const monthlyRent = incomeDetails.monthlyRent;
    const otherIncome = incomeDetails.otherIncome;
    const grossMonthlyIncome = monthlyRent + otherIncome;
    const vacancyLoss = grossMonthlyIncome * (incomeDetails.vacancyRate / 100);
    const effectiveGrossIncome = grossMonthlyIncome - vacancyLoss;
    
    // Expense calculations
    const monthlyPropertyTax = (purchasePrice * (expenseDetails.propertyTaxRate / 100)) / 12;
    const monthlyInsurance = expenseDetails.insuranceAnnual / 12;
    const monthlyMaintenance = monthlyRent * (expenseDetails.maintenancePercent / 100);
    const monthlyCapEx = monthlyRent * (expenseDetails.capexPercent / 100);
    const monthlyManagement = monthlyRent * (expenseDetails.managementPercent / 100);
    const monthlyUtilities = expenseDetails.utilitiesMonthly;
    const monthlyHOA = expenseDetails.hoaMonthly;
    const monthlyOtherExpenses = expenseDetails.otherExpensesMonthly;
    
    const totalMonthlyExpenses = 
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyMaintenance +
      monthlyCapEx +
      monthlyManagement +
      monthlyUtilities +
      monthlyHOA +
      monthlyOtherExpenses +
      monthlyPMI;
    
    // Cash flow calculations
    const operatingExpenses = totalMonthlyExpenses;
    const monthlyCashFlow = effectiveGrossIncome - operatingExpenses - monthlyMortgage;
    const annualCashFlow = monthlyCashFlow * 12;
    
    // Return metrics
    const netOperatingIncome = (effectiveGrossIncome - operatingExpenses) * 12;
    const cashOnCashReturn = (annualCashFlow / totalCashInvested) * 100;
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    const grossRentMultiplier = purchasePrice / (monthlyRent * 12);
    
    // Yearly projections
    const yearlyProjections = [];
    let currentPropertyValue = purchasePrice;
    let currentLoanBalance = loanAmount;
    let currentMonthlyRent = monthlyRent;
    let currentOtherIncome = otherIncome;
    let currentPropertyTax = monthlyPropertyTax;
    let currentInsurance = monthlyInsurance;
    
    for (let year = 1; year <= 30; year++) {
      // Update values for this year
      if (year > 1) {
        currentPropertyValue *= (1 + annualAppreciation / 100);
        currentMonthlyRent *= (1 + incomeDetails.annualRentGrowth / 100);
        currentOtherIncome *= (1 + incomeDetails.annualRentGrowth / 100);
        currentPropertyTax *= (1 + expenseDetails.propertyTaxAnnualIncrease / 100);
        currentInsurance *= (1 + expenseDetails.insuranceAnnualIncrease / 100);
      }
      
      // Calculate loan balance for this year
      const yearlyInterestRate = financingDetails.interestRate / 100;
      const yearlyPayment = monthlyMortgage * 12;
      const yearlyInterest = currentLoanBalance * yearlyInterestRate;
      const yearlyPrincipal = yearlyPayment - yearlyInterest;
      currentLoanBalance -= yearlyPrincipal;
      
      // Calculate income for this year
      const yearlyGrossIncome = (currentMonthlyRent + currentOtherIncome) * 12;
      const yearlyVacancyLoss = yearlyGrossIncome * (incomeDetails.vacancyRate / 100);
      const yearlyEffectiveGrossIncome = yearlyGrossIncome - yearlyVacancyLoss;
      
      // Calculate expenses for this year
      const yearlyPropertyTax = currentPropertyTax * 12;
      const yearlyInsurance = currentInsurance * 12;
      const yearlyMaintenance = currentMonthlyRent * 12 * (expenseDetails.maintenancePercent / 100);
      const yearlyCapEx = currentMonthlyRent * 12 * (expenseDetails.capexPercent / 100);
      const yearlyManagement = currentMonthlyRent * 12 * (expenseDetails.managementPercent / 100);
      const yearlyUtilities = expenseDetails.utilitiesMonthly * 12;
      const yearlyHOA = expenseDetails.hoaMonthly * 12;
      const yearlyOtherExpenses = expenseDetails.otherExpensesMonthly * 12;
      
      const yearlyOperatingExpenses = 
        yearlyPropertyTax +
        yearlyInsurance +
        yearlyMaintenance +
        yearlyCapEx +
        yearlyManagement +
        yearlyUtilities +
        yearlyHOA +
        yearlyOtherExpenses;
      
      // Calculate NOI and cash flow
      const yearlyNOI = yearlyEffectiveGrossIncome - yearlyOperatingExpenses;
      const yearlyCashFlow = yearlyNOI - yearlyPayment;
      
      // Calculate equity and ROE
      const equity = currentPropertyValue - currentLoanBalance;
      const returnOnEquity = (yearlyCashFlow / equity) * 100;
      
      yearlyProjections.push({
        year,
        grossIncome: yearlyGrossIncome,
        operatingExpenses: yearlyOperatingExpenses,
        netOperatingIncome: yearlyNOI,
        mortgagePayment: yearlyPayment,
        cashFlow: yearlyCashFlow,
        propertyValue: currentPropertyValue,
        loanBalance: currentLoanBalance,
        equity,
        returnOnEquity
      });
    }
    
    // Calculate IRR
    const calculateIRR = (years: number): number => {
      const cashFlows = [-totalCashInvested];
      
      for (let i = 0; i < years; i++) {
        cashFlows.push(yearlyProjections[i].cashFlow);
      }
      
      // Add sale proceeds in final year
      if (years > 0) {
        const finalYear = yearlyProjections[years - 1];
        const saleProceedsAfterClosingCosts = finalYear.propertyValue * 0.94; // Assuming 6% selling costs
        const netSaleProceeds = saleProceedsAfterClosingCosts - finalYear.loanBalance;
        cashFlows[years] += netSaleProceeds;
      }
      
      // Simple IRR approximation (for a real implementation, use a proper IRR algorithm)
      // This is a placeholder - in a real app, use a numeric method to solve for IRR
      let irr = 0.1; // Start with 10% guess
      const maxIterations = 100;
      const tolerance = 0.0001;
      
      for (let iteration = 0; iteration < maxIterations; iteration++) {
        let npv = 0;
        for (let i = 0; i < cashFlows.length; i++) {
          npv += cashFlows[i] / Math.pow(1 + irr, i);
        }
        
        if (Math.abs(npv) < tolerance) {
          break;
        }
        
        // Adjust IRR based on NPV
        irr = irr * (1 + npv / Math.abs(cashFlows[0]) * 0.1);
      }
      
      return irr * 100; // Convert to percentage
    };
    
    const fiveYearIRR = calculateIRR(5);
    const tenYearIRR = calculateIRR(10);
    const fifteenYearIRR = calculateIRR(15);
    
    // Total returns
    const totalEquityBuildup = yearlyProjections[29].equity - totalCashInvested;
    const totalAppreciation = yearlyProjections[29].propertyValue - purchasePrice;
    const totalCashFlow = yearlyProjections.reduce((sum, year) => sum + year.cashFlow, 0);
    const totalReturn = totalEquityBuildup + totalCashFlow;
    const returnOnInvestment = (totalReturn / totalCashInvested) * 100;
    
    return {
      // Purchase metrics
      purchasePrice,
      totalCashInvested,
      loanAmount,
      
      // Monthly breakdown
      monthlyRent,
      effectiveGrossIncome,
      monthlyExpenses: {
        mortgage: monthlyMortgage,
        propertyTax: monthlyPropertyTax,
        insurance: monthlyInsurance,
        maintenance: monthlyMaintenance,
        capex: monthlyCapEx,
        management: monthlyManagement,
        utilities: monthlyUtilities,
        hoa: monthlyHOA,
        other: monthlyOtherExpenses,
        pmi: monthlyPMI,
        total: totalMonthlyExpenses + monthlyMortgage
      },
      monthlyCashFlow,
      annualCashFlow,
      
      // Return metrics
      cashOnCashReturn,
      capRate,
      netOperatingIncome,
      grossRentMultiplier,
      
      // Long-term projections
      yearlyProjections,
      
      // IRR calculations
      fiveYearIRR,
      tenYearIRR,
      fifteenYearIRR,
      
      // Total returns
      totalEquityBuildup,
      totalAppreciation,
      totalCashFlow,
      totalReturn,
      returnOnInvestment
    };
  };
  
  return {
    propertyDetails,
    financingDetails,
    incomeDetails,
    expenseDetails,
    annualAppreciation,
    updatePropertyDetails,
    updateFinancingDetails,
    updateIncomeDetails,
    updateExpenseDetails,
    setAnnualAppreciation,
    calculateCashFlow
  };
};
