/**
 * Validation utility functions for the AUSTA SuperApp
 * 
 * This file provides validation schemas and utility functions used across
 * the application to validate user input and ensure data integrity.
 * It supports both the Claims Submission process in the Plan journey
 * and the Authentication System for user registration and login.
 */

import { z } from 'zod'; // latest
import { i18n } from 'i18next'; // latest
import { useTranslation } from 'react-i18next'; // latest
import { ClaimType } from 'src/web/shared/types/index';
import { JOURNEY_NAMES } from 'src/web/shared/constants/index';

/**
 * Creates validation messages with internationalization support
 * 
 * @param t - The translation function
 * @returns An object with common validation error messages
 */
const getValidationMessages = (t: (key: string, options?: any) => string) => ({
  required: t('validation.required'),
  email: t('validation.email'),
  password: {
    min: t('validation.password.minLength', { length: 8 }),
    uppercase: t('validation.password.uppercase'),
    lowercase: t('validation.password.lowercase'),
    number: t('validation.password.number'),
    special: t('validation.password.special'),
  },
  match: t('validation.match'),
  date: {
    required: t('validation.date.required'),
    future: t('validation.date.noFuture'),
  },
  amount: {
    required: t('validation.amount.required'),
    positive: t('validation.amount.positive'),
  },
  provider: {
    required: t('validation.provider.required'),
  },
  claim: {
    type: t('validation.claim.type'),
  },
});

/**
 * Hook to create the claim validation schema with localized error messages
 * 
 * @returns A Zod schema for validating claim submission data
 */
export const useClaimValidationSchema = () => {
  const { t } = useTranslation();
  const messages = getValidationMessages(t);
  
  return z.object({
    procedureType: z.nativeEnum(ClaimType, {
      errorMap: () => ({ message: messages.claim.type })
    }),
    date: z.date({
      required_error: messages.date.required,
      invalid_type_error: messages.date.required,
    }).refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date <= today;
    }, { message: messages.date.future }),
    provider: z.string().min(1, { message: messages.provider.required }),
    amount: z.number({
      required_error: messages.amount.required,
      invalid_type_error: messages.amount.required,
    }).positive({ message: messages.amount.positive }),
  });
};

/**
 * Claim validation schema for non-React contexts
 * Uses default error messages (not internationalized)
 */
export const claimValidationSchema = z.object({
  procedureType: z.nativeEnum(ClaimType, {
    errorMap: () => ({ message: 'Please select a valid procedure type' })
  }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }, { message: 'Date cannot be in the future' }),
  provider: z.string().min(1, { message: 'Provider name is required' }),
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }).positive({ message: 'Amount must be greater than zero' }),
});

/**
 * Hook to create the user validation schema with localized error messages
 * 
 * @returns A Zod schema for validating user registration data
 */
export const useUserValidationSchema = () => {
  const { t } = useTranslation();
  const messages = getValidationMessages(t);
  
  return z.object({
    name: z.string().min(1, { message: messages.required }),
    email: z.string().min(1, { message: messages.required }).email({ message: messages.email }),
    password: z.string().min(8, { message: messages.password.min })
      .regex(/[A-Z]/, { message: messages.password.uppercase })
      .regex(/[a-z]/, { message: messages.password.lowercase })
      .regex(/[0-9]/, { message: messages.password.number })
      .regex(/[^A-Za-z0-9]/, { message: messages.password.special }),
    confirmPassword: z.string().min(1, { message: messages.required }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: messages.match,
    path: ['confirmPassword'],
  });
};

/**
 * User validation schema for non-React contexts
 * Uses default error messages (not internationalized)
 */
export const userValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Validates user credentials for login
 * 
 * @returns A Zod schema for validating login data
 */
export const useLoginValidationSchema = () => {
  const { t } = useTranslation();
  const messages = getValidationMessages(t);
  
  return z.object({
    email: z.string().min(1, { message: messages.required }).email({ message: messages.email }),
    password: z.string().min(1, { message: messages.required }),
  });
};

/**
 * Login validation schema for non-React contexts
 * Uses default error messages (not internationalized)
 */
export const loginValidationSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

/**
 * Validates if a value is not empty
 * 
 * @param value - The value to check
 * @returns True if the value is not empty, false otherwise
 */
export const isNotEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Validates a CPF (Brazilian ID) format
 * 
 * @param cpf - The CPF string to validate
 * @returns True if the CPF format is valid, false otherwise
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');

  // Must have 11 digits
  if (cpf.length !== 11) return false;

  // Check for all same digits (invalid CPF)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validate check digits
  let sum = 0;
  let remainder;
  
  // First check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  // Second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};