import NextApp, { type AppProps, type AppContext } from 'next/app'; // next/app 13.0+
import { useRouter } from 'next/router'; // next/router 13.0+
import React, { useEffect } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components'; // styled-components 6.0+

import { AuthProvider } from '@/context/AuthContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { JourneyProvider } from '@/context/JourneyContext';
import { NotificationProvider } from '@/context/NotificationContext';
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

    // Initialize environment variables for browser compatibility
    useEffect(() => {
        initEnvironment();
    }, []);

    return (
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
    );
}

// Disable Automatic Static Optimization so that pages are server-rendered.
// react-native-web's styled-components integration requires a full React
// render cycle which SSG workers do not provide, causing useContext failures.
/* eslint-disable @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-call,
   @typescript-eslint/no-unsafe-member-access,
   @typescript-eslint/no-unsafe-return */
_app.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    return { ...appProps };
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-call,
   @typescript-eslint/no-unsafe-member-access,
   @typescript-eslint/no-unsafe-return */

export default _app;
