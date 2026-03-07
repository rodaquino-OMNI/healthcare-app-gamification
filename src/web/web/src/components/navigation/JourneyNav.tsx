import React from 'react';
import { useRouter } from 'next/router';
import { ALL_JOURNEYS } from 'shared/constants/journeys';
import { MOBILE_CARE_ROUTES } from 'shared/constants/routes';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { Icon } from 'design-system/primitives/Icon/Icon';
import { useJourney } from '@/hooks/useJourney';
import { useJourneyContext } from '@/context/JourneyContext';

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
                        <Icon name={journeyItem.icon} size="24px" color={journeyItem.color} aria-hidden />
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
