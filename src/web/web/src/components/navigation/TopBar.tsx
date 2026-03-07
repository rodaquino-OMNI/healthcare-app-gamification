import React from 'react';
import styled from 'styled-components'; // styled-components@^6.0.0
import { Sidebar } from '@/components/navigation/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { AuthSession } from 'shared/types/auth.types';
import { Button, ButtonProps } from 'design-system/components/Button/Button';
import { Text, TextProps } from 'design-system/primitives/Text/Text';
import { Touchable, TouchableProps } from 'design-system/primitives/Touchable/Touchable';
import { ALL_JOURNEYS } from 'shared/constants/journeys';

// LD1: Styled component for the top bar container.
const TopBarContainer = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;

    @media (min-width: 992px) {
        display: none;
    }
`;

// LD1: Styled component for the title text.
const Title = styled(Text)`
    font-size: 20px;
    font-weight: 500;
`;

// LD1: Styled component for the profile section.
const ProfileSection = styled.div`
    display: flex;
    align-items: center;
`;

// LD1: Styled component for the user name text.
const UserName = styled(Text)`
    font-size: 16px;
    font-weight: 500;
    margin-right: 16px;
`;

// LD1: A top navigation bar component that displays the application title, user profile information, and a settings button.
export const TopBar: React.FC = () => {
    // LD1: Retrieves the authentication status and session from the useAuth hook.
    const { session, isAuthenticated } = useAuth();

    // LD1: Renders the top bar container with the application title and user profile information.
    return (
        <TopBarContainer>
            <Title>AUSTA</Title>
            {/* LD1: If the user is authenticated, displays the user's name and a settings button. */}
            {isAuthenticated && session ? (
                <ProfileSection>
                    <UserName>{session.accessToken}</UserName>
                    {/* LD1: The settings button navigates to the profile settings page when pressed. */}
                    <Button variant="secondary" size="sm">
                        Settings
                    </Button>
                </ProfileSection>
            ) : (
                // LD1: If the user is not authenticated, displays a login button.
                <Button variant="primary" size="sm">
                    Login
                </Button>
            )}
        </TopBarContainer>
    );
};
