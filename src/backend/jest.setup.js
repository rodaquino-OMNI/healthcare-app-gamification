// Root-level Jest setup for backend integration tests
// This file is referenced by jest.config.js setupFilesAfterEnv

// Increase timeout for integration tests (database, service communication)
jest.setTimeout(30000);

// Suppress noisy warnings during test runs
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  const message = args[0]?.toString() || '';

  // Filter out known noisy warnings
  if (
    message.includes('DEPRECATED') ||
    message.includes('ExperimentalWarning') ||
    message.includes('DeprecationWarning')
  ) {
    return;
  }

  originalConsoleWarn(...args);
};

console.error = (...args) => {
  const message = args[0]?.toString() || '';

  // Filter out known noisy errors (ExperimentalWarning shown as errors)
  if (
    message.includes('ExperimentalWarning') ||
    message.includes('DEPRECATED')
  ) {
    return;
  }

  originalConsoleError(...args);
};
