import React from 'react';
import { useRouter } from 'next/router';
import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys.ts';
import { MOBILE_CARE_ROUTES } from 'src/web/shared/constants/routes.ts';
import { Card } from 'src/web/design-system/src/components/Card/Card.tsx';
import { Text } from 'src/web/design-system/src/primitives/Text/Text.tsx';
import { Icon } from 'src/web/design-system/src/primitives/Icon/Icon.tsx';
import { useJourney } from 'src/web/web/src/hooks/useJourney.ts';
import { useJourneyContext } from 'src/web/web/src/context/JourneyContext.tsx';

/**
 * A navigation component that displays the available journeys in the AUSTA SuperApp.
 * It uses the design system's Card component and applies journey-specific styling.
 * This component allows users to easily switch between different sections of the application.
 */
export const JourneyNav: React.FC = () => {
  const { journey, setJourney } = useJourney();
  const router = useRouter();

  return (
    <div>
      {ALL_JOURNEYS.map((journeyItem) => (
        <Card
          key={journeyItem.id}
          journey={journeyItem.id as 'health' | 'care' | 'plan'}
          elevation={journey?.id === journeyItem.id ? 'md' : 'sm'}
          interactive
          padding="md"
          margin="sm"
          onPress={() => {
            setJourney(journeyItem.id);
            
            // Navigate to the appropriate route based on journey
            switch (journeyItem.id) {
              case 'health':
                router.push('/health/dashboard');
                break;
              case 'care':
                router.push('/care/appointments');
                break;
              case 'plan':
                router.push('/plan');
                break;
              default:
                router.push('/');
            }
          }}
          accessibilityLabel={`Navigate to ${journeyItem.name} journey`}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon 
              name={journeyItem.icon} 
              size="24px" 
              color={journeyItem.color}
              aria-hidden
            />
            <span style={{ marginLeft: '16px' }}>
              <Text 
                fontSize="lg"
                fontWeight="medium"
                color={journey?.id === journeyItem.id ? journeyItem.color : undefined}
              >
                {journeyItem.name}
              </Text>
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};