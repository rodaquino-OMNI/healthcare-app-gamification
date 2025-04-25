import React from 'react'; // react 18.0.0
import { useJourney } from '../hooks/useJourney';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';
import styled from 'styled-components'; // styled-components 6.0.0+

/**
 * Container component for the Health Journey layout with appropriate theming
 */
const HealthContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.journeys.health.background};
  color: ${({ theme }) => theme.colors.neutral.gray900};
`;

/**
 * Header component specifically styled for the Health Journey
 */
const HealthHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.journeys.health.primary};
  color: ${({ theme }) => theme.colors.neutral.white};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

/**
 * Content container for the Health Journey pages
 */
const HealthContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

/**
 * Footer component for the Health Journey
 */
const HealthFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-top: 1px solid ${({ theme }) => theme.colors.journeys.health.secondary};
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral.gray600};
`;

/**
 * HealthLayout component that provides a consistent layout for the Health Journey.
 * It applies the Health Journey theme and structure to all pages within this journey.
 * 
 * @param {React.PropsWithChildren} props - Component props with children
 * @returns {React.ReactElement} The Health Journey layout with the provided children
 */
const HealthLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { journey, setJourney } = useJourney();

  // Ensure we're in the Health journey context
  React.useEffect(() => {
    if (journey?.id !== JOURNEY_IDS.HEALTH) {
      setJourney(JOURNEY_IDS.HEALTH);
    }
  }, [journey, setJourney]);

  return (
    <HealthContainer>
      <HealthHeader>
        <h1>Minha Saúde</h1>
      </HealthHeader>
      <HealthContent>
        {children}
      </HealthContent>
      <HealthFooter>
        &copy; {new Date().getFullYear()} AUSTA SuperApp - Minha Saúde
      </HealthFooter>
    </HealthContainer>
  );
};

export default HealthLayout;