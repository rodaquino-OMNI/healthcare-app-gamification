/**
 * Internationalization (i18n) setup for the AUSTA SuperApp mobile application
 * 
 * This file configures i18next with translations and language detection, providing
 * localization capabilities throughout the mobile app. It supports Brazilian Portuguese
 * (primary) and US English (alternative) languages as specified in the technical requirements.
 *
 * @package i18next v23.0.0
 * @package react-i18next v13.0.0
 */

import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import ptBR from './pt-BR'; // Brazilian Portuguese translations
import enUS from './en-US'; // US English translations
import { supportedLocales, defaultLocale } from 'src/web/shared/config/i18nConfig';

// Initialize i18next with the available translations
i18n
  .use(initReactI18next) // Connects i18next with React
  .init({
    resources: {
      'pt-BR': {
        translation: ptBR, // Brazilian Portuguese translations
      },
      'en-US': {
        translation: enUS, // US English translations
      },
    },
    lng: defaultLocale, // Use Brazilian Portuguese as default
    fallbackLng: defaultLocale, // Fallback to Brazilian Portuguese if a translation is missing
    supportedLngs: supportedLocales, // Use the supported locales from the shared config
    
    interpolation: {
      escapeValue: false, // React already handles escaping for security
    },
    
    // React-specific configuration
    react: {
      useSuspense: true, // Use React Suspense for loading translations
    },
  });

// Export the configured i18n instance and the useTranslation hook for use in components
export { i18n, useTranslation };