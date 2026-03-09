/**
 * Internationalization setup for the AUSTA SuperApp
 *
 * This file configures and exports the i18next instance
 * for internationalization in the web application,
 * providing access to translation functions and managing
 * locale settings.
 */

import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { defaultLocale, supportedLocales } from 'shared/config/i18nConfig';

import enUS from './en-US';
import { formatDate } from './formatters';
import ptBR from './pt-BR';

// Initialize i18next
void i18next.use(initReactI18next).init({
    resources: {
        'pt-BR': ptBR,
        'en-US': enUS,
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: supportedLocales,
    interpolation: {
        escapeValue: false,
        format: (value: unknown, fmt?: string, lng?: string): string => {
            if (value instanceof Date && fmt) {
                return formatDate(
                    value,
                    lng,
                    fmt === 'short'
                        ? {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                          }
                        : fmt === 'long'
                          ? {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            }
                          : undefined
                );
            }
            return String(value);
        },
    },
    debug: process.env.NODE_ENV === 'development',
    react: {
        useSuspense: false,
    },
});

const i18n = i18next;

// Export the configured i18n instance and useTranslation hook
export { i18n, useTranslation };

/**
 * Alias for useTranslation -- backward compatibility.
 */
export const useI18n = useTranslation;

/**
 * Alias for I18nextProvider -- backward compatibility.
 */
export { I18nextProvider as I18nProvider } from 'react-i18next';
