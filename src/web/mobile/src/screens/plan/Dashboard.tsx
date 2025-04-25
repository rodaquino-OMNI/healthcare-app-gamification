# src/web/mobile/src/screens/plan/Dashboard.tsx
```tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Version 6.0
import { ClaimCard } from '@web/design-system/src/plan/ClaimCard';
import { CoverageInfoCard } from '@web/design-system/src/plan/CoverageInfoCard';
import { InsuranceCard } from '@web/design-system/src/plan/InsuranceCard';
import { EmptyState } from '@web/mobile/src/components/shared/EmptyState';
import { LoadingIndicator } from '@web/mobile/src/components/shared/LoadingIndicator';
import { useClaims } from '@web/mobile/src/hooks/useClaims';
import { useCoverage } from '@web/mobile/src/hooks/useCoverage';
import { useAuth } from '@web/mobile/src/hooks/useAuth';
import { JourneyHeader } from '@web/mobile/src/components/shared/JourneyHeader';

/**
 * Renders the main dashboard screen for the Plan journey, fetching and displaying key information related to the user's insurance plan and benefits.
 */
const PlanDashboard: React.FC = () => {
  // Access navigation object
  const navigation = useNavigation();

  // Access authentication context
  const { session, getUserFromToken } = useAuth();

  // Extract user ID from the token
  const decodedToken = session ? getUserFromToken(session.accessToken) : null;
  const userId = decodedToken?.id || decodedToken?.sub;

  // Hardcoded plan ID for now
  const planId = 'plan-123';

  // Fetch coverage and claims data using custom hooks
  const { coverage, isLoading: isCoverageLoading, error: coverageError } = useCoverage(planId);
  const { claims, isLoading: isClaimsLoading, error: claimsError } = useClaims(planId);

  // State for insurance card data (replace with actual data fetching later)
  const [insuranceCardData, setInsuranceCardData] = React.useState({
    plan: {
      id: 'plan-123',
      name: 'AUSTA Care Plan',
      type: 'HMO',
      planNumber: 'AXC12345',
      validityStart: '2023-01-01',
      validityEnd: '2023-12-31',
      coverageDetails: {},
    },
    user: {
      id: 'user-123',
      name: 'Maria Silva',
      cpf: '123.456.789-00',
    },
  });

  // Handle navigation to claim details screen
  const handleClaimPress = (claimId: string) => {
    navigation.navigate('ClaimDetails', { claimId });
  };

  // Handle navigation to coverage details screen
  const handleCoveragePress = (coverageId: string) => {
    navigation.navigate('CoverageDetails', { coverageId });
  };

  // Handle sharing the insurance card
  const handleShareCard = () => {
    // Implement sharing logic here
    console.log('Share card pressed');
  };

  // Handle submitting a new claim
  const handleNewClaim = () => {
    navigation.navigate('ClaimSubmission');
  };

  // Handle tracking a claim
  const handleTrackClaim = (claimId: string) => {
    navigation.navigate('ClaimTracking', { claimId });
  };

  // Handle viewing claim details
  const handleViewClaimDetails = (claimId: string) => {
    navigation.navigate('ClaimDetails', { claimId });
  };

  // Effect to log errors if they occur
  useEffect(() => {
    if (coverageError) {
      console.error('Error fetching coverage:', coverageError);
    }
    if (claimsError) {
      console.error('Error fetching claims:', claimsError);
    }
  }, [coverageError, claimsError]);

  return (
    <View style={styles.container}>
      <JourneyHeader title="Meu Plano & Benefícios" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Insurance Card */}
        <InsuranceCard
          plan={insuranceCardData.plan}
          user={insuranceCardData.user}
          onShare={handleShareCard}
        />

        {/* Coverage Information */}
        {isCoverageLoading ? (
          <LoadingIndicator label="Carregando Cobertura..." />
        ) : coverageError ? (
          <EmptyState
            icon="error"
            title="Erro ao carregar cobertura"
            description="Tente novamente mais tarde."
          />
        ) : coverage && coverage.length > 0 ? (
          coverage.map((item) => (
            <CoverageInfoCard
              key={item.id}
              coverage={item}
              onPress={() => handleCoveragePress(item.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="document"
            title="Nenhuma cobertura encontrada"
            description="Verifique os detalhes do seu plano."
          />
        )}

        {/* Claims */}
        {isClaimsLoading ? (
          <LoadingIndicator label="Carregando Solicitações..." />
        ) : claimsError ? (
          <EmptyState
            icon="error"
            title="Erro ao carregar solicitações"
            description="Tente novamente mais tarde."
          />
        ) : claims && claims.length > 0 ? (
          claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onPress={() => handleClaimPress(claim.id)}
              onViewDetails={() => handleViewClaimDetails(claim.id)}
              onTrackClaim={() => handleTrackClaim(claim.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="document"
            title="Nenhuma solicitação encontrada"
            description="Submeta suas solicitações por aqui."
            actionLabel="Nova Solicitação"
            onAction={handleNewClaim}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light blue background
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
});

export default PlanDashboard;