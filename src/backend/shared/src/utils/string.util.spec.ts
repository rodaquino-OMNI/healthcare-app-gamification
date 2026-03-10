import { capitalizeFirstLetter, truncate, isValidCPF } from './string.util';

describe('String Utilities', () => {
    describe('capitalizeFirstLetter', () => {
        it('should capitalize first letter', () => {
            expect(capitalizeFirstLetter('hello')).toBe('Hello');
        });

        it('should return empty string for empty input', () => {
            expect(capitalizeFirstLetter('')).toBe('');
        });

        it('should handle single character', () => {
            expect(capitalizeFirstLetter('a')).toBe('A');
        });

        it('should handle already capitalized', () => {
            expect(capitalizeFirstLetter('Hello')).toBe('Hello');
        });

        it('should handle null-like input', () => {
            expect(capitalizeFirstLetter(null as unknown as string)).toBe('');
        });
    });

    describe('truncate', () => {
        it('should truncate long strings with ellipsis', () => {
            expect(truncate('Hello World', 5)).toBe('Hello...');
        });

        it('should not truncate short strings', () => {
            expect(truncate('Hello', 10)).toBe('Hello');
        });

        it('should handle exact length', () => {
            expect(truncate('Hello', 5)).toBe('Hello');
        });

        it('should handle null input', () => {
            expect(truncate(null as unknown as string, 5)).toBe('');
        });

        it('should handle undefined input', () => {
            expect(truncate(undefined as unknown as string, 5)).toBe('');
        });
    });

    describe('isValidCPF', () => {
        it('should validate a correct CPF', () => {
            // Known valid CPF: 529.982.247-25
            expect(isValidCPF('52998224725')).toBe(true);
        });

        it('should reject CPF with all same digits', () => {
            expect(isValidCPF('11111111111')).toBe(false);
            expect(isValidCPF('00000000000')).toBe(false);
        });

        it('should reject CPF with wrong length', () => {
            expect(isValidCPF('1234')).toBe(false);
            expect(isValidCPF('123456789012')).toBe(false);
        });

        it('should handle CPF with formatting', () => {
            expect(isValidCPF('529.982.247-25')).toBe(true);
        });

        it('should reject invalid CPF', () => {
            expect(isValidCPF('12345678901')).toBe(false);
        });
    });
});
