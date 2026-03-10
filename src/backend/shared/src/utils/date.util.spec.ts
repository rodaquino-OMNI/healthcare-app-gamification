import {
    formatDate,
    formatTime,
    formatDateTime,
    parseDate,
    isValidDate,
    getDateRange,
    calculateAge,
    formatDateRange,
    getDatesBetween,
    isSameDay,
    getLocalTimezone,
    formatJourneyDate,
    isDateInRange,
} from './date.util';

describe('Date Utilities', () => {
    describe('isValidDate', () => {
        it('should return true for valid Date object', () => {
            expect(isValidDate(new Date())).toBe(true);
        });

        it('should return true for valid date string', () => {
            expect(isValidDate('2024-01-01')).toBe(true);
        });

        it('should return true for valid timestamp', () => {
            expect(isValidDate(1704067200000)).toBe(true);
        });

        it('should return false for null', () => {
            expect(isValidDate(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isValidDate(undefined)).toBe(false);
        });

        it('should return false for invalid date string', () => {
            expect(isValidDate('not-a-date')).toBe(false);
        });

        it('should return false for invalid Date object', () => {
            expect(isValidDate(new Date('invalid'))).toBe(false);
        });
    });

    describe('formatDate', () => {
        it('should format date with default format', () => {
            const result = formatDate(new Date(2024, 0, 15));
            expect(result).toBe('15/01/2024');
        });

        it('should return empty string for invalid date', () => {
            expect(formatDate('invalid')).toBe('');
        });
    });

    describe('formatTime', () => {
        it('should format time from date', () => {
            const date = new Date(2024, 0, 15, 14, 30);
            const result = formatTime(date);
            expect(result).toBe('14:30');
        });

        it('should return empty for invalid date', () => {
            expect(formatTime('bad')).toBe('');
        });
    });

    describe('formatDateTime', () => {
        it('should format date and time', () => {
            const date = new Date(2024, 0, 15, 14, 30);
            const result = formatDateTime(date);
            expect(result).toBe('15/01/2024 14:30');
        });
    });

    describe('parseDate', () => {
        it('should parse a date string in default format', () => {
            const result = parseDate('15/01/2024');
            expect(result.getDate()).toBe(15);
            expect(result.getMonth()).toBe(0);
            expect(result.getFullYear()).toBe(2024);
        });

        it('should throw on invalid date string', () => {
            expect(() => parseDate('invalid')).toThrow('Invalid date string');
        });
    });

    describe('getDateRange', () => {
        const refDate = new Date(2024, 0, 15);

        it('should return today range', () => {
            const range = getDateRange('today', refDate);
            expect(range.startDate.getDate()).toBe(15);
            expect(range.endDate.getDate()).toBe(15);
        });

        it('should return yesterday range', () => {
            const range = getDateRange('yesterday', refDate);
            expect(range.startDate.getDate()).toBe(14);
        });

        it('should return thisMonth range', () => {
            const range = getDateRange('thisMonth', refDate);
            expect(range.startDate.getDate()).toBe(1);
        });

        it('should return default for unknown range', () => {
            const range = getDateRange('unknown', refDate);
            expect(range.startDate).toBeDefined();
            expect(range.endDate).toBeDefined();
        });
    });

    describe('calculateAge', () => {
        it('should calculate age correctly', () => {
            const birthdate = new Date(1990, 0, 1);
            const refDate = new Date(2024, 0, 1);
            expect(calculateAge(birthdate, refDate)).toBe(34);
        });

        it('should throw for invalid birthdate', () => {
            expect(() => calculateAge('invalid')).toThrow('Invalid birthdate');
        });
    });

    describe('formatDateRange', () => {
        it('should format a date range', () => {
            const start = new Date(2024, 0, 1);
            const end = new Date(2024, 0, 31);
            const result = formatDateRange(start, end);
            expect(result).toBe('01/01/2024 - 31/01/2024');
        });

        it('should return empty for invalid dates', () => {
            expect(formatDateRange(new Date('invalid'), new Date())).toBe('');
        });
    });

    describe('getDatesBetween', () => {
        it('should return dates between start and end', () => {
            const start = new Date(2024, 0, 1);
            const end = new Date(2024, 0, 3);
            const result = getDatesBetween(start, end);
            expect(result).toHaveLength(3);
        });

        it('should throw when start > end', () => {
            const start = new Date(2024, 0, 5);
            const end = new Date(2024, 0, 1);
            expect(() => getDatesBetween(start, end)).toThrow();
        });
    });

    describe('isSameDay', () => {
        it('should return true for same day', () => {
            expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(true);
        });

        it('should return false for different days', () => {
            expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
        });

        it('should return false for invalid dates', () => {
            expect(isSameDay('invalid', 'also-invalid')).toBe(false);
        });
    });

    describe('getLocalTimezone', () => {
        it('should return a timezone string', () => {
            const tz = getLocalTimezone();
            expect(tz).toMatch(/^[+-]\d{2}:\d{2}$/);
        });
    });

    describe('formatJourneyDate', () => {
        it('should format health journey dates with time', () => {
            const date = new Date(2024, 0, 15, 14, 30);
            const result = formatJourneyDate(date, 'health');
            expect(result).toContain('14:30');
        });

        it('should return empty for invalid date', () => {
            expect(formatJourneyDate('invalid', 'health')).toBe('');
        });
    });

    describe('isDateInRange', () => {
        it('should return true when date is in range', () => {
            const date = new Date(2024, 0, 15);
            const start = new Date(2024, 0, 1);
            const end = new Date(2024, 0, 31);
            expect(isDateInRange(date, start, end)).toBe(true);
        });

        it('should return false when date is out of range', () => {
            const date = new Date(2024, 1, 15);
            const start = new Date(2024, 0, 1);
            const end = new Date(2024, 0, 31);
            expect(isDateInRange(date, start, end)).toBe(false);
        });

        it('should return false for invalid dates', () => {
            expect(isDateInRange('bad', new Date(), new Date())).toBe(false);
        });
    });
});
