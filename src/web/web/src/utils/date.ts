import {
    format,
    parse,
    isValid,
    addDays,
    addMonths,
    addYears,
    subDays,
    subMonths,
    subYears,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    isSameDay as isSameDayFn,
    isBefore,
    isAfter,
} from 'date-fns'; // date-fns version: 2.30+
import { ptBR, enUS } from 'date-fns/locale'; // date-fns version: 2.30+

// Default formats
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DEFAULT_LOCALE = 'pt-BR';

// Locale map
const LOCALE_MAP = {
    'pt-BR': ptBR,
    'en-US': enUS,
};

/**
 * Formats a date according to the specified format and locale
 * @param date The date to format
 * @param formatStr Format string (default: dd/MM/yyyy)
 * @param locale Locale identifier (default: pt-BR)
 * @returns The formatted date string
 */
export const formatDate = (
    date: Date | string | number,
    formatStr: string = DEFAULT_DATE_FORMAT,
    locale: string = DEFAULT_LOCALE
): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
    return format(new Date(date), formatStr, { locale: localeObj });
};

/**
 * Formats a time according to the specified format and locale
 * @param date The date to format
 * @param formatStr Format string (default: HH:mm)
 * @param locale Locale identifier (default: pt-BR)
 * @returns The formatted time string
 */
export const formatTime = (
    date: Date | string | number,
    formatStr: string = DEFAULT_TIME_FORMAT,
    locale: string = DEFAULT_LOCALE
): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
    return format(new Date(date), formatStr, { locale: localeObj });
};

/**
 * Formats a date and time according to the specified format and locale
 * @param date The date to format
 * @param formatStr Format string (default: dd/MM/yyyy HH:mm)
 * @param locale Locale identifier (default: pt-BR)
 * @returns The formatted date and time string
 */
export const formatDateTime = (
    date: Date | string | number,
    formatStr: string = DEFAULT_DATETIME_FORMAT,
    locale: string = DEFAULT_LOCALE
): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
    return format(new Date(date), formatStr, { locale: localeObj });
};

/**
 * Parses a date string according to the specified format and locale
 * @param dateStr The date string to parse
 * @param formatStr Format string (default: dd/MM/yyyy)
 * @param locale Locale identifier (default: pt-BR)
 * @returns The parsed date object
 */
export const parseDate = (
    dateStr: string,
    formatStr: string = DEFAULT_DATE_FORMAT,
    locale: string = DEFAULT_LOCALE
): Date => {
    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];
    const parsedDate = parse(dateStr, formatStr, new Date(), {
        locale: localeObj,
    });

    if (!isValid(parsedDate)) {
        throw new Error(`Invalid date string: ${dateStr} for format: ${formatStr}`);
    }

    return parsedDate;
};

/**
 * Checks if a date is valid
 * @param date The date to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (date: any): boolean => {
    if (date === null || date === undefined) {
        return false;
    }

    if (date instanceof Date) {
        return isValid(date);
    }

    if (typeof date === 'string') {
        const d = new Date(date);
        return isValid(d);
    }

    if (typeof date === 'number') {
        const d = new Date(date);
        return isValid(d);
    }

    return false;
};

/**
 * Gets the start and end dates for a specified range type
 * @param rangeType The type of date range (today, yesterday, thisWeek, etc.)
 * @param referenceDate Reference date (default: current date)
 * @returns Object with startDate and endDate
 */
export const getDateRange = (
    rangeType: string,
    referenceDate: Date = new Date()
): { startDate: Date; endDate: Date } => {
    const today = new Date(referenceDate);

    switch (rangeType) {
        case 'today':
            return {
                startDate: startOfDay(today),
                endDate: endOfDay(today),
            };
        case 'yesterday':
            const yesterday = subDays(today, 1);
            return {
                startDate: startOfDay(yesterday),
                endDate: endOfDay(yesterday),
            };
        case 'thisWeek':
            return {
                startDate: startOfWeek(today, { weekStartsOn: 0 }),
                endDate: endOfWeek(today, { weekStartsOn: 0 }),
            };
        case 'lastWeek':
            const lastWeek = subDays(today, 7);
            return {
                startDate: startOfWeek(lastWeek, { weekStartsOn: 0 }),
                endDate: endOfWeek(lastWeek, { weekStartsOn: 0 }),
            };
        case 'thisMonth':
            return {
                startDate: startOfMonth(today),
                endDate: endOfMonth(today),
            };
        case 'lastMonth':
            const lastMonth = subMonths(today, 1);
            return {
                startDate: startOfMonth(lastMonth),
                endDate: endOfMonth(lastMonth),
            };
        case 'thisYear':
            return {
                startDate: startOfYear(today),
                endDate: endOfYear(today),
            };
        case 'lastYear':
            const lastYear = subYears(today, 1);
            return {
                startDate: startOfYear(lastYear),
                endDate: endOfYear(lastYear),
            };
        case 'last7Days':
            return {
                startDate: startOfDay(subDays(today, 6)),
                endDate: endOfDay(today),
            };
        case 'last30Days':
            return {
                startDate: startOfDay(subDays(today, 29)),
                endDate: endOfDay(today),
            };
        case 'last90Days':
            return {
                startDate: startOfDay(subDays(today, 89)),
                endDate: endOfDay(today),
            };
        case 'last365Days':
            return {
                startDate: startOfDay(subDays(today, 364)),
                endDate: endOfDay(today),
            };
        default:
            return {
                startDate: startOfDay(today),
                endDate: endOfDay(today),
            };
    }
};

/**
 * Calculates age in years based on birthdate
 * @param birthdate Birthdate
 * @param referenceDate Reference date (default: current date)
 * @returns Age in years
 */
export const calculateAge = (birthdate: Date | string, referenceDate: Date = new Date()): number => {
    if (!isValidDate(birthdate)) {
        throw new Error('Invalid birthdate');
    }

    const birthdateObj = typeof birthdate === 'string' ? parseDate(birthdate) : birthdate;

    return differenceInYears(referenceDate, birthdateObj);
};

/**
 * Formats a date range as a string
 * @param startDate Range start date
 * @param endDate Range end date
 * @param formatStr Format string (default: dd/MM/yyyy)
 * @param locale Locale identifier (default: pt-BR)
 * @returns Formatted date range string
 */
export const formatDateRange = (
    startDate: Date,
    endDate: Date,
    formatStr: string = DEFAULT_DATE_FORMAT,
    locale: string = DEFAULT_LOCALE
): string => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return '';
    }

    const formattedStartDate = formatDate(startDate, formatStr, locale);
    const formattedEndDate = formatDate(endDate, formatStr, locale);

    return `${formattedStartDate} - ${formattedEndDate}`;
};

/**
 * Returns a human-readable string representing time elapsed since the given date
 * @param date The reference date
 * @param locale Locale identifier (default: pt-BR)
 * @returns Human-readable time ago string
 */
export const getTimeAgo = (date: Date | string | number, locale: string = DEFAULT_LOCALE): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    // Define time units in seconds
    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MONTH = DAY * 30;
    const YEAR = DAY * 365;

    let result: string;
    if (diffInSeconds < MINUTE) {
        result = locale === 'pt-BR' ? `${diffInSeconds} segundos atrás` : `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < HOUR) {
        const minutes = Math.floor(diffInSeconds / MINUTE);
        result =
            locale === 'pt-BR'
                ? `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`
                : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < DAY) {
        const hours = Math.floor(diffInSeconds / HOUR);
        result =
            locale === 'pt-BR'
                ? `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`
                : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < WEEK) {
        const days = Math.floor(diffInSeconds / DAY);
        result =
            locale === 'pt-BR'
                ? `${days} ${days === 1 ? 'dia' : 'dias'} atrás`
                : `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < MONTH) {
        const weeks = Math.floor(diffInSeconds / WEEK);
        result =
            locale === 'pt-BR'
                ? `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`
                : `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < YEAR) {
        const months = Math.floor(diffInSeconds / MONTH);
        result =
            locale === 'pt-BR'
                ? `${months} ${months === 1 ? 'mês' : 'meses'} atrás`
                : `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffInSeconds / YEAR);
        result =
            locale === 'pt-BR'
                ? `${years} ${years === 1 ? 'ano' : 'anos'} atrás`
                : `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }

    return result;
};

/**
 * Gets an array of dates between start and end dates (inclusive)
 * @param startDate Range start date
 * @param endDate Range end date
 * @returns Array of dates between start and end dates
 */
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('Invalid date range');
    }

    // Ensure startDate is before or equal to endDate
    if (!(isBefore(startDate, endDate) || isSameDayFn(startDate, endDate))) {
        throw new Error('Start date must be before or equal to end date');
    }

    const dateArray: Date[] = [];
    let currentDate = new Date(startDate.getTime());

    // Add each date to the array
    while (isBefore(currentDate, endDate) || isSameDayFn(currentDate, endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dateArray;
};

/**
 * Checks if two dates are the same day
 * @param dateA First date
 * @param dateB Second date
 * @returns True if dates are the same day, false otherwise
 */
export const isSameDay = (dateA: Date | string | number, dateB: Date | string | number): boolean => {
    if (!isValidDate(dateA) || !isValidDate(dateB)) {
        return false;
    }

    const dateAObj = new Date(dateA);
    const dateBObj = new Date(dateB);

    return isSameDayFn(dateAObj, dateBObj);
};

/**
 * Gets the local timezone identifier
 * @returns The local timezone identifier
 */
export const getLocalTimezone = (): string => {
    const offset = new Date().getTimezoneOffset();
    const absOffset = Math.abs(offset);

    // Format: +/-HH:MM
    const hours = Math.floor(absOffset / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (absOffset % 60).toString().padStart(2, '0');

    return `${offset < 0 ? '+' : '-'}${hours}:${minutes}`;
};

/**
 * Formats a date relative to the current date (today, yesterday, etc.)
 * @param date The date to format
 * @param locale Locale identifier (default: pt-BR)
 * @returns Relative date string
 */
export const formatRelativeDate = (date: Date | string | number, locale: string = DEFAULT_LOCALE): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const dateObj = new Date(date);
    const today = new Date();
    const yesterday = subDays(today, 1);

    if (isSameDayFn(dateObj, today)) {
        return locale === 'pt-BR' ? 'Hoje' : 'Today';
    }

    if (isSameDayFn(dateObj, yesterday)) {
        return locale === 'pt-BR' ? 'Ontem' : 'Yesterday';
    }

    const diffDays = differenceInDays(today, dateObj);

    if (diffDays < 7) {
        const weekdayFormat = locale === 'pt-BR' ? 'EEEE' : 'EEEE';
        return formatDate(dateObj, weekdayFormat, locale);
    }

    return formatDate(dateObj, DEFAULT_DATE_FORMAT, locale);
};

/**
 * Formats a date according to journey-specific requirements
 * @param date The date to format
 * @param journeyId Journey identifier (health, care, plan)
 * @param locale Locale identifier (default: pt-BR)
 * @returns Journey-specific formatted date
 */
export const formatJourneyDate = (
    date: Date | string | number,
    journeyId: string,
    locale: string = DEFAULT_LOCALE
): string => {
    if (!isValidDate(date)) {
        return '';
    }

    let formatStr = DEFAULT_DATE_FORMAT;

    switch (journeyId) {
        case 'health':
            // Health journey: use detailed format with time for metrics
            formatStr = 'dd/MM/yyyy HH:mm';
            break;
        case 'care':
            // Care journey: use appointment-friendly format
            formatStr = 'EEEE, dd/MM/yyyy HH:mm';
            break;
        case 'plan':
            // Plan journey: use formal date format for claims and documents
            formatStr = 'dd/MM/yyyy';
            break;
        default:
            formatStr = DEFAULT_DATE_FORMAT;
    }

    return formatDate(date, formatStr, locale);
};

/**
 * Checks if a date is within a specified range
 * @param date The date to check
 * @param startDate Range start date
 * @param endDate Range end date
 * @returns True if the date is within the range, false otherwise
 */
export const isDateInRange = (
    date: Date | string | number,
    startDate: Date | string | number,
    endDate: Date | string | number
): boolean => {
    if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) {
        return false;
    }

    const dateObj = new Date(date);
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    // Check if date is after or equal to startDate
    const isAfterStart = isAfter(dateObj, startObj) || isSameDayFn(dateObj, startObj);

    // Check if date is before or equal to endDate
    const isBeforeEnd = isBefore(dateObj, endObj) || isSameDayFn(dateObj, endObj);

    return isAfterStart && isBeforeEnd;
};
