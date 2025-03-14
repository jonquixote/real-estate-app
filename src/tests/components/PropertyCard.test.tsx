import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyCard from '@/app/components/property/PropertyCard';

describe('PropertyCard Component', () => {
  const mockProperty = {
    zpid: '123456',
    address: '123 Main St, Austin, TX 78701',
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    images: ['https://example.com/image1.jpg'],
    rentToValueRatio: 0.8,
    sqftToValueRatio: 0.6,
    meetsRentOnePercentRule: false,
    meetsSqftOnePercentRule: false
  };

  test('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.bedrooms} bd`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.bathrooms} ba`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.squareFootage.toLocaleString()} sqft`)).toBeInTheDocument();
    expect(screen.getByText(`Rent: ${mockProperty.rentToValueRatio.toFixed(2)}%`)).toBeInTheDocument();
    expect(screen.getByText(`Sqft: ${mockProperty.sqftToValueRatio.toFixed(2)}%`)).toBeInTheDocument();
  });

  test('applies correct color coding based on investment criteria', () => {
    // Test with property meeting both rules
    const bothRulesProperty = {
      ...mockProperty,
      meetsRentOnePercentRule: true,
      meetsSqftOnePercentRule: true,
      rentToValueRatio: 1.2,
      sqftToValueRatio: 1.1
    };
    
    const { container, unmount } = render(<PropertyCard property={bothRulesProperty} />);
    expect(container.querySelector('.bg-green-100')).toBeInTheDocument();
    unmount();
    
    // Test with property meeting one rule
    const oneRuleProperty = {
      ...mockProperty,
      meetsRentOnePercentRule: true,
      meetsSqftOnePercentRule: false,
      rentToValueRatio: 1.1,
      sqftToValueRatio: 0.8
    };
    
    const { container: container2, unmount: unmount2 } = render(<PropertyCard property={oneRuleProperty} />);
    expect(container2.querySelector('.bg-yellow-100')).toBeInTheDocument();
    unmount2();
    
    // Test with property meeting no rules but approaching threshold
    const approachingProperty = {
      ...mockProperty,
      meetsRentOnePercentRule: false,
      meetsSqftOnePercentRule: false,
      rentToValueRatio: 0.7,
      sqftToValueRatio: 0.6
    };
    
    const { container: container3 } = render(<PropertyCard property={approachingProperty} />);
    expect(container3.querySelector('.bg-yellow-50')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<PropertyCard property={mockProperty} onClick={handleClick} />);
    
    await userEvent.click(screen.getByText(mockProperty.address));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
