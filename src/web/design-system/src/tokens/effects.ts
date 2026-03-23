/**
 * Effect tokens for the AUSTA SuperApp design system.
 * Provides elevation (shadow) and focus ring tokens for React Native.
 */

export const effects = {
    elevation: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 5,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.2,
            shadowRadius: 25,
            elevation: 8,
        },
    },
    focusRing: {
        width: 2,
        offset: 2,
        color: '#05AEDB',
    },
} as const;
