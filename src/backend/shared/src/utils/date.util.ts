/* eslint-disable */
import {
    format,
    parse,
    isValid,
    addDays,
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
    isSameDay as fnIsSameDay,
    isBefore,
    isAfter,
} from 'date-fns'; // date-fns version: 2.30+
import { ptBR, enUS, Locale } from 'date-fns/locale'; // date-fns version: 2.30+

// Default format strings
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DEFAULT_LOCALE = 'pt-BR';

// Locale mapping with proper type definition to fix TypeScript errors
const LOCALE_MAP: Record<string, Locale> = {
    'pt-BR': ptBR,
    'en-US': enUS,
};

/**
 * Formats a date according to the specified format and locale
 *
 * @param date - The date to format
 * @param formatStr - The format string (defaults to dd/MM/yyyy)
 * @param locale - The locale to use for formatting (defaults to pt-BR)
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

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];

    return format(dateObj, formatStr, { locale: localeObj });
};

/**
 * Formats a time according to the specified format and locale
 *
 * @param date - The date/time to format
 * @param formatStr - The format string (defaults to HH:mm)
 * @param locale - The locale to use for formatting (defaults to pt-BR)
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

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];

    return format(dateObj, formatStr, { locale: localeObj });
};

/**
 * Formats a date and time according to the specified format and locale
 *
 * @param date - The date/time to format
 * @param formatStr - The format string (defaults to dd/MM/yyyy HH:mm)
 * @param locale - The locale to use for formatting (defaults to pt-BR)
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

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];

    return format(dateObj, formatStr, { locale: localeObj });
};

/**
 * Parses a date string according to the specified format and locale
 *
 * @param dateStr - The date string to parse
 * @param formatStr - The format string (defaults to dd/MM/yyyy)
 * @param locale - The locale to use for parsing (defaults to pt-BR)
 * @returns The parsed date object
 * @throws Error if the date string cannot be parsed
 */
export const parseDate = (
    dateStr: string,
    formatStr: string = DEFAULT_DATE_FORMAT,
    locale: string = DEFAULT_LOCALE
): Date => {
    const localeObj = LOCALE_MAP[locale] || LOCALE_MAP[DEFAULT_LOCALE];

    const parsedDate = parse(dateStr, formatStr, new Date(), { locale: localeObj });

    if (!isValid(parsedDate)) {
        throw new Error(`Invalid date string: ${dateStr} for format: ${formatStr}`);
    }

    return parsedDate;
};

/**
 * Checks if a date is valid
 *
 * @param date - The date to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (date: unknown): boolean => {
    if (date === null || date === undefined) {
        return false;
    }

    if (date instanceof Date) {
        return isValid(date);
    }

    if (typeof date === 'string') {
        const dateObj = new Date(date);
        return isValid(dateObj);
    }

    if (typeof date === 'number') {
        const dateObj = new Date(date);
        return isValid(dateObj);
    }

    return false;
};

/**
 * Gets the start and end dates for a specified range type
 *
 * @param rangeType - The type of range (today, thisWeek, thisMonth, etc.)
 * @param referenceDate - The reference date (defaults to today)
 * @returns Object with start and end dates for the range
 */
export const getDateRange = (
    rangeType: string,
    referenceDate: Date = new Date()
): { startDate: Date; endDate: Date } => {
    const today = referenceDate || new Date();

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
                startDate: startOfWeek(today, { weekStartsOn: 0 }), // 0 = Sunday
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
 *
 * @param birthdate - The birthdate
 * @param referenceDate - The reference date to calculate age against (defaults to today)
 * @returns Age in years
 */
export const calculateAge = (birthdate: Date | string, referenceDate: Date = new Date()): number => {
    if (!isValidDate(birthdate)) {
        throw new Error('Invalid birthdate provided');
    }

    const birthdateObj = typeof birthdate === 'string' ? parseDate(birthdate) : birthdate;

    return differenceInYears(referenceDate, birthdateObj);
};

/**
 * Formats a date range as a string
 *
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @param formatStr - The format string for dates (defaults to dd/MM/yyyy)
 * @param locale - The locale to use for formatting (defaults to pt-BR)
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
 *
 * @param date - The date to calculate time elapsed from
 * @param locale - The locale to use for formatting (defaults to pt-BR)
 * @returns Human-readable time ago string
 */
export const getTimeAgo = (date: Date | string | number, locale: string = DEFAULT_LOCALE): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    // Localized time units
    const timeUnits =
        locale === 'pt-BR'
            ? {
                  seconds: 'segundos',
                  minute: 'minuto',
                  minutes: 'minutos',
                  hour: 'hora',
                  hours: 'horas',
                  day: 'dia',
                  days: 'dias',
                  week: 'semana',
                  weeks: 'semanas',
                  month: 'mês',
                  months: 'meses',
                  year: 'ano',
                  years: 'anos',
                  ago: 'atrás',
              }
            : {
                  seconds: 'seconds',
                  minute: 'minute',
                  minutes: 'minutes',
                  hour: 'hour',
                  hours: 'hours',
                  day: 'day',
                  days: 'days',
                  week: 'week',
                  weeks: 'weeks',
                  month: 'month',
                  months: 'months',
                  year: 'year',
                  years: 'years',
                  ago: 'ago',
              };

    if (diffInSeconds < 60) {
        return `${diffInSeconds} ${timeUnits.seconds} ${timeUnits.ago}`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return diffInMinutes === 1
            ? `1 ${timeUnits.minute} ${timeUnits.ago}`
            : `${diffInMinutes} ${timeUnits.minutes} ${timeUnits.ago}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return diffInHours === 1
            ? `1 ${timeUnits.hour} ${timeUnits.ago}`
            : `${diffInHours} ${timeUnits.hours} ${timeUnits.ago}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return diffInDays === 1
            ? `1 ${timeUnits.day} ${timeUnits.ago}`
            : `${diffInDays} ${timeUnits.days} ${timeUnits.ago}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return diffInWeeks === 1
            ? `1 ${timeUnits.week} ${timeUnits.ago}`
            : `${diffInWeeks} ${timeUnits.weeks} ${timeUnits.ago}`;
    }

    const diffInMonths = differenceInMonths(now, dateObj);
    if (diffInMonths < 12) {
        return diffInMonths === 1
            ? `1 ${timeUnits.month} ${timeUnits.ago}`
            : `${diffInMonths} ${timeUnits.months} ${timeUnits.ago}`;
    }

    const diffInYears = differenceInYears(now, dateObj);
    return diffInYears === 1
        ? `1 ${timeUnits.year} ${timeUnits.ago}`
        : `${diffInYears} ${timeUnits.years} ${timeUnits.ago}`;
};

/**
 * Gets an array of dates between start and end dates (inclusive)
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Array of dates between start and end dates
 */
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('Invalid date range provided');
    }

    if (!isBefore(startDate, endDate) && !fnIsSameDay(startDate, endDate)) {
        throw new Error('Start date must be before or the same as end date');
    }

    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate) || fnIsSameDay(currentDate, endDate)) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return dates;
};

/**
 * Checks if two dates are the same day
 *
 * @param dateA - The first date
 * @param dateB - The second date
 * @returns True if dates are the same day, false otherwise
 */
export const isSameDay = (dateA: Date | string | number, dateB: Date | string | number): boolean => {
    if (!isValidDate(dateA) || !isValidDate(dateB)) {
        return false;
    }

    const dateAObj = typeof dateA === 'string' || typeof dateA === 'number' ? new Date(dateA) : dateA;
    const dateBObj = typeof dateB === 'string' || typeof dateB === 'number' ? new Date(dateB) : dateB;

    return fnIsSameDay(dateAObj, dateBObj);
};

/**
 * Gets the local timezone identifier
 *
 * @returns The local timezone identifier
 */
export const getLocalTimezone = (): string => {
    const date = new Date();
    const offset = -date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const direction = offset >= 0 ? '+' : '-';

    return `${direction}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
};

/**
 * Formats a date relative to the current date (today, yesterday, etc.)
 *
 * @param date - The date to format
 * @param locale - The locale to use for formatting (defaults to pt-BR)
 * @returns Relative date string
 */
export const formatRelativeDate = (date: Date | string | number, locale: string = DEFAULT_LOCALE): string => {
    if (!isValidDate(date)) {
        return '';
    }

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const today = new Date();
    const yesterday = subDays(today, 1);

    // Localized relative terms
    const terms =
        locale === 'pt-BR'
            ? {
                  today: 'Hoje',
                  yesterday: 'Ontem',
                  daysAgo: 'dias atrás',
                  thisMonth: 'Este mês',
                  lastMonth: 'Mês passado',
              }
            : {
                  today: 'Today',
                  yesterday: 'Yesterday',
                  daysAgo: 'days ago',
                  thisMonth: 'This month',
                  lastMonth: 'Last month',
              };

    if (fnIsSameDay(dateObj, today)) {
        return terms.today;
    }

    if (fnIsSameDay(dateObj, yesterday)) {
        return terms.yesterday;
    }

    const diffDays = differenceInDays(today, dateObj);

    if (diffDays < 30) {
        return `${diffDays} ${terms.daysAgo}`;
    }

    // For older dates, return formatted date
    return formatDate(dateObj, DEFAULT_DATE_FORMAT, locale);
};

/**
 * Formats a date according to journey-specific requirements
 *
 * @param date - The date to format
 * @param journeyId - The journey identifier (health, care, plan)
 * @param locale - The locale to use for formatting (defaults to pt-BR)
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

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    // Journey-specific formats
    switch (journeyId.toLowerCase()) {
        case 'health':
            // Health journey uses detailed format with time for metrics
            return formatDateTime(dateObj, 'dd/MM/yyyy HH:mm', locale);

        case 'care':
            // Care journey uses appointment-friendly format
            return formatDate(dateObj, 'EEE, dd MMM yyyy', locale);

        case 'plan':
            // Plan journey uses formal date format for claims and documents
            return formatDate(dateObj, 'dd/MM/yyyy', locale);

        default:
            // Default format
            return formatDate(dateObj, DEFAULT_DATE_FORMAT, locale);
    }
};

/**
 * Checks if a date is within a specified range
 *
 * @param date - The date to check
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
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

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const startDateObj =
        typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
    const endDateObj = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

    const isAfterOrEqualStart = isAfter(dateObj, startDateObj) || fnIsSameDay(dateObj, startDateObj);
    const isBeforeOrEqualEnd = isBefore(dateObj, endDateObj) || fnIsSameDay(dateObj, endDateObj);

    return isAfterOrEqualStart && isBeforeOrEqualEnd;
};
