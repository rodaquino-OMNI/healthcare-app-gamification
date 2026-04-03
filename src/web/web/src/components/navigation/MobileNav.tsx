import { Button } from 'design-system/components/Button/Button';
import React from 'react';
import { ALL_JOURNEYS } from 'shared/constants/journeys';
import { MOBILE_AUTH_ROUTES } from 'shared/constants/routes';
import styled from 'styled-components';

type JourneyId = 'health' | 'care' | 'plan';
const CORE_JOURNEYS = ALL_JOURNEYS.filter(
    (j): j is (typeof ALL_JOURNEYS)[number] & { id: JourneyId } =>
        j.id === 'health' || j.id === 'care' || j.id === 'plan'
);

import { useJourney } from '@/hooks/useJourney';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

// Styled container for the mobile navigation bar
const MobileNavContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: white;
    border-top: 1px solid #eee;
    z-index: 100;
`;

// Styled component for each navigation item
const NavItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

/**
 * MobileNav component provides a mobile-friendly navigation bar that adapts to the current journey,
 * displaying the appropriate color and icons. It implements the Journey Navigation System (F-105)
 * and Journey Color Coding (F-106) features.
 */
const MobileNav: React.FC = () => {
    const router = useRouter();
    const { setJourney } = useJourney();

    // Handle journey navigation when a nav item is pressed
    const handleNavigateToJourney = (journeyId: string): void => {
        setJourney(journeyId);

        // Navigate to the appropriate journey dashboard
        switch (journeyId) {
            case 'health':
                void router.push('/health/dashboard');
                break;
            case 'care':
                void router.push('/care/appointments');
                break;
            case 'plan':
                void router.push('/plan');
                break;
            default:
                void router.push('/');
        }
    };

    // Check if we're on an authentication page where the nav bar shouldn't be shown
    const isAuthRoute = Object.values(MOBILE_AUTH_ROUTES).some((route) => router.pathname.includes(route));

    // Don't show navigation on auth pages
    if (isAuthRoute) {
        return null;
    }

    return (
        <MobileNavContainer>
            {CORE_JOURNEYS.map((journeyItem) => {
                return (
                    <NavItem key={journeyItem.id}>
                        <Button
                            variant="tertiary"
                            size="md"
                            journey={journeyItem.id}
                            icon={journeyItem.icon}
                            onPress={() => handleNavigateToJourney(journeyItem.id)}
                            accessibilityLabel={`Navigate to ${journeyItem.name} journey`}
                        >
                            {journeyItem.name}
                        </Button>
                    </NavItem>
                );
            })}
        </MobileNavContainer>
    );
};

export default MobileNav;
