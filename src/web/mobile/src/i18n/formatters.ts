import i18n from 'i18next'; // version 23.0+

/**
 * Formats a date according to the specified locale and format options.
 *
 * @param date - The date to format
 * @param options - The formatting options for Intl.DateTimeFormat
 * @param locale - The locale to use for formatting (defaults to current i18n locale)
 * @returns The formatted date string
 */
export const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    },
    locale?: string
): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }

    const currentLocale = locale || i18n.language || 'pt-BR';

    return new Intl.DateTimeFormat(currentLocale, options).format(date);
};

/**
 * Formats a number according to the specified locale and format options.
 *
 * @param value - The number to format
 * @param options - The formatting options for Intl.NumberFormat
 * @param locale - The locale to use for formatting (defaults to current i18n locale)
 * @returns The formatted number string
 */
export const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}, locale?: string): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }

    const currentLocale = locale || i18n.language || 'pt-BR';

    return new Intl.NumberFormat(currentLocale, options).format(value);
};

/**
 * Formats a number as currency according to the specified locale and currency code.
 *
 * @param value - The number to format as currency
 * @param currencyCode - The ISO 4217 currency code (defaults to BRL)
 * @param locale - The locale to use for formatting (defaults to current i18n locale)
 * @returns The formatted currency string
 */
export const formatCurrency = (value: number, currencyCode: string = 'BRL', locale?: string): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '';
    }

    const currentLocale = locale || i18n.language || 'pt-BR';

    return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: currencyCode,
    }).format(value);
};

/**
 * Formats a phone number according to Brazilian phone number format.
 *
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if we have a valid Brazilian number
    if (cleaned.length < 10 || cleaned.length > 11) {
        return phoneNumber; // Return original if format doesn't match expectations
    }

    // Format according to Brazilian standards
    if (cleaned.length === 11) {
        // Mobile number with area code: (XX) XXXXX-XXXX
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else {
        // Landline with area code: (XX) XXXX-XXXX
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
};
