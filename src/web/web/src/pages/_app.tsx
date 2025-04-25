import type { AppProps } from 'next/app'; // next/app 13.0+
import { ThemeProvider } from 'styled-components'; // styled-components 6.0+
import { useRouter } from 'next/router'; // next/router 13.0+

import { JourneyContext, JourneyProvider } from 'src/web/web/src/context/JourneyContext';
import { AuthProvider } from 'src/web/web/src/context/AuthContext';
import { GamificationProvider } from 'src/web/web/src/context/GamificationContext';
import { NotificationProvider } from 'src/web/web/src/context/NotificationContext';
import { I18nProvider } from 'src/web/web/src/i18n';
import { theme, GlobalStyle } from 'src/web/web/src/styles/theme';

/**
 * Custom App component that wraps all pages.
 * @param props - The props for the custom App component.
 * @returns The rendered App component.
 */
function _app({ Component, pageProps }: AppProps): JSX.Element {
  // LD1: Uses the useRouter hook to get the current route.
  const router = useRouter();

  // LD1: Returns a ThemeProvider component that wraps the entire application with the global theme.
  // LD1: Applies the I18nProvider for internationalization.
  // LD1: Applies the AuthProvider for authentication context.
  // LD1: Applies the GamificationProvider for gamification context.
  // LD1: Applies the NotificationProvider for notification context.
  // LD1: Applies the JourneyContext to provide journey-specific theming and context.
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <I18nProvider>
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

export default _app;