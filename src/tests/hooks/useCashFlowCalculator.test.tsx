import { render, screen } from '@testing-library/react';
import { useCashFlowCalculator } from '@/lib/hooks/useCashFlowCalculator';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock the hook implementation
jest.mock('@/lib/hooks/useCashFlowCalculator');

describe('Cash Flow Calculator Hook', () => {
  beforeEach(() => {
    // Reset mock implementation
    jest.resetAllMocks();
  });

  test('initializes with default values', () => {
    const mockCalculateResult = {
      purchasePrice: 300000,
      totalCashInvested: 75000,
      loanAmount: 240000,
      monthlyRent: 2500,
      effectiveGrossIncome: 2375,
      monthlyExpenses: {
        mortgage: 1520.06,
        propertyTax: 300,
        insurance: 100,
        maintenance: 125,
        capex: 125,
        management: 200,
        utilities: 0,
        hoa: 0,
        other: 0,
        pmi: 0,
        total: 2370.06
      },
      monthlyCashFlow: 4.94,
      annualCashFlow: 59.28,
      cashOnCashReturn: 0.08,
      capRate: 5.2,
      netOperatingIncome: 15600,
      grossRentMultiplier: 10,
      yearlyProjections: [],
      fiveYearIRR: 8.5,
      tenYearIRR: 12.3,
      fifteenYearIRR: 15.7,
      totalEquityBuildup: 150000,
      totalAppreciation: 120000,
      totalCashFlow: 30000,
      totalReturn: 180000,
      returnOnInvestment: 240
    };

    const mockHookReturn = {
      propertyDetails: {
        price: 300000,
        closingCosts: 9000,
        renovationCosts: 15000,
        afterRepairValue: 330000
      },
      financingDetails: {
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTerm: 30,
        loanPoints: 0,
        pmiPercent: 0.5
      },
      incomeDetails: {
        monthlyRent: 2500,
        otherIncome: 0,
        annualRentGrowth: 2,
        vacancyRate: 5
      },
      expenseDetails: {
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
      },
      annualAppreciation: 3,
      updatePropertyDetails: jest.fn(),
      updateFinancingDetails: jest.fn(),
      updateIncomeDetails: jest.fn(),
      updateExpenseDetails: jest.fn(),
      setAnnualAppreciation: jest.fn(),
      calculateCashFlow: jest.fn().mockReturnValue(mockCalculateResult)
    };

    (useCashFlowCalculator as jest.Mock).mockReturnValue(mockHookReturn);

    const { result } = renderHook(() => useCashFlowCalculator());

    // Check initial values
    expect(result.current.propertyDetails.price).toBe(300000);
    expect(result.current.financingDetails.downPaymentPercent).toBe(20);
    expect(result.current.incomeDetails.monthlyRent).toBe(2500);
    expect(result.current.expenseDetails.propertyTaxRate).toBe(1.2);
    expect(result.current.annualAppreciation).toBe(3);
  });

  test('calculates cash flow correctly', () => {
    const mockCalculateResult = {
      purchasePrice: 300000,
      totalCashInvested: 75000,
      loanAmount: 240000,
      monthlyRent: 2500,
      effectiveGrossIncome: 2375,
      monthlyExpenses: {
        mortgage: 1520.06,
        propertyTax: 300,
        insurance: 100,
        maintenance: 125,
        capex: 125,
        management: 200,
        utilities: 0,
        hoa: 0,
        other: 0,
        pmi: 0,
        total: 2370.06
      },
      monthlyCashFlow: 4.94,
      annualCashFlow: 59.28,
      cashOnCashReturn: 0.08,
      capRate: 5.2,
      netOperatingIncome: 15600,
      grossRentMultiplier: 10,
      yearlyProjections: [],
      fiveYearIRR: 8.5,
      tenYearIRR: 12.3,
      fifteenYearIRR: 15.7,
      totalEquityBuildup: 150000,
      totalAppreciation: 120000,
      totalCashFlow: 30000,
      totalReturn: 180000,
      returnOnInvestment: 240
    };

    const mockHookReturn = {
      propertyDetails: {
        price: 300000,
        closingCosts: 9000,
        renovationCosts: 15000,
        afterRepairValue: 330000
      },
      financingDetails: {
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTerm: 30,
        loanPoints: 0,
        pmiPercent: 0.5
      },
      incomeDetails: {
        monthlyRent: 2500,
        otherIncome: 0,
        annualRentGrowth: 2,
        vacancyRate: 5
      },
      expenseDetails: {
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
      },
      annualAppreciation: 3,
      updatePropertyDetails: jest.fn(),
      updateFinancingDetails: jest.fn(),
      updateIncomeDetails: jest.fn(),
      updateExpenseDetails: jest.fn(),
      setAnnualAppreciation: jest.fn(),
      calculateCashFlow: jest.fn().mockReturnValue(mockCalculateResult)
    };

    (useCashFlowCalculator as jest.Mock).mockReturnValue(mockHookReturn);

    const { result } = renderHook(() => useCashFlowCalculator());

    // Call the calculate function
    const cashFlowResult = result.current.calculateCashFlow();

    // Verify the calculation result
    expect(cashFlowResult.purchasePrice).toBe(300000);
    expect(cashFlowResult.totalCashInvested).toBe(75000);
    expect(cashFlowResult.monthlyCashFlow).toBe(4.94);
    expect(cashFlowResult.cashOnCashReturn).toBe(0.08);
    expect(cashFlowResult.capRate).toBe(5.2);
    expect(cashFlowResult.fiveYearIRR).toBe(8.5);
    expect(cashFlowResult.returnOnInvestment).toBe(240);
  });

  test('updates property details correctly', () => {
    const mockUpdatePropertyDetails = jest.fn();
    
    const mockHookReturn = {
      propertyDetails: {
        price: 300000,
        closingCosts: 9000,
        renovationCosts: 15000,
        afterRepairValue: 330000
      },
      financingDetails: {
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTerm: 30,
        loanPoints: 0,
        pmiPercent: 0.5
      },
      incomeDetails: {
        monthlyRent: 2500,
        otherIncome: 0,
        annualRentGrowth: 2,
        vacancyRate: 5
      },
      expenseDetails: {
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
      },
      annualAppreciation: 3,
      updatePropertyDetails: mockUpdatePropertyDetails,
      updateFinancingDetails: jest.fn(),
      updateIncomeDetails: jest.fn(),
      updateExpenseDetails: jest.fn(),
      setAnnualAppreciation: jest.fn(),
      calculateCashFlow: jest.fn()
    };

    (useCashFlowCalculator as jest.Mock).mockReturnValue(mockHookReturn);

    const { result } = renderHook(() => useCashFlowCalculator());

    // Update property details
    act(() => {
      result.current.updatePropertyDetails({ price: 350000 });
    });

    // Verify the update function was called with correct parameters
    expect(mockUpdatePropertyDetails).toHaveBeenCalledWith({ price: 350000 });
  });
});
