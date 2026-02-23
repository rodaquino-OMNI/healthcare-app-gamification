/**
 * API configuration with environment-based mock toggle.
 * When EXPO_PUBLIC_USE_MOCKS is not explicitly set to 'false',
 * the app uses mock data (safe default for development).
 */
export const API_CONFIG = {
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.austa.com.br',
} as const;

export type ApiConfig = typeof API_CONFIG;
