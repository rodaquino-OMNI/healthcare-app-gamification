import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys.ts';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx';
import { Icon } from 'src/web/design-system/src/primitives/Icon/Icon.tsx';
import { useJourney } from 'src/web/web/src/hooks/useJourney.ts';
import { colors } from 'src/web/design-system/src/tokens/colors.ts';

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
  const { journey, setJourney } = useJourney();
  
  // Handle journey navigation when a nav item is pressed
  const handleNavigateToJourney = (journeyId: string) => {
    setJourney(journeyId);
    
    // Navigate to the appropriate journey dashboard
    switch (journeyId) {
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
  };
  
  // Check if we're on an authentication page where the nav bar shouldn't be shown
  const isAuthRoute = Object.values(MOBILE_AUTH_ROUTES).some(
    route => router.pathname.includes(route)
  );
  
  // Don't show navigation on auth pages
  if (isAuthRoute) {
    return null;
  }

  return (
    <MobileNavContainer>
      {ALL_JOURNEYS.map((journeyItem) => {
        const isActive = journey?.id === journeyItem.id;
        const journeyId = journeyItem.id as 'health' | 'care' | 'plan';
        
        return (
          <NavItem key={journeyItem.id}>
            <Button
              variant="tertiary"
              size="md"
              journey={journeyId}
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