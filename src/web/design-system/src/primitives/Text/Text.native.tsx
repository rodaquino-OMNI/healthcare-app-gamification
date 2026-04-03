import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';

import type { TextProps } from './Text';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';

type VariantKey = 'display' | 'heading' | 'body' | 'caption';

/**
 * RN font family names per weight.
 * On iOS/Android the full PostScript name is used for custom fonts.
 * "Plus Jakarta Sans" must be installed via expo-font or linked natively.
 * Falls back to system font if not available.
 */
const FONT_FAMILY = 'PlusJakartaSans';
const fontFamilyByWeight: Record<number, string> = {
    300: `${FONT_FAMILY}-Light`,
    400: `${FONT_FAMILY}-Regular`,
    500: `${FONT_FAMILY}-Medium`,
    600: `${FONT_FAMILY}-SemiBold`,
    700: `${FONT_FAMILY}-Bold`,
    800: `${FONT_FAMILY}-ExtraBold`,
};

const variantConfig: Record<
    VariantKey,
    { fontFamily: string; fontSize: number; fontWeight: string; lineHeight: number }
> = {
    display: { fontFamily: fontFamilyByWeight[700], fontSize: 48, fontWeight: '700', lineHeight: Math.round(1.1 * 48) },
    heading: { fontFamily: fontFamilyByWeight[600], fontSize: 24, fontWeight: '600', lineHeight: Math.round(1.2 * 24) },
    body: { fontFamily: fontFamilyByWeight[400], fontSize: 16, fontWeight: '400', lineHeight: Math.round(1.5 * 16) },
    caption: { fontFamily: fontFamilyByWeight[400], fontSize: 12, fontWeight: '400', lineHeight: Math.round(1.6 * 12) },
};

const resolveFontSize = (value: string | number | undefined): number => {
    if (value === undefined) {
        return 16;
    }
    if (typeof value === 'number') {
        return value;
    }
    const token = typography.fontSize[value as keyof typeof typography.fontSize];
    if (token) {
        return parseInt(token, 10);
    }
    return parseInt(value, 10) || 16;
};

const resolveFontWeight = (value: string | number | undefined): string => {
    if (value === undefined) {
        return '400';
    }
    const strVal = String(value);
    const token = typography.fontWeight[strVal as keyof typeof typography.fontWeight];
    if (token !== undefined) {
        return String(token);
    }
    return strVal;
};

const resolveLineHeight = (value: string | number | undefined, fontSize: number): number | undefined => {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value < 10 ? Math.round(value * fontSize) : value;
    }
    const token = typography.lineHeight[value as keyof typeof typography.lineHeight];
    if (token !== undefined) {
        return Math.round(token * fontSize);
    }
    const parsed = parseFloat(value);
    if (parsed < 10) {
        return Math.round(parsed * fontSize);
    }
    return parsed || undefined;
};

const resolveFontFamily = (weight: string): string => {
    return fontFamilyByWeight[Number(weight)] ?? fontFamilyByWeight[400];
};

const getTextColor = (color?: string, journey?: 'health' | 'care' | 'plan'): string => {
    if (color) {
        return color;
    }
    if (journey && journey in colors.journeys) {
        return colors.journeys[journey].text;
    }
    return colors.neutral.gray900;
};

export const Text: React.FC<TextProps> = ({
    variant,
    fontFamily: _fontFamily,
    fontSize: fontSizeProp,
    fontWeight: fontWeightProp,
    lineHeight: lineHeightProp,
    color,
    textAlign,
    journey,
    truncate = false,
    numberOfLines,
    ellipsizeMode,
    maxFontSizeMultiplier = 1.5,
    testID,
    accessibilityLabel,
    children,
    style,
    ...rest
}) => {
    const vc = variant ? variantConfig[variant] : undefined;

    const resolvedWeight = vc ? vc.fontWeight : resolveFontWeight(fontWeightProp ?? 'regular');
    const resolvedSize = vc ? vc.fontSize : resolveFontSize(fontSizeProp ?? 'md');
    const resolvedFamily = vc ? vc.fontFamily : resolveFontFamily(resolvedWeight);
    const resolvedLineHeight = vc ? vc.lineHeight : resolveLineHeight(lineHeightProp ?? 'base', resolvedSize);

    const textStyle: TextStyle = {
        fontFamily: resolvedFamily,
        fontSize: resolvedSize,
        fontWeight: resolvedWeight as TextStyle['fontWeight'],
        ...(resolvedLineHeight ? { lineHeight: resolvedLineHeight } : {}),
        color: getTextColor(color, journey),
        ...(textAlign ? { textAlign: textAlign as TextStyle['textAlign'] } : {}),
    };

    const lines = truncate ? 1 : numberOfLines;

    return (
        <RNText
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            numberOfLines={lines}
            ellipsizeMode={lines ? (ellipsizeMode ?? 'tail') : undefined}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            style={[textStyle, style]}
            {...rest}
        >
            {children}
        </RNText>
    );
};

export default Text;
