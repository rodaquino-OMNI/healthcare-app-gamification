import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type AppProps } from 'next/app'; // next/app 13.0+
import React, { useEffect, useState } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components'; // styled-components 6.0+

import { graphQLClient } from '@/api/client';
import { AuthProvider } from '@/context/AuthContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { JourneyProvider } from '@/context/JourneyContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { i18n, I18nProvider } from '@/i18n';
import { theme, GlobalStyle } from '@/styles/theme';
import { initEnvironment } from '@/utils/env-init';

/**
 * Custom App component that wraps all pages.
 * @param props - The props for the custom App component.
 * @returns The rendered App component.
 */
function _app({ Component, pageProps }: AppProps): React.ReactElement {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient());

    // Initialize environment variables for browser compatibility
    useEffect(() => {
        initEnvironment();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ApolloProvider client={graphQLClient}>
                <ThemeProvider theme={theme as unknown as DefaultTheme}>
                    <GlobalStyle />
                    <I18nProvider i18n={i18n}>
                        <AuthProvider>
                            <GamificationProvider>
                                <NotificationProvider>
                                    <JourneyProvider>
                                        <Component {...pageProps} key={router.asPath} />
                                    </JourneyProvider>
                                </NotificationProvider>
                            </GamificationProvider>
                        </AuthProvider>
                    </I18nProvider>
                </ThemeProvider>
            </ApolloProvider>
        </QueryClientProvider>
    );
}

export default _app;
