import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { CoverageInfoCard } from 'src/web/design-system/src/plan/CoverageInfoCard/CoverageInfoCard';
import { useCoverage } from 'src/web/mobile/src/hooks/useCoverage';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';
import { JourneyContext } from 'src/web/mobile/src/context/JourneyContext';

// Styled components for the Coverage screen
const Container = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.journeys.plan.background};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.journeys.plan.primary};
  margin-bottom: 8px;
  font-family: ${props => props.theme.typography.fontFamily.heading};
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.neutral.gray800};
  margin-bottom: 24px;
  font-family: ${props => props.theme.typography.fontFamily.base};
  line-height: ${props => props.theme.typography.lineHeight.base};
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.journeys.plan.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  font-size: 16px;
  color: ${props => props.theme.colors.neutral.gray700};
  font-family: ${props => props.theme.typography.fontFamily.base};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 24px;
`;

const ErrorText = styled.p`
  font-size: 18px;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.semantic.error};
  text-align: center;
  margin-bottom: 8px;
  font-family: ${props => props.theme.typography.fontFamily.base};
`;

const ErrorSubText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.neutral.gray700};
  text-align: center;
  font-family: ${props => props.theme.typography.fontFamily.base};
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 24px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.neutral.gray700};
  text-align: center;
  font-family: ${props => props.theme.typography.fontFamily.base};
`;

/**
 * Coverage component displays insurance coverage information for a user's plan
 * within the 'My Plan & Benefits' journey.
 * 
 * Addresses requirement F-103-RQ-001: Display detailed insurance coverage information.
 */
const Coverage: React.FC = () => {
  // Get the journey context
  const { setJourney } = useContext(JourneyContext);
  
  // Set the current journey to Plan when component mounts
  useEffect(() => {
    setJourney(JOURNEY_IDS.PLAN);
  }, [setJourney]);
  
  // Get planId from the URL params
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get('planId') || '';
  
  // Fetch coverage data using the useCoverage hook
  const { coverage, isLoading, error } = useCoverage(planId);
  
  // Handle loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Carregando informações de cobertura...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>
          Não foi possível carregar as informações de cobertura.
        </ErrorText>
        <ErrorSubText>
          Por favor, tente novamente mais tarde.
        </ErrorSubText>
      </ErrorContainer>
    );
  }
  
  // Handle empty data state
  if (!coverage || coverage.length === 0) {
    return (
      <EmptyContainer>
        <EmptyText>
          Nenhuma informação de cobertura disponível para este plano.
        </EmptyText>
      </EmptyContainer>
    );
  }
  
  // Render coverage information
  return (
    <Container>
      <Title>Informações de Cobertura</Title>
      <Subtitle>
        Detalhes da sua cobertura atual incluindo limitações e valores de copagamento.
      </Subtitle>
      
      <CardsContainer>
        {coverage.map((item) => (
          <CoverageInfoCard key={item.id} coverage={item} />
        ))}
      </CardsContainer>
    </Container>
  );
};

export default Coverage;