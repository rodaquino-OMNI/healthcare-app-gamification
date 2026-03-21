/**
 * Formatting utility functions for the AUSTA SuperApp
 *
 * This file provides utility functions for formatting various data types such as
 * numbers, currency, percentages, and other values in a consistent way across
 * the application while supporting internationalization and journey-specific
 * formatting requirements.
 *
 * @package i18next v23.0.0
 */

import i18n from 'i18next';

import { defaultLocale } from '../config/i18nConfig';
import { JOURNEY_IDS } from '../constants/journeys';

// Default locale for the application
const DEFAULT_LOCALE = 'pt-BR';

/**
 * Formats a number according to the specified locale and options.
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @param locale - The locale to use for formatting (defaults to user's locale or app default)
 * @returns The formatted number string
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: string): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const userLocale = locale || i18n.language || defaultLocale || DEFAULT_LOCALE;

    try {
        const formatter = new Intl.NumberFormat(userLocale, options);
        return formatter.format(value);
    } catch (error) {
        console.error('Error formatting number:', error);
        return value.toString();
    }
}

/**
 * Formats a number as currency according to the specified locale and currency code.
 *
 * @param value - The number to format as currency
 * @param currencyCode - The ISO currency code (defaults to BRL for Brazilian Real)
 * @param locale - The locale to use for formatting (defaults to user's locale or app default)
 * @returns The formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string = 'BRL', locale?: string): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const userLocale = locale || i18n.language || defaultLocale || DEFAULT_LOCALE;

    try {
        const formatter = new Intl.NumberFormat(userLocale, {
            style: 'currency',
            currency: currencyCode,
        });
        return formatter.format(value);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return value.toString();
    }
}

/**
 * Formats a number as a percentage according to the specified locale and decimal places.
 *
 * @param value - The number to format as percentage (0.1 = 10%)
 * @param decimalPlaces - The number of decimal places to include
 * @param locale - The locale to use for formatting (defaults to user's locale or app default)
 * @returns The formatted percentage string
 */
export function formatPercent(value: number, decimalPlaces?: number, locale?: string): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const userLocale = locale || i18n.language || defaultLocale || DEFAULT_LOCALE;

    try {
        const options: Intl.NumberFormatOptions = {
            style: 'percent',
        };

        if (decimalPlaces !== undefined) {
            options.minimumFractionDigits = decimalPlaces;
            options.maximumFractionDigits = decimalPlaces;
        }

        const formatter = new Intl.NumberFormat(userLocale, options);
        return formatter.format(value);
    } catch (error) {
        console.error('Error formatting percentage:', error);
        return `${(value * 100).toString()}%`;
    }
}

/**
 * Formats a number in a compact form (e.g., 1K, 1M) according to the specified locale.
 *
 * @param value - The number to format in compact form
 * @param locale - The locale to use for formatting (defaults to user's locale or app default)
 * @returns The formatted compact number string
 */
export function formatCompactNumber(value: number, locale?: string): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    const userLocale = locale || i18n.language || defaultLocale || DEFAULT_LOCALE;

    try {
        const formatter = new Intl.NumberFormat(userLocale, {
            notation: 'compact',
            compactDisplay: 'short',
        });
        return formatter.format(value);
    } catch (error) {
        console.error('Error formatting compact number:', error);
        return value.toString();
    }
}

/**
 * Formats a value according to the journey-specific formatting rules.
 *
 * @param value - The value to format
 * @param journeyId - The journey identifier (health, care, plan)
 * @param format - The format type (number, currency, percent)
 * @param options - Additional formatting options
 * @returns The journey-formatted value string
 */
export function formatJourneyValue(
    value: number,
    journeyId: string,
    format: 'number' | 'currency' | 'percent' = 'number',
    options?: Intl.NumberFormatOptions
): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    // Apply journey-specific formatting rules
    const journeyOptions = { ...options };
    const locale = i18n.language || defaultLocale || DEFAULT_LOCALE;

    switch (journeyId) {
        case JOURNEY_IDS.HEALTH:
            // Health journey specific formatting (more precision for health metrics)
            if (format === 'number' && !journeyOptions.minimumFractionDigits) {
                journeyOptions.minimumFractionDigits = 1;
                journeyOptions.maximumFractionDigits = 1;
            }
            break;

        case JOURNEY_IDS.CARE:
            // Care journey may have specific formatting requirements
            break;

        case JOURNEY_IDS.PLAN:
            // Plan journey (e.g., always show currency with 2 decimal places)
            if (format === 'currency') {
                journeyOptions.minimumFractionDigits = 2;
                journeyOptions.maximumFractionDigits = 2;
            }
            break;

        default:
            // Default formatting
            break;
    }

    // Call the appropriate formatter based on format type
    switch (format) {
        case 'currency':
            return formatCurrency(value, (journeyOptions?.currency as string) || 'BRL', locale);
        case 'percent':
            return formatPercent(value, journeyOptions?.maximumFractionDigits, locale);
        case 'number':
        default:
            return formatNumber(value, journeyOptions, locale);
    }
}

/**
 * Formats a health metric value with its unit according to the metric type.
 *
 * @param value - The metric value to format
 * @param metricType - The type of health metric (e.g., HEART_RATE, BLOOD_PRESSURE)
 * @param unit - The unit of measurement
 * @param locale - The locale to use for formatting
 * @returns The formatted health metric string
 */
export function formatHealthMetric(value: number | string, metricType: string, unit: string, locale?: string): string {
    if (value === null || value === undefined) {
        return '';
    }

    const userLocale = locale || i18n.language || defaultLocale || DEFAULT_LOCALE;

    // Handle blood pressure as a special case (typically formatted as systolic/diastolic)
    if (metricType === 'BLOOD_PRESSURE' && typeof value === 'string') {
        // Assuming value is in format "120/80"
        return `${value} ${unit}`;
    }

    if (typeof value === 'string') {
        // Try to convert to number if it's a numeric string
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            value = numValue;
        } else {
            // If it's not a valid number, return as is with unit
            return `${value} ${unit}`;
        }
    }

    // Format number based on metric type
    let formattedValue: string;

    switch (metricType) {
        case 'HEART_RATE':
        case 'STEPS':
            // Integers without decimal places
            formattedValue = formatNumber(value, { maximumFractionDigits: 0 }, userLocale);
            break;

        case 'BLOOD_GLUCOSE':
            // Usually requires more precision
            formattedValue = formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, userLocale);
            break;

        case 'WEIGHT':
            // Usually one decimal place
            formattedValue = formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, userLocale);
            break;

        default:
            formattedValue = formatNumber(value, undefined, userLocale);
    }

    // Combine the formatted value with the unit
    return `${formattedValue} ${unit}`;
}

/**
 * Truncates text to a specified length and adds an ellipsis if needed.
 *
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the text (default: 50)
 * @param ellipsis - The ellipsis string to append (default: '...')
 * @returns The truncated text string
 */
export function truncateText(text: string, maxLength: number = 50, ellipsis: string = '...'): string {
    if (!text) {
        return '';
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + ellipsis;
}

/**
 * Formats a phone number according to Brazilian phone number format.
 *
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
        return '';
    }

    // Remove non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');

    // Check if we have a valid length
    if (digits.length < 10 || digits.length > 11) {
        return phoneNumber; // Return original if not valid
    }

    // Format according to Brazilian phone number format
    if (digits.length === 11) {
        // Format with area code and 9-digit number (mobile)
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3, 7)}-${digits.substring(7)}`;
    } else {
        // Format with area code and 8-digit number (landline)
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
}

/**
 * Formats a CPF (Brazilian tax ID) number with the standard mask.
 *
 * @param cpf - The CPF number to format
 * @returns The formatted CPF string
 */
/**
 * Generic format namespace re-export for consumers that import { format } from shared/utils/format.
 * Provides the core formatting functions as a single object.
 */
export const format = {
    number: formatNumber,
    currency: formatCurrency,
    percent: formatPercent,
    journeyValue: formatJourneyValue,
    healthMetric: formatHealthMetric,
    compact: formatCompactNumber,
    truncate: truncateText,
    phone: formatPhoneNumber,
};

export function formatCPF(cpf: string): string {
    if (!cpf) {
        return '';
    }

    // Remove non-digit characters
    const digits = cpf.replace(/\D/g, '');

    // Check if we have the correct length
    if (digits.length !== 11) {
        return cpf; // Return original if not valid
    }

    // Apply CPF mask: XXX.XXX.XXX-XX
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}`;
}
