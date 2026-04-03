/**
 * Native shadow mapping utility.
 *
 * Converts the CSS box-shadow tokens from shadows.ts into React Native
 * shadow properties (iOS shadowX + Android elevation).
 *
 * Each entry mirrors the Figma DTCG boxShadow values exactly:
 *   sm:  0 1px 2px 0 rgba(0,0,0,0.05)
 *   md:  0 4px 6px -1px rgba(0,0,0,0.1)
 *   lg:  0 10px 15px -3px rgba(0,0,0,0.1)
 *   xl:  0 20px 25px -5px rgba(0,0,0,0.15)
 */
import { Platform, type ViewStyle } from 'react-native';

type ShadowLevel = 'sm' | 'md' | 'lg' | 'xl';

interface NativeShadow {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
}

const SHADOW_MAP: Record<ShadowLevel, NativeShadow> = {
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
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 6,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10,
    },
};

/**
 * Returns platform-appropriate shadow styles for a given elevation level.
 * On iOS: uses shadowColor/shadowOffset/shadowOpacity/shadowRadius.
 * On Android: uses elevation.
 */
export const nativeShadow = (level: ShadowLevel): ViewStyle => {
    const s = SHADOW_MAP[level];
    if (Platform.OS === 'android') {
        return { elevation: s.elevation };
    }
    return {
        shadowColor: s.shadowColor,
        shadowOffset: s.shadowOffset,
        shadowOpacity: s.shadowOpacity,
        shadowRadius: s.shadowRadius,
    };
};

/**
 * Parses a spacing/sizing token string ('16px') to a numeric value.
 * Returns the number directly if already numeric.
 */
export const parsePx = (value: string | number): number => {
    if (typeof value === 'number') {
        return value;
    }
    return parseInt(value, 10) || 0;
};
