/**
 * Central export file for all utility functions in the AUSTA SuperApp web application.
 * This barrel file provides a single, convenient import point for utilities used throughout the application.
 */

// Re-export date utility functions
export {
  formatRelativeDate,
  getAge,
  isValidDate
} from 'src/web/shared/utils/date';

// Re-export formatting utility functions
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatCompactNumber,
  formatJourneyValue,
  formatHealthMetric,
  truncateText,
  formatPhoneNumber,
  formatCPF
} from 'src/web/shared/utils/format';

// Re-export validation schemas
export {
  claimValidationSchema,
  userValidationSchema
} from 'src/web/shared/utils/validation';

// Re-export shared constants
export {
  API_BASE_URL,
  API_TIMEOUT,
  JOURNEY_IDS,
  JOURNEY_NAMES,
  JOURNEY_COLORS,
  JOURNEY_ICONS,
  ALL_JOURNEYS,
  WEB_AUTH_ROUTES,
  WEB_HEALTH_ROUTES,
  WEB_CARE_ROUTES,
  WEB_PLAN_ROUTES,
  MOBILE_AUTH_ROUTES,
  MOBILE_HEALTH_ROUTES,
  MOBILE_CARE_ROUTES,
  MOBILE_PLAN_ROUTES,
  getWebRouteWithParams
} from 'src/web/shared/constants/index';

// Re-export SEO utility function
export { generateSeoMetadata } from 'src/web/web/src/utils/seo';