import { format, formatRelative } from 'date-fns'; // date-fns version: 2.30.0
import { ptBR } from 'date-fns/locale'; // date-fns version: 2.30.0

/**
 * Formats a date object into a string using the specified format and locale.
 * Uses Brazilian Portuguese (ptBR) as the default locale.
 *
 * @param date - The date to format
 * @param formatStr - The format string to use
 * @returns The formatted date string
 */
export function formatDate(date: Date | number, formatStr: string): string {
    return format(date, formatStr, { locale: ptBR });
}

/**
 * Formats a date object into a string that represents the relative time from the current time.
 * For example: "2 days ago", "yesterday", "in 3 hours", etc.
 * Uses Brazilian Portuguese (ptBR) as the locale.
 *
 * @param date - The date to format relative to now
 * @returns The formatted relative date string
 */
export function formatRelativeDate(date: Date | number): string {
    return formatRelative(date, new Date(), { locale: ptBR });
}
