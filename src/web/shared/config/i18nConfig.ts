/**
 * Internationalization configuration for the AUSTA SuperApp
 *
 * This configuration file defines the supported locales and default locale for the application.
 * The i18next library is used throughout the application for translation and localization.
 *
 * @package i18next v23.4.4
 */

/**
 * List of locales supported by the application
 * 
 * Current supported locales:
 * - pt-BR: Brazilian Portuguese (primary)
 * - en-US: US English (alternative)
 * 
 * Future planned locales:
 * - es: Spanish
 */
export const supportedLocales: string[] = ['pt-BR', 'en-US'];

/**
 * Default locale for the application
 * 
 * Brazilian Portuguese is the primary language for the AUSTA SuperApp
 * as specified in the technical requirements.
 */
export const defaultLocale: string = 'pt-BR';