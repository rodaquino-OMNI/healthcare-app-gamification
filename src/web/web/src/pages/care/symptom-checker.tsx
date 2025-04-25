import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // latest
// Import JourneyHeader component for consistent header styling
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
// Import useJourney hook to retrieve the current journey context
import { useJourney } from 'src/web/mobile/src/hooks/useJourney';
// Import Button component from the design system
import { Button } from 'src/web/design-system/src/components/Button';
// Import SymptomSelector component for selecting symptoms
import { SymptomSelector } from 'src/web/design-system/src/care/SymptomSelector';
// Import checkSymptoms function to call the backend API
import { checkSymptoms } from 'src/web/mobile/src/api/care';
// Import Stack component for layout
import { Stack } from 'src/web/design-system/src/primitives/Stack';
// Import Text component for displaying text
import { Text } from 'src/web/design-system/src/primitives/Text';
// Import LoadingIndicator component for displaying loading state
import { LoadingIndicator } from 'src/web/mobile/src/components/shared/LoadingIndicator';
// Import EmptyState component for displaying empty state
import { EmptyState } from 'src/web/mobile/src/components/shared/EmptyState';

// Define the SymptomCheckerPage component
const SymptomCheckerPage: React.FC = () => {
  // Retrieve the Care journey context using the useJourney hook.
  const { journey } = useJourney();
  // Initialize state variables for managing selected symptoms, loading state, and symptom check results.
  const [selectedSymptoms, setSelectedSymptoms] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const router = useRouter();

  // Define a function to handle symptom selection, updating the selectedSymptoms state.
  const handleSymptomsSelected = (symptoms: { id: string; name: string }[]) => {
    setSelectedSymptoms(symptoms);
  };

  // Define a function to handle the symptom check submission, calling the checkSymptoms API and updating the results state.
  const handleCheckSymptoms = async () => {
    setIsLoading(true);
    try {
      const symptomIds = selectedSymptoms.map((symptom) => symptom.id);
      const symptomCheckResults = await checkSymptoms({ symptoms: symptomIds });
      setResults(symptomCheckResults);
    } catch (error) {
      console.error('Error checking symptoms:', error);
      setResults({
        error: 'Failed to check symptoms. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock symptom data for demonstration purposes.
  const symptoms = [
    { id: '1', name: 'Fever' },
    { id: '2', name: 'Cough' },
    { id: '3', name: 'Headache' },
    { id: '4', name: 'Fatigue' },
    { id: '5', name: 'Sore Throat' },
    { id: '6', name: 'Runny Nose' },
    { id: '7', name: 'Muscle Aches' },
    { id: '8', name: 'Shortness of Breath' },
    { id: '9', name: 'Loss of Taste or Smell' },
    { id: '10', name: 'Nausea or Vomiting' },
  ];

  // Renders the UI with a JourneyHeader, SymptomSelector, and a button to check symptoms.
  return (
    <div>
      <JourneyHeader title="Symptom Checker" showBackButton={true} />
      <Stack>
        {/* SymptomSelector component for selecting symptoms */}
        <SymptomSelector
          symptoms={symptoms}
          journey={journey}
          onSymptomsSelected={handleSymptomsSelected}
        />

        {/* Button to trigger the symptom check */}
        <Button
          onPress={handleCheckSymptoms}
          disabled={selectedSymptoms.length === 0 || isLoading}
          journey={journey}
        >
          Check Symptoms
        </Button>

        {/* Displays a loading indicator while the symptom check is in progress. */}
        {isLoading && <LoadingIndicator label="Checking symptoms..." />}

        {/* Displays the symptom check results when available. */}
        {results && results.error && (
          <Text color="semantic.error">{results.error}</Text>
        )}
        {results && !results.error && results.guidance && (
          <Stack>
            <Text fontSize="xl" fontWeight="bold">
              Preliminary Guidance:
            </Text>
            <Text>{results.guidance}</Text>
          </Stack>
        )}
      </Stack>
    </div>
  );
};

// Set page configuration
SymptomCheckerPage.pageConfig = { unstable_runtimeJS: false };

// Export the SymptomCheckerPage component.
export default SymptomCheckerPage;