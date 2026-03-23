/**
 * Font configuration and loading utilities for AUSTA SuperApp.
 *
 * Provides centralized font management for both web (Next.js) and mobile (React Native/Expo).
 * Web fonts are loaded via @fontsource/plus-jakarta-sans (woff2 format).
 * Mobile fonts (TTF) are pre-bundled in src/web/mobile/src/assets/fonts/.
 *
 * Typography tokens are defined in typography.ts.
 */

/**
 * Web font configuration for Next.js.
 * Uses @fontsource/plus-jakarta-sans which provides woff2 fonts with all weights.
 *
 * To use in Next.js:
 * 1. Install: npm install --legacy-peer-deps @fontsource/plus-jakarta-sans
 * 2. Import in _app.tsx or _document.tsx:
 *    import '@fontsource/plus-jakarta-sans/400.css';
 *    import '@fontsource/plus-jakarta-sans/500.css';
 *    import '@fontsource/plus-jakarta-sans/600.css';
 *    import '@fontsource/plus-jakarta-sans/700.css';
 *    import '@fontsource/plus-jakarta-sans/800.css';
 *
 * Or with variable font support:
 *    import '@fontsource-variable/plus-jakarta-sans';
 */
export const webFontWeights = [400, 500, 600, 700, 800] as const;

export const webFontConfig = {
    family: 'Plus Jakarta Sans',
    fallback: 'sans-serif',
    weights: webFontWeights,
    formats: ['woff2'], // @fontsource provides woff2 only
} as const;

/**
 * CSS to manually load Plus Jakarta Sans if @fontsource is not available.
 * Use this as a fallback or for custom CDN setup.
 *
 * Example:
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 *   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
 */
export const googleFontsUrl =
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

/**
 * Font file references for React Native/Expo mobile apps.
 *
 * Maps PostScript font names to their TTF file locations.
 * These files are pre-bundled at: src/web/mobile/src/assets/fonts/
 *
 * Usage in App.tsx:
 *   import { useFonts } from 'expo-font';
 *
 *   const [fontsLoaded] = useFonts({
 *     'PlusJakartaSans-Regular': require('./src/assets/fonts/PlusJakartaSans-Regular.ttf'),
 *     'PlusJakartaSans-Medium': require('./src/assets/fonts/PlusJakartaSans-Medium.ttf'),
 *     'PlusJakartaSans-SemiBold': require('./src/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
 *     'PlusJakartaSans-Bold': require('./src/assets/fonts/PlusJakartaSans-Bold.ttf'),
 *     'Nunito-Bold': require('./src/assets/fonts/Nunito-Bold.ttf'),
 *   });
 */
export const mobileFontAssets = {
    'PlusJakartaSans-Regular': 'PlusJakartaSans-Regular.ttf',
    'PlusJakartaSans-Medium': 'PlusJakartaSans-Medium.ttf',
    'PlusJakartaSans-SemiBold': 'PlusJakartaSans-SemiBold.ttf',
    'PlusJakartaSans-Bold': 'PlusJakartaSans-Bold.ttf',
    'Nunito-Bold': 'Nunito-Bold.ttf',
} as const;

/**
 * Mobile font configuration.
 * Defines PostScript font names and their weight mappings for React Native.
 */
export const mobileFontConfig = {
    weights: {
        400: 'PlusJakartaSans-Regular',
        500: 'PlusJakartaSans-Medium',
        600: 'PlusJakartaSans-SemiBold',
        700: 'PlusJakartaSans-Bold',
        800: 'PlusJakartaSans-Bold', // Use Bold for ExtraBold as TTF only has up to Bold
    },
    families: {
        heading: 'PlusJakartaSans-SemiBold',
        body: 'PlusJakartaSans-Regular',
        logo: 'Nunito-Bold',
    },
} as const;

/**
 * Font loading strategy for web applications.
 *
 * Options:
 * 1. @fontsource (recommended): npm install @fontsource/plus-jakarta-sans
 *    - Self-hosted woff2 files
 *    - No external CDN required
 *    - Full control over loading
 *
 * 2. Google Fonts: Use googleFontsUrl
 *    - Reliable CDN
 *    - Preconnect optimization
 *    - No installation needed
 *
 * 3. Variable font: npm install @fontsource-variable/plus-jakarta-sans
 *    - Smaller file size
 *    - Dynamic weight support
 *    - Best for modern browsers
 */
export enum FontLoadingStrategy {
    FONTSOURCE = 'fontsource', // Recommended for projects
    GOOGLE_FONTS = 'google-fonts', // External CDN
    VARIABLE = 'variable-font', // Optimized for size
}

/**
 * Next.js _document.tsx integration example:
 *
 * ```tsx
 * import Head from 'next/head';
 * import { googleFontsUrl } from '@austa/design-system/tokens/fonts';
 *
 * class MyDocument extends Document {
 *   render() {
 *     return (
 *       <Html>
 *         <Head>
 *           <link rel="preconnect" href="https://fonts.googleapis.com" />
 *           <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 *           <link href={googleFontsUrl} rel="stylesheet" />
 *         </Head>
 *       </Html>
 *     );
 *   }
 * }
 * ```
 *
 * Or with @fontsource in _app.tsx:
 *
 * ```tsx
 * import '@fontsource/plus-jakarta-sans/400.css';
 * import '@fontsource/plus-jakarta-sans/500.css';
 * import '@fontsource/plus-jakarta-sans/600.css';
 * import '@fontsource/plus-jakarta-sans/700.css';
 * import '@fontsource/plus-jakarta-sans/800.css';
 * ```
 */
