/**
 * Safe wrappers around Next.js router hooks that return stubs during SSG
 * prerendering. This prevents "NextRouter was not mounted" and
 * "invariant expected app router to be mounted" errors in Next.js 15
 * during static generation.
 */
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter as useNextNavRouter } from 'next/navigation';
import { useRouter as useNextRouter, type NextRouter } from 'next/router';

const FALLBACK_ROUTER: NextRouter = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    isLocaleDomain: false,
    locale: undefined,
    locales: undefined,
    defaultLocale: undefined,
    isReady: false,
    isPreview: false,
    isFallback: false,
    domainLocales: undefined,
    push: () => Promise.resolve(true),
    replace: () => Promise.resolve(true),
    reload: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => Promise.resolve(),
    beforePopState: () => {},
    events: {
        on: () => {},
        off: () => {},
        emit: () => {},
    },
};

const FALLBACK_NAV_ROUTER: AppRouterInstance = {
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
};

/**
 * Safe wrapper for next/router's useRouter (Pages Router API).
 */
export function useSafeRouter(): NextRouter {
    try {
        return useNextRouter();
    } catch {
        return FALLBACK_ROUTER;
    }
}

/**
 * Safe wrapper for next/navigation's useRouter (App Router API).
 */
export function useSafeNavRouter(): AppRouterInstance {
    try {
        return useNextNavRouter();
    } catch {
        return FALLBACK_NAV_ROUTER;
    }
}
