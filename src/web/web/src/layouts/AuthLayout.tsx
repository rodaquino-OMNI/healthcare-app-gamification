import React from 'react';
import Box from 'design-system/primitives/Box/Box';
import Text from 'design-system/primitives/Text/Text';

/**
 * Defines the props interface for the AuthLayout component
 */
interface AuthLayoutProps {
    /**
     * The content to be rendered inside the authentication layout
     * (typically authentication forms like login, register, forgot password)
     */
    children: React.ReactNode;
}

/**
 * Provides a consistent layout for authentication pages in the AUSTA SuperApp.
 * This component creates a centered container with appropriate styling for auth forms.
 *
 * @param children - The authentication form or content to be displayed
 * @returns A styled authentication layout component
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            backgroundColor="gray100"
            padding="md"
        >
            <Box backgroundColor="white" borderRadius="lg" boxShadow="md" padding="xl" width="100%" maxWidth="400px">
                <Box display="flex" justifyContent="center" marginBottom="xl">
                    <Text as="h1" fontSize="2xl" fontWeight="bold" color="brand.primary">
                        AUSTA
                    </Text>
                </Box>

                {children}
            </Box>
        </Box>
    );
};

export default AuthLayout;
