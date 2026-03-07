/**
 * Utility functions for string manipulation and validation used across all journey services.
 * This utility ensures consistent string handling throughout the application.
 */

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The input string to capitalize
 * @returns The string with the first letter capitalized
 */
export const capitalizeFirstLetter = (str: string): string => {
    if (!str || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length, adding an ellipsis if the string exceeds the length.
 *
 * @param str - The input string to truncate
 * @param length - The maximum length of the returned string (excluding the ellipsis)
 * @returns The truncated string with ellipsis if needed
 */
export const truncate = (str: string, length: number): string => {
    if (str === null || str === undefined) {
        return '';
    }

    if (str.length <= length) {
        return str;
    }

    return str.slice(0, length) + '...';
};

/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) number.
 * This function implements the standard CPF validation algorithm used in Brazil.
 *
 * @param cpf - The CPF string to validate
 * @returns True if the CPF is valid, false otherwise
 */
export const isValidCPF = (cpf: string): boolean => {
    // Remove non-digit characters
    const cleanCPF = cpf.replace(/\D/g, '');

    // CPF must have 11 digits
    if (cleanCPF.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1+$/.test(cleanCPF)) {
        return false;
    }

    // Calculate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    const digit1 = remainder > 9 ? 0 : remainder;

    // Calculate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    const digit2 = remainder > 9 ? 0 : remainder;

    // Verify if calculated digits match the CPF's verification digits
    return parseInt(cleanCPF.charAt(9)) === digit1 && parseInt(cleanCPF.charAt(10)) === digit2;
};
