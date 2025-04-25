/**
 * Internationalization setup for the AUSTA SuperApp
 * 
 * This file configures and exports the i18next instance for internationalization 
 * in the web application, providing access to translation functions and managing locale settings.
 */

import i18n from 'i18next'; // v23.0+
import { initReactI18next, useTranslation } from 'react-i18next'; // v13.0+

// Import translations
import ptBR from './pt-BR';
import enUS from './en-US';

// Import i18n configuration
import { defaultLocale, supportedLocales } from 'src/web/shared/config/i18nConfig';

// Import formatters
import { formatDate } from './formatters';

// Initialize i18next
i18n
  // Initialize react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      'pt-BR': ptBR,
      'en-US': enUS
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: supportedLocales,
    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value, format, lng) => {
        // Handle date formatting
        if (value instanceof Date && format) {
          return formatDate(value, lng, format === 'short' 
            ? { day: '2-digit', month: '2-digit', year: 'numeric' }
            : format === 'long'
              ? { day: '2-digit', month: 'long', year: 'numeric' }
              : undefined);
        }
        return value;
      }
    },
    // Enable debugging in development environment
    debug: process.env.NODE_ENV === 'development',
    // React i18next special options
    react: {
      useSuspense: true
    }
  });

// Export the configured i18n instance and useTranslation hook
export { i18n, useTranslation };