import React from 'react'; // React v18.0+
import { View, Text } from 'react-native'; // React Native v0.71+
import { useParams } from 'react-router-native'; // react-router-native v6.0+
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native v6.0+

import { Claim } from 'src/web/shared/types/plan.types';
import { getClaim } from 'src/web/mobile/src/api/plan';
import { useClaims } from 'src/web/mobile/src/hooks/useClaims';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import { Card, CardProps } from 'src/web/design-system/src/components/Card/Card.tsx';
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx';
import { JourneyHeader, JourneyHeaderProps } from 'src/web/mobile/src/components/shared/JourneyHeader.tsx';
import { formatDate } from 'src/web/shared/utils/format';
import LoadingIndicator from 'src/web/mobile/src/components/shared/LoadingIndicator.tsx';
import ErrorState from 'src/web/mobile/src/components/shared/ErrorState.tsx';

/**
 * Renders the Claim Detail screen, displaying information about a specific claim.
 *
 * @returns The rendered ClaimDetail screen.
 */
export const ClaimDetail: React.FC = () => {
  // LD1: Retrieves the claim ID from the route parameters using `useParams`.
  const { claimId } = useParams();

  // LD1: Uses the `getClaim` API function to fetch the claim data based on the claim ID.
  const { claims, isLoading, error } = useClaims('somePlanId'); // TODO: Replace 'somePlanId' with actual planId
  const claim = claims?.find((c) => c.id === claimId);

  // LD1: Uses the `useNavigation` hook to get access to the navigation object.
  const navigation = useNavigation();

  // LD1: Displays a loading indicator while the claim data is being fetched.
  if (isLoading) {
    return <LoadingIndicator label="Carregando detalhes da solicitação..." />;
  }

  // LD1: Displays an error message if there is an error fetching the claim data.
  if (error) {
    return <ErrorState message="Erro ao carregar detalhes da solicitação." />;
  }

  // LD1: Checks if claim data exists before rendering
  if (!claim) {
    return <ErrorState message="Solicitação não encontrada." />;
  }

  // LD1: Formats the claim submission date using `formatDate`.
  const formattedDate = formatDate(claim.submittedAt, 'dd/MM/yyyy');

  // LD1: Renders the claim details, including the claim type, amount, status, and submission date.
  return (
    <View>
      {/* LD1: Renders the JourneyHeader component. */}
      <JourneyHeader title="Detalhes da Solicitação" showBackButton />

      {/* LD1: Renders the Card component to display claim details. */}
      <Card>
        <Text>Tipo: {claim.type}</Text>
        <Text>Valor: {claim.amount}</Text>
        <Text>Status: {claim.status}</Text>
        <Text>Data de Envio: {formattedDate}</Text>
      </Card>

      {/* LD1: Provides a button to navigate back to the claim history screen. */}
      <Button onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIMS)}>
        Voltar para o Histórico de Solicitações
      </Button>
    </View>
  );
};