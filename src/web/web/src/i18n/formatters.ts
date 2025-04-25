/**
 * Formatters for internationalization
 * 
 * This module provides utility functions for formatting dates, numbers, and currencies
 * according to different locales, with a primary focus on Brazilian Portuguese (pt-BR)
 * and English (en-US).
 * 
 * Note: This module uses the built-in Intl API, which is part of the JavaScript standard library.
 */

/**
 * Formats a date object into a locale-specific string representation.
 * 
 * @param date - The date to format
 * @param locale - The locale to use for formatting (e.g., 'pt-BR', 'en-US')
 * @param options - Formatting options following the Intl.DateTimeFormatOptions interface
 * @returns The formatted date string
 * 
 * @example
 * // Returns "12/04/2023" for pt-BR or "4/12/2023" for en-US
 * formatDate(new Date(2023, 3, 12), 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
 */
export function formatDate(
  date: Date,
  locale: string = 'pt-BR',
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
): string {
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}

/**
 * Formats a number into a locale-specific string representation.
 * 
 * @param number - The number to format
 * @param locale - The locale to use for formatting (e.g., 'pt-BR', 'en-US')
 * @param options - Formatting options following the Intl.NumberFormatOptions interface
 * @returns The formatted number string
 * 
 * @example
 * // Returns "1.234,56" for pt-BR or "1,234.56" for en-US
 * formatNumber(1234.56, 'pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 */
export function formatNumber(
  number: number,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 2 }
): string {
  const formatter = new Intl.NumberFormat(locale, options);
  return formatter.format(number);
}

/**
 * Formats a number into a locale-specific currency string representation.
 * 
 * @param number - The number to format as currency
 * @param locale - The locale to use for formatting (e.g., 'pt-BR', 'en-US')
 * @param options - Formatting options with defaulting to BRL currency
 * @returns The formatted currency string
 * 
 * @example
 * // Returns "R$ 1.234,56" for pt-BR or "$1,234.56" for en-US
 * formatCurrency(1234.56, 'pt-BR', { currency: 'BRL' });
 * formatCurrency(1234.56, 'en-US', { currency: 'USD' });
 */
export function formatCurrency(
  number: number,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = {}
): string {
  const currencyOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL', // Default currency
    ...options, // Allow overriding any option including currency
  };
  const formatter = new Intl.NumberFormat(locale, currencyOptions);
  return formatter.format(number);
}