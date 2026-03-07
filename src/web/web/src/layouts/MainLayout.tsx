import React from 'react';
import styled from 'styled-components'; // styled-components@^6.0.0
import { useRouter } from 'next/router'; // next/router@^13.0.0
import { Box } from 'src/web/design-system/src/primitives/Box';
import { Stack } from 'src/web/design-system/src/primitives/Stack';
import { Sidebar } from 'src/web/web/src/components/navigation/Sidebar';
import { TopBar } from 'src/web/web/src/components/navigation/TopBar';
import { GamificationPopup } from 'src/web/web/src/components/shared/GamificationPopup';
import { useJourney } from 'src/web/web/src/context/JourneyContext';
import { useGamification } from 'src/web/web/src/context/GamificationContext';
import { useAuth } from 'src/web/web/src/hooks/useAuth';

// LD1: Styled component for the main layout container.
const LayoutContainer = styled(Box)`
    display: flex;
    min-height: 100vh;
    width: 100%;
`;

// LD1: Styled component for the sidebar container.
const SidebarContainer = styled(Box)`
    width: 280px;
    height: 100vh;
    position: fixed;
    display: none;

    @media (min-width: 992px) {
        display: block;
    }
`;

// LD1: Styled component for the content container.
const ContentContainer = styled(Box)`
    flex: 1;
    margin-left: 0;
    padding: 16px;

    @media (min-width: 992px) {
        margin-left: 280px;
        padding: 24px;
    }
`;

// LD1: Styled component for the mobile top bar container.
const MobileTopBarContainer = styled(Box)`
    display: block;
    position: sticky;
    top: 0;
    z-index: 10;

    @media (min-width: 992px) {
        display: none;
    }
`;

/**
 * Main layout component that provides the structure for the application
 */
export const MainLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // LD1: Retrieves the current journey from the JourneyContext.
    const { currentJourney } = useJourney();
    // LD1: Retrieves the authentication status from the AuthContext.
    const { isAuthenticated } = useAuth();
    // LD1: Retrieves the gamification state to check for unlocked achievements.
    const { gameProfile } = useGamification();
    // LD1: Retrieves the router object from Next.js.
    const router = useRouter();

    // LD1: Check if the user is authenticated, redirect to login if not.
    if (!isAuthenticated) {
        // router.push('/auth/login');
        return null;
    }

    // LD1: Get the achievement ID from the game profile, if available.
    const achievementId = gameProfile?.achievements.find((a) => a.unlocked)?.id;

    // LD1: Renders the main layout structure with Sidebar and content area.
    return (
        <LayoutContainer>
            {/* LD1: Renders the mobile top bar, which is only visible on smaller screens. */}
            <MobileTopBarContainer>
                <TopBar />
            </MobileTopBarContainer>

            {/* LD1: Renders the sidebar, which is only visible on larger screens. */}
            <SidebarContainer>
                <Sidebar />
            </SidebarContainer>

            {/* LD1: Renders the main content area. */}
            <ContentContainer>
                {/* LD1: Renders the children components (the content of the page). */}
                {children}
            </ContentContainer>

            {/* LD1: Renders the GamificationPopup when achievements are unlocked. */}
            <GamificationPopup
                visible={!!achievementId}
                onClose={() => {
                    // LD1: After closing the popup, refresh the page to update the achievement status.
                    router.replace(router.asPath);
                }}
                achievementId={achievementId || ''}
            />
        </LayoutContainer>
    );
};
