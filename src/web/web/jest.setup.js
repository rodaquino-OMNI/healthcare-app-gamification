/**
 * Jest setup for AUSTA SuperApp web application (Next.js)
 * Configures mocks for Next.js routing, image/link components,
 * and browser APIs used across all three user journeys.
 */

// Extend expect with jest-dom matchers
require('@testing-library/jest-dom');

// ---------------------------------------------------------------------------
// next/router (Pages Router)
// ---------------------------------------------------------------------------
jest.mock('next/router', () => {
  const router = {
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    back: jest.fn(),
    reload: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'pt-BR',
    locales: ['pt-BR', 'en-US'],
    defaultLocale: 'pt-BR',
    basePath: '',
    route: '/',
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    beforePopState: jest.fn(),
    isFallback: false,
  };

  return {
    __esModule: true,
    default: router,
    useRouter: () => router,
    withRouter: (Component) => {
      const WithRouterComponent = (props) => {
        const React = require('react');
        return React.createElement(Component, { ...props, router });
      };
      WithRouterComponent.displayName = `withRouter(${
        Component.displayName || Component.name || 'Component'
      })`;
      return WithRouterComponent;
    },
  };
});

// ---------------------------------------------------------------------------
// next/navigation (App Router)
// ---------------------------------------------------------------------------
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// ---------------------------------------------------------------------------
// next/image
// ---------------------------------------------------------------------------
jest.mock('next/image', () => {
  const React = require('react');
  const MockImage = (props) => {
    const { src, alt, width, height, fill, priority, ...rest } = props;
    return React.createElement('img', {
      src: typeof src === 'object' ? src.src : src,
      alt: alt || '',
      width: fill ? undefined : width,
      height: fill ? undefined : height,
      'data-testid': rest['data-testid'] || 'next-image',
      ...rest,
    });
  };
  MockImage.displayName = 'NextImage';
  return {
    __esModule: true,
    default: MockImage,
  };
});

// ---------------------------------------------------------------------------
// next/link
// ---------------------------------------------------------------------------
jest.mock('next/link', () => {
  const React = require('react');
  const MockLink = ({ children, href, ...rest }) => {
    return React.createElement(
      'a',
      { href: typeof href === 'object' ? href.pathname : href, ...rest },
      children,
    );
  };
  MockLink.displayName = 'NextLink';
  return {
    __esModule: true,
    default: MockLink,
  };
});

// ---------------------------------------------------------------------------
// next/head
// ---------------------------------------------------------------------------
jest.mock('next/head', () => {
  const React = require('react');
  const MockHead = ({ children }) =>
    React.createElement(React.Fragment, null, children);
  MockHead.displayName = 'NextHead';
  return {
    __esModule: true,
    default: MockHead,
  };
});

// ---------------------------------------------------------------------------
// react-i18next
// ---------------------------------------------------------------------------
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'pt-BR',
      changeLanguage: jest.fn(() => Promise.resolve()),
      exists: jest.fn(() => true),
    },
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  I18nextProvider: ({ children }) => children,
}));

// ---------------------------------------------------------------------------
// window.matchMedia
// ---------------------------------------------------------------------------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ---------------------------------------------------------------------------
// IntersectionObserver
// ---------------------------------------------------------------------------
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.entries = [];
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// ---------------------------------------------------------------------------
// ResizeObserver
// ---------------------------------------------------------------------------
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// ---------------------------------------------------------------------------
// window.scrollTo
// ---------------------------------------------------------------------------
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// ---------------------------------------------------------------------------
// URL.createObjectURL / revokeObjectURL
// ---------------------------------------------------------------------------
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = jest.fn(() => 'blob:mock-url');
}
if (typeof URL.revokeObjectURL === 'undefined') {
  URL.revokeObjectURL = jest.fn();
}

// ---------------------------------------------------------------------------
// Silence console warnings in tests (optional, keeps output clean)
// ---------------------------------------------------------------------------
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillMount'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
