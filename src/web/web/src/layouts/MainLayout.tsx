import { Box } from 'design-system/primitives/Box';
import React, { useContext } from 'react';
import styled from 'styled-components'; // styled-components@^6.0.0

import { Sidebar } from '@/components/navigation/Sidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { GamificationPopup } from '@/components/shared/GamificationPopup';
import { AuthContext } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
// useAuth removed — auth check uses AuthContext directly

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

interface MainLayoutProps {
    children: React.ReactNode;
}

/**
 * Main layout component that provides the structure
 * for the application
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    // LD1: Retrieves the gamification state to check for unlocked achievements.
    const { gameProfile } = useGamification();
    // LD1: Retrieves the router object from Next.js.
    const router = useRouter();

    // During SSR, auth status is 'loading' (useEffect hasn't run).
    // Only redirect on the client when explicitly unauthenticated.
    const auth = useContext(AuthContext);
    if (typeof window !== 'undefined' && auth.status === 'unauthenticated') {
        void router.push('/auth/login');
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
                    // LD1: Refresh page to update achievement status.
                    void router.replace(router.asPath);
                }}
                achievementId={achievementId || ''}
            />
        </LayoutContainer>
    );
};
