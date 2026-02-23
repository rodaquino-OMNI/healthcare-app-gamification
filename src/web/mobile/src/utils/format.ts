/**
 * Mobile-specific formatting utilities for the AUSTA SuperApp
 * 
 * This file provides utility functions for formatting data, such as numbers, currency,
 * and phone numbers, specifically tailored for the mobile application. It re-exports
 * formatting functions from the shared utilities to maintain consistency across platforms.
 *
 * @package i18next v23.0.0
 */

import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatJourneyValue,
  formatHealthMetric,
  truncateText,
  formatPhoneNumber,
  formatCPF as sharedFormatCPF,
  formatDate as sharedFormatDate
} from '@shared/utils/format';

/**
 * Re-export formatting functions from shared utilities.
 * This promotes code reuse and ensures consistent formatting across
 * all platforms while making the functions directly accessible
 * within the mobile application's codebase.
 *
 * Note: formatDate and formatCPF are NOT re-exported here because
 * they are already exported from utils/date.ts (via date-fns) and
 * would cause duplicate-export errors in the barrel index.
 */
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatJourneyValue,
  formatHealthMetric,
  truncateText,
  formatPhoneNumber,
};

/**
 * Note: If mobile-specific formatting adaptations are needed in the future,
 * they can be implemented here by wrapping the imported functions with
 * mobile-specific logic before exporting them.
 */