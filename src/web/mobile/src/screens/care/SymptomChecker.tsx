import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // v6.1.7
import { 
  Input, 
  Button, 
  Card, 
  LoadingIndicator, 
  ErrorState, 
  JourneyHeader, 
  EmptyState,
  Text
} from '@austa/design-system'; // v1.0.0
import { MOBILE_CARE_ROUTES } from 'src/web/shared/constants/routes';
import { checkSymptoms } from 'src/web/mobile/src/api/care';
import { useJourney } from 'src/web/mobile/src/hooks/useJourney';

/**
 * A screen component that allows users to input their symptoms and receive a preliminary assessment.
 * This implements requirement F-102-RQ-001: Allow users to input symptoms and receive preliminary guidance.
 */
const SymptomChecker: React.FC = () => {
  // State for symptom input, results, loading and error states
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Get navigation and journey context
  const navigation = useNavigation();
  const { journey } = useJourney();
  
  /**
   * Handles the submission of symptoms for checking
   */
  const handleCheckSymptoms = async () => {
    // Validate input
    if (!symptoms.trim()) {
      setError(new Error('Por favor, descreva seus sintomas'));
      return;
    }
    
    try {
      // Start loading and clear previous errors
      setIsLoading(true);
      setError(null);
      
      // Call the API to check symptoms
      const response = await checkSymptoms({ description: symptoms });
      
      // Update results
      setResults(response);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err : new Error('Erro ao verificar sintomas'));
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };
  
  /**
   * Navigates to the appointment booking screen
   */
  const handleBookAppointment = () => {
    navigation.navigate(MOBILE_CARE_ROUTES.BOOK_APPOINTMENT);
  };
  
  return (
    <>
      {/* Header */}
      <JourneyHeader 
        title="Verificador de Sintomas" 
        journey="care" 
        showBackButton 
      />
      
      {/* Symptom input card */}
      <Card>
        <Text variant="h6">Descreva seus sintomas em detalhes para obter uma avaliação preliminar</Text>
        
        <Input
          label="Sintomas"
          value={symptoms}
          onChangeText={setSymptoms}
          placeholder="Ex: Dor de cabeça, febre, tosse..."
          multiline
          numberOfLines={4}
          testID="symptom-input"
          accessibilityLabel="Campo para descrever seus sintomas"
        />
        
        <Button
          title="Verificar Sintomas"
          onPress={handleCheckSymptoms}
          journey="care"
          disabled={isLoading || !symptoms.trim()}
          loading={isLoading}
          testID="check-symptoms-button"
        />
      </Card>
      
      {/* Loading state */}
      {isLoading && (
        <LoadingIndicator size="large" journey="care" />
      )}
      
      {/* Error state */}
      {error && (
        <ErrorState
          message={error.message}
          journey="care"
          onRetry={handleCheckSymptoms}
        />
      )}
      
      {/* Results display */}
      {results && !isLoading && (
        <Card testID="results-card">
          <Text variant="h5">Resultado da Avaliação</Text>
          
          {results.possibleCauses && (
            <>
              <Text variant="subtitle1">Possíveis Causas</Text>
              {results.possibleCauses.map((cause: string, index: number) => (
                <Text key={index}>• {cause}</Text>
              ))}
            </>
          )}
          
          {results.recommendation && (
            <>
              <Text variant="subtitle1">Recomendação</Text>
              <Text>{results.recommendation}</Text>
            </>
          )}
          
          {results.severityLevel && (
            <>
              <Text variant="subtitle1">Nível de Urgência</Text>
              <Text>
                {results.severityLevel === 'high' && '🔴 Alto - Busque atendimento médico imediatamente'}
                {results.severityLevel === 'medium' && '🟠 Médio - Consulte um médico em breve'}
                {results.severityLevel === 'low' && '🟢 Baixo - Monitore seus sintomas'}
              </Text>
            </>
          )}
          
          {/* Show appointment button for medium/high severity */}
          {results.severityLevel && ['medium', 'high'].includes(results.severityLevel) && (
            <Button
              title="Agendar Consulta"
              onPress={handleBookAppointment}
              journey="care"
              testID="book-appointment-button"
            />
          )}
        </Card>
      )}
      
      {/* Empty state when no input or results yet */}
      {!results && !isLoading && !error && (
        <EmptyState
          icon="medical-bag"
          title="Verificador de Sintomas"
          description="Descreva seus sintomas para receber uma avaliação preliminar e orientações."
          journey="care"
        />
      )}
    </>
  );
};

export default SymptomChecker;