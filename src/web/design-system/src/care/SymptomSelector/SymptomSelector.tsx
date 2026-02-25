import React, { useState, useMemo } from 'react';
import { colors } from '../../tokens/colors';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Checkbox } from '../../components/Checkbox/Checkbox';

// Local type stub for Symptom (shared package not available at build time)
interface Symptom {
  id: string;
  name: string;
  description?: string;
}

/**
 * A component that allows users to select symptoms from a predefined list.
 * It uses checkboxes to enable multiple selections and provides a button to submit the selected symptoms.
 * 
 * @example
 * const symptoms = [
 *   { id: '1', name: 'Fever' },
 *   { id: '2', name: 'Cough' },
 *   { id: '3', name: 'Headache' }
 * ];
 * 
 * <SymptomSelector 
 *   symptoms={symptoms} 
 *   journey="care"
 *   onSymptomsSelected={(selected) => console.log('Selected symptoms:', selected)}
 * />
 */
export const SymptomSelector: React.FC<{
  /**
   * Array of symptoms the user can select from
   */
  symptoms: Array<{ id: string; name: string }>;
  
  /**
   * Journey identifier for theming (health, care, plan)
   */
  journey: 'health' | 'care' | 'plan';
  
  /**
   * Callback function triggered when symptoms are selected and submitted
   */
  onSymptomsSelected: (selectedSymptoms: Array<{ id: string; name: string }>) => void;
}> = ({
  symptoms,
  journey,
  onSymptomsSelected,
}) => {
  // State for tracking selected symptom IDs
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
  
  // State for search/filter term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter symptoms based on search term
  const filteredSymptoms = useMemo(() => {
    if (!searchTerm.trim()) {
      return symptoms;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return symptoms.filter(symptom => 
      symptom.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [symptoms, searchTerm]);
  
  // Handle checkbox change
  const handleSymptomToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symptomId = e.target.value;
    const isChecked = e.target.checked;
    
    setSelectedSymptomIds(prev => {
      if (isChecked) {
        return [...prev, symptomId];
      } else {
        return prev.filter(id => id !== symptomId);
      }
    });
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    const selectedSymptoms = symptoms.filter(symptom => 
      selectedSymptomIds.includes(symptom.id)
    );
    
    onSymptomsSelected(selectedSymptoms);
  };
  
  return (
    <Box padding="md">
      <Text 
        fontSize="xl" 
        fontWeight="bold"
        color={`journeys.${journey}.primary`}
      >
        Select Your Symptoms
      </Text>
      
      <Box marginTop="md" marginBottom="md">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search symptoms..."
          journey={journey}
          aria-label="Search symptoms"
          testID="symptom-search"
        />
      </Box>
      
      <Card 
        journey={journey} 
        elevation="md"
      >
        <Box 
          padding="md" 
          maxHeight="300px" 
          overflowY="auto"
          data-testid="symptom-list"
        >
          {filteredSymptoms.length === 0 ? (
            <Text>No symptoms found matching "{searchTerm}"</Text>
          ) : (
            filteredSymptoms.map(symptom => (
              <Box key={symptom.id} marginBottom="sm">
                <Checkbox
                  id={`symptom-${symptom.id}`}
                  name="symptoms"
                  value={symptom.id}
                  label={symptom.name}
                  checked={selectedSymptomIds.includes(symptom.id)}
                  onChange={handleSymptomToggle}
                  journey={journey}
                  testID={`symptom-checkbox-${symptom.id}`}
                />
              </Box>
            ))
          )}
        </Box>
      </Card>
      
      <Box 
        display="flex" 
        justifyContent="flex-end" 
        marginTop="md"
      >
        <Button
          onPress={handleSubmit}
          disabled={selectedSymptomIds.length === 0}
          journey={journey}
          accessibilityLabel="Submit selected symptoms"
          testID="submit-symptoms-button"
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SymptomSelector;