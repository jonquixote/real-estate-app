import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilters from '@/app/components/search/SearchFilters';

describe('SearchFilters Component', () => {
  const mockFilters = {
    propertyType: ['SINGLE_FAMILY'],
    bedrooms: { min: 2, max: 4 },
    bathrooms: { min: 1, max: 3 },
    price: { min: 100000, max: 500000 },
    squareFootage: { min: 1000, max: 3000 }
  };

  const mockInvestmentCriteria = {
    rentOnePercentRule: true,
    sqftOnePercentRule: false,
    combinedRules: false,
    thresholdApproaching: false,
    thresholdQuantity: 25
  };

  const mockUpdateFilters = jest.fn();
  const mockUpdateInvestmentCriteria = jest.fn();
  const mockResetFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders investment criteria checkboxes correctly', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        investmentCriteria={mockInvestmentCriteria}
        onUpdateFilters={mockUpdateFilters}
        onUpdateInvestmentCriteria={mockUpdateInvestmentCriteria}
        onResetFilters={mockResetFilters}
      />
    );
    
    expect(screen.getByText('Rent 1% Rule')).toBeInTheDocument();
    expect(screen.getByText('Sqft 1% Rule')).toBeInTheDocument();
    expect(screen.getByText('Either Rule (Combined)')).toBeInTheDocument();
    
    // Check that checkboxes have correct initial state
    const rentRuleCheckbox = screen.getByLabelText('Rent 1% Rule');
    const sqftRuleCheckbox = screen.getByLabelText('Sqft 1% Rule');
    const combinedRuleCheckbox = screen.getByLabelText('Either Rule (Combined)');
    
    expect(rentRuleCheckbox).toBeChecked();
    expect(sqftRuleCheckbox).not.toBeChecked();
    expect(combinedRuleCheckbox).not.toBeChecked();
  });

  test('expands and collapses filter options', async () => {
    render(
      <SearchFilters
        filters={mockFilters}
        investmentCriteria={mockInvestmentCriteria}
        onUpdateFilters={mockUpdateFilters}
        onUpdateInvestmentCriteria={mockUpdateInvestmentCriteria}
        onResetFilters={mockResetFilters}
      />
    );
    
    // Initially, property type filters should not be visible
    expect(screen.queryByText('Property Type')).not.toBeInTheDocument();
    
    // Click expand button
    await userEvent.click(screen.getByText('Expand'));
    
    // Now property type filters should be visible
    expect(screen.getByText('Property Type')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    
    // Click collapse button
    await userEvent.click(screen.getByText('Collapse'));
    
    // Property type filters should be hidden again
    expect(screen.queryByText('Property Type')).not.toBeInTheDocument();
  });

  test('calls update functions when filters are changed', async () => {
    render(
      <SearchFilters
        filters={mockFilters}
        investmentCriteria={mockInvestmentCriteria}
        onUpdateFilters={mockUpdateFilters}
        onUpdateInvestmentCriteria={mockUpdateInvestmentCriteria}
        onResetFilters={mockResetFilters}
      />
    );
    
    // Change investment criteria
    await userEvent.click(screen.getByLabelText('Sqft 1% Rule'));
    expect(mockUpdateInvestmentCriteria).toHaveBeenCalledWith({ sqftOnePercentRule: true });
    
    // Expand filters
    await userEvent.click(screen.getByText('Expand'));
    
    // Change price range
    const minPriceInput = screen.getByPlaceholderText('Min Price');
    await userEvent.clear(minPriceInput);
    await userEvent.type(minPriceInput, '200000');
    expect(mockUpdateFilters).toHaveBeenCalledWith({ price: { ...mockFilters.price, min: 200000 } });
    
    // Reset filters
    await userEvent.click(screen.getByText('Reset'));
    expect(mockResetFilters).toHaveBeenCalled();
  });
});
