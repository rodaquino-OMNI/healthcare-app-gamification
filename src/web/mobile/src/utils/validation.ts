/**
 * Validation utilities for the AUSTA SuperApp mobile application.
 *
 * This module provides mobile-specific validation functions and hooks that build upon
 * the shared validation schemas. It includes support for internationalization,
 * file validation, and form validation helpers tailored for the mobile experience.
 */

import {
    claimValidationSchema as _claimValidationSchema,
    userValidationSchema as _userValidationSchema,
    isValidCPF,
    isNotEmpty,
    useClaimValidationSchema,
    useUserValidationSchema,
} from '@shared/utils/validation';
import { useTranslation } from 'react-i18next'; // latest
import { z } from 'zod'; // latest

/**
 * Maximum allowed file sizes for different file types (in bytes)
 */
export const MAX_FILE_SIZES = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    VIDEO: 50 * 1024 * 1024, // 50MB
};

/**
 * Allowed file mime types by category
 */
export const ALLOWED_FILE_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/heic', 'image/heif'],
    DOCUMENT: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    VIDEO: ['video/mp4', 'video/quicktime'],
};

/**
 * Hook that extends the shared claim validation schema with mobile-specific validations
 *
 * @returns A Zod schema for validating claim submissions on mobile
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- Zod schema inference complex
export const useMobileClaimValidationSchema = () => {
    const baseSchema = useClaimValidationSchema();

    // Extend the base schema with mobile-specific validations
    return baseSchema.extend({
        // Add optional GPS location for mobile claim submissions
        location: z
            .object({
                latitude: z.number().optional(),
                longitude: z.number().optional(),
            })
            .optional(),
    });
};

/**
 * Hook that extends the shared user validation schema with mobile-specific validations
 *
 * @returns A Zod schema for validating user data on mobile
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- Zod schema inference complex
export const useMobileUserValidationSchema = () => {
    const baseSchema = useUserValidationSchema();

    // Extend the base schema with mobile-specific validations
    return baseSchema.extend({
        deviceId: z.string().optional(),
        pushNotificationToken: z.string().optional(),
        biometricEnabled: z.boolean().optional(),
    });
};

/**
 * Validates a file based on its size and type
 *
 * @param file - The file object to validate
 * @param allowedTypes - Array of allowed mime types
 * @param maxSize - Maximum allowed file size in bytes
 * @returns An object containing validation result and error message
 */
export const validateFile = (
    file: { uri: string; type?: string; name?: string; size?: number },
    allowedTypes: string[],
    maxSize: number
): { valid: boolean; error?: string } => {
    const { t } = useTranslation();

    // Check if file type is provided and valid
    if (!file.type || !allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: t('validation.file.type', {
                allowed: allowedTypes.join(', '),
            }),
        };
    }

    // Check file size
    if (file.size && file.size > maxSize) {
        return {
            valid: false,
            error: t('validation.file.size', {
                max: (maxSize / (1024 * 1024)).toFixed(0),
            }),
        };
    }

    return { valid: true };
};

/**
 * Validates an image file for upload
 *
 * @param file - The image file to validate
 * @returns Validation result
 */
export const validateImageFile = (file: {
    uri: string;
    type?: string;
    name?: string;
    size?: number;
}): { valid: boolean; error?: string } => {
    return validateFile(file, ALLOWED_FILE_TYPES.IMAGE, MAX_FILE_SIZES.IMAGE);
};

/**
 * Validates a document file for upload
 *
 * @param file - The document file to validate
 * @returns Validation result
 */
export const validateDocumentFile = (file: {
    uri: string;
    type?: string;
    name?: string;
    size?: number;
}): { valid: boolean; error?: string } => {
    return validateFile(file, ALLOWED_FILE_TYPES.DOCUMENT, MAX_FILE_SIZES.DOCUMENT);
};

/**
 * Validates files for a claim submission
 *
 * @param files - Array of files to validate
 * @returns Object with validation results and error message if any
 */
export const validateClaimDocuments = (
    files: Array<{ uri: string; type?: string; name?: string; size?: number }>
): {
    valid: boolean;
    error?: string;
} => {
    const { t } = useTranslation();

    // Check if any files are provided
    if (!files || files.length === 0) {
        return {
            valid: false,
            error: t('validation.claim.documents.required'),
        };
    }

    // Validate each file
    for (const file of files) {
        const result = validateDocumentFile(file);
        if (!result.valid) {
            return result;
        }
    }

    return { valid: true };
};

/**
 * Formats a CPF string with the standard mask (XXX.XXX.XXX-XX)
 *
 * @param cpf - The CPF string to format
 * @returns Formatted CPF string
 */
export const formatCPF = (cpf: string): string => {
    // Remove non-numeric characters
    cpf = cpf.replace(/[^\d]/g, '');

    // Apply mask
    return cpf
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Validates and formats a phone number for Brazil
 *
 * @param phone - The phone number to validate
 * @returns True if valid, false otherwise
 */
export const validateBrazilianPhone = (phone: string): boolean => {
    // Remove non-numeric characters
    phone = phone.replace(/[^\d]/g, '');

    // Check basic format (with or without country code)
    // Brazilian phone numbers are 10 or 11 digits (with mobile ninth digit)
    if (phone.length === 10 || phone.length === 11) {
        return true;
    }

    // With country code (+55)
    if (phone.length === 12 || phone.length === 13) {
        // Check if starts with 55 (Brazil country code)
        return phone.startsWith('55');
    }

    return false;
};

/**
 * Formats a Brazilian phone number with the standard mask
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatBrazilianPhone = (phone: string): string => {
    // Remove non-numeric characters
    phone = phone.replace(/[^\d]/g, '');

    // Handle different formats based on length
    if (phone.length === 10) {
        // Landline without 9th digit: (XX) XXXX-XXXX
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 11) {
        // Mobile with 9th digit: (XX) XXXXX-XXXX
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 12) {
        // Landline with country code: +55 (XX) XXXX-XXXX
        return phone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4');
    } else if (phone.length === 13) {
        // Mobile with country code: +55 (XX) XXXXX-XXXX
        return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
    }

    // Return original if not matching expected formats
    return phone;
};

/**
 * Validates an email address
 *
 * @param email - The email address to validate
 * @returns True if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
    // Basic email validation using Zod
    const result = z.string().email().safeParse(email);
    return result.success;
};

/**
 * Validates a text field with custom validation rules
 *
 * @param value - The value to validate
 * @param rules - Validation rules to apply
 * @returns Validation result with error message if invalid
 */
export const validateTextField = (
    value: string,
    rules: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        customValidator?: (value: string) => boolean;
        errorMessage?: string;
    }
): { valid: boolean; error?: string } => {
    const { t } = useTranslation();

    // Check if value is required
    if (rules.required && (!value || value.trim() === '')) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.required'),
        };
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === '') {
        return { valid: true };
    }

    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.minLength', { length: rules.minLength }),
        };
    }

    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.maxLength', { length: rules.maxLength }),
        };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.pattern'),
        };
    }

    // Check custom validator
    if (rules.customValidator && !rules.customValidator(value)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.invalid'),
        };
    }

    return { valid: true };
};

/**
 * Validates a numeric field with custom validation rules
 *
 * @param value - The numeric value to validate
 * @param rules - Validation rules to apply
 * @returns Validation result with error message if invalid
 */
export const validateNumericField = (
    value: number | string,
    rules: {
        required?: boolean;
        min?: number;
        max?: number;
        integer?: boolean;
        positive?: boolean;
        customValidator?: (value: number) => boolean;
        errorMessage?: string;
    }
): { valid: boolean; error?: string } => {
    const { t } = useTranslation();
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if value is required
    if (rules.required && (value === undefined || value === null || value === '')) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.required'),
        };
    }

    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === '') {
        return { valid: true };
    }

    // Check if value is a valid number
    if (isNaN(numValue)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.number'),
        };
    }

    // Check minimum value
    if (rules.min !== undefined && numValue < rules.min) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.min', { min: rules.min }),
        };
    }

    // Check maximum value
    if (rules.max !== undefined && numValue > rules.max) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.max', { max: rules.max }),
        };
    }

    // Check if integer required
    if (rules.integer && !Number.isInteger(numValue)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.integer'),
        };
    }

    // Check if positive required
    if (rules.positive && numValue <= 0) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.positive'),
        };
    }

    // Check custom validator
    if (rules.customValidator && !rules.customValidator(numValue)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.invalid'),
        };
    }

    return { valid: true };
};

/**
 * Validates a date field with custom validation rules
 *
 * @param value - The date value to validate
 * @param rules - Validation rules to apply
 * @returns Validation result with error message if invalid
 */
export const validateDateField = (
    value: Date | string | null,
    rules: {
        required?: boolean;
        minDate?: Date;
        maxDate?: Date;
        noFutureDates?: boolean;
        noPastDates?: boolean;
        customValidator?: (value: Date) => boolean;
        errorMessage?: string;
    }
): { valid: boolean; error?: string } => {
    const { t } = useTranslation();

    // Check if value is required
    if (rules.required && (!value || value === '')) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.date.required'),
        };
    }

    // Skip other validations if value is empty and not required
    if (!value || value === '') {
        return { valid: true };
    }

    // Convert string to Date if necessary
    const dateValue = typeof value === 'string' ? new Date(value) : value;

    // Check if valid date
    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.date.invalid'),
        };
    }

    // Check minimum date
    if (rules.minDate && dateValue < rules.minDate) {
        return {
            valid: false,
            error:
                rules.errorMessage ||
                t('validation.date.min', {
                    date: rules.minDate.toLocaleDateString(),
                }),
        };
    }

    // Check maximum date
    if (rules.maxDate && dateValue > rules.maxDate) {
        return {
            valid: false,
            error:
                rules.errorMessage ||
                t('validation.date.max', {
                    date: rules.maxDate.toLocaleDateString(),
                }),
        };
    }

    // Check no future dates
    if (rules.noFutureDates) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (dateValue > today) {
            return {
                valid: false,
                error: rules.errorMessage || t('validation.date.noFuture'),
            };
        }
    }

    // Check no past dates
    if (rules.noPastDates) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateValue < today) {
            return {
                valid: false,
                error: rules.errorMessage || t('validation.date.noPast'),
            };
        }
    }

    // Check custom validator
    if (rules.customValidator && !rules.customValidator(dateValue)) {
        return {
            valid: false,
            error: rules.errorMessage || t('validation.date.invalid'),
        };
    }

    return { valid: true };
};

/**
 * Additional helper for mobile forms to check if a field has been modified
 *
 * @param initialValue - The initial value of the field
 * @param currentValue - The current value of the field
 * @returns True if the field has been modified, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepts any value type for comparison
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
export const isFieldModified = (initialValue: any, currentValue: any): boolean => {
    // Handle different value types
    if (typeof initialValue !== typeof currentValue) {
        return true;
    }

    // Handle dates
    if (initialValue instanceof Date && currentValue instanceof Date) {
        return initialValue.getTime() !== currentValue.getTime();
    }

    // Handle arrays
    if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
        if (initialValue.length !== currentValue.length) {
            return true;
        }

        return initialValue.some((val, index) => val !== currentValue[index]);
    }

    // Handle objects
    if (
        typeof initialValue === 'object' &&
        initialValue !== null &&
        typeof currentValue === 'object' &&
        currentValue !== null
    ) {
        const keys1 = Object.keys(initialValue);
        const keys2 = Object.keys(currentValue);

        if (keys1.length !== keys2.length) {
            return true;
        }

        return keys1.some((key) => initialValue[key] !== currentValue[key]);
    }

    // Simple comparison for primitive values
    return initialValue !== currentValue;
};

// Re-export shared validation utilities that are relevant for mobile
export { isValidCPF, isNotEmpty };

/**
 * Displays a toast notification to the user
 * @param message - The message to display
 * @param type - The type of toast ('success' | 'error' | 'warning' | 'info')
 */
export const showToast = (message: string, _type: 'success' | 'error' | 'warning' | 'info' = 'info'): void => {
    // In a real implementation, this would use a toast library like react-native-toast-message
    // TODO(AUSTA-401): integrate react-native-toast-message
};

/**
 * Base validation schema factory for common form fields
 */
export const validationSchema = {
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    cpf: z.string().refine(isValidCPF, { message: 'Invalid CPF' }),
    phone: z.string().min(10).max(15),
    required: z.string().min(1),
};

export default {
    // Re-exports from shared validation
    isValidCPF,
    isNotEmpty,

    // Mobile-specific hooks
    useMobileClaimValidationSchema,
    useMobileUserValidationSchema,

    // Mobile-specific utilities
    formatCPF,
    validateBrazilianPhone,
    formatBrazilianPhone,
    validateEmail,
    validateTextField,
    validateNumericField,
    validateDateField,
    validateFile,
    validateImageFile,
    validateDocumentFile,
    validateClaimDocuments,
    isFieldModified,

    // Constants
    MAX_FILE_SIZES,
    ALLOWED_FILE_TYPES,
};
