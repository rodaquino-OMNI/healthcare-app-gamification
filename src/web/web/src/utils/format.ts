/**
 * Formatting utilities for the AUSTA SuperApp web application
 *
 * This file provides utility functions for formatting data such as numbers,
 * currency, and phone numbers for the web application. These utilities support
 * internationalization requirements and ensure consistent data presentation
 * across the application.
 */

import {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatJourneyValue,
    formatHealthMetric,
    truncateText,
    formatPhoneNumber,
    formatCPF,
} from 'shared/utils/format';

/**
 * Re-export formatting functions for web application use
 *
 * These functions handle locale-specific formatting for different data types
 * including numbers, currency values, percentages, health metrics, and
 * Brazilian-specific formats like CPF and phone numbers.
 */
export {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatJourneyValue,
    formatHealthMetric,
    truncateText,
    formatPhoneNumber,
    formatCPF,
};

/**
 * Formats a date using the web app's date utilities.
 * Re-exported here for consumers that import { formatDate } from '@/utils/format'.
 */
export { formatDate } from '@/utils/date';
