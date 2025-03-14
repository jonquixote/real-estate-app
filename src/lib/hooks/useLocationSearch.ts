import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface LocationSuggestion {
  id: string;
  text: string;
  type: 'city' | 'zipcode' | 'neighborhood' | 'address';
}

interface UseLocationSearchProps {
  initialValue?: string;
  debounceMs?: number;
}

export const useLocationSearch = ({
  initialValue = '',
  debounceMs = 300
}: UseLocationSearchProps = {}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  
  const debouncedValue = useDebounce(inputValue, debounceMs);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would call an API endpoint
        // For now, we'll simulate some suggestions
        const mockSuggestions: LocationSuggestion[] = [
          { id: '1', text: `${debouncedValue}, TX`, type: 'city' },
          { id: '2', text: `${debouncedValue} County, TX`, type: 'neighborhood' },
          { id: '3', text: `${debouncedValue} Heights, TX`, type: 'neighborhood' },
          { id: '4', text: `${debouncedValue} Park, TX`, type: 'neighborhood' },
          { id: '5', text: `${debouncedValue} 12345`, type: 'zipcode' },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSuggestions(mockSuggestions);
      } catch (err) {
        setError('Failed to fetch location suggestions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [debouncedValue]);
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSelectedLocation(null);
  };
  
  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    setInputValue(suggestion.text);
    setSelectedLocation(suggestion);
    setSuggestions([]);
  };
  
  const clearInput = () => {
    setInputValue('');
    setSelectedLocation(null);
    setSuggestions([]);
  };
  
  return {
    inputValue,
    suggestions,
    isLoading,
    error,
    selectedLocation,
    handleInputChange,
    handleSelectLocation,
    clearInput
  };
};
