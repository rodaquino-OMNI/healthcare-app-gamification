import React, { forwardRef } from 'react';
import { Text as RNText, type TextStyle, type TextProps as RNTextProps } from 'react-native';

import type { TextProps } from './Text';
import { colors } from '../../tokens/colors';
import { typography, fontSizeValues, fontFamilyNative, fontFamilyByWeight } from '../../tokens/typography';

/** Numeric font-size lookup — strips "px" from token strings for RN. */
const fontSizeNumeric: Record<string, number> = {};
for (const [k, v] of Object.entries(typography.fontSize)) {
    fontSizeNumeric[k] = typeof v === 'number' ? v : parseInt(String(v), 10);
}
for (const [k, v] of Object.entries(fontSizeValues)) {
    fontSizeNumeric[k] = v;
}

/** Font weight token name to RN string. */
const fontWeightStr: Record<string, TextStyle['fontWeight']> = {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
};

/** Line height ratios from typography tokens. */
const lhRatio: Record<string, number> = {
    display: 1.133,
    tight: 1.1,
    heading: 1.2,
    body: 1.375,
    bodyLg: 1.333,
    bodySm: 1.429,
    base: 1.5,
    relaxed: 1.6,
};

/**
 * Variant presets — mirrors web Text.tsx variantConfig exactly.
 * display  = display-lg 48px, bold 700,     tight 1.1
 * heading  = heading-xl 24px, semiBold 600, heading 1.2
 * body     = text-md    16px, regular 400,  base 1.5
 * caption  = text-xs    12px, regular 400,  relaxed 1.6
 */
const variantConfig = {
    display: {
        fontFamily: fontFamilyNative.heading,
        fontSize: 48,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 1.1,
    },
    heading: {
        fontFamily: fontFamilyNative.heading,
        fontSize: 24,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 1.2,
    },
    body: {
        fontFamily: fontFamilyNative.body,
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 1.5,
    },
    caption: {
        fontFamily: fontFamilyNative.body,
        fontSize: 12,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 1.6,
    },
} as const;

type VariantName = keyof typeof variantConfig;

const resolveFontSize = (v: string | number | undefined): number => {
    if (v === undefined) {
        return 16;
    }
    if (typeof v === 'number') {
        return v;
    }
    return (fontSizeNumeric[v] ?? parseInt(v, 10)) || 16;
};

const resolveFontWeight = (v: string | undefined): TextStyle['fontWeight'] =>
    v === undefined ? '400' : (fontWeightStr[v] ?? (v as TextStyle['fontWeight']));

const resolveLineHeight = (v: string | undefined): number =>
    v === undefined ? 1.5 : (lhRatio[v] ?? parseFloat(v)) || 1.5;

/** Resolves native font family via weight-based PostScript name lookup. */
const resolveFontFamily = (family: string | undefined, weight: TextStyle['fontWeight']): string => {
    const w = parseInt(String(weight), 10) || 400;
    const byWeight = fontFamilyByWeight[w as keyof typeof fontFamilyByWeight];
    if (byWeight) {
        return byWeight;
    }
    if (family && family in fontFamilyNative) {
        return fontFamilyNative[family as keyof typeof fontFamilyNative];
    }
    return fontFamilyNative.body;
};

const getTextColor = (color: string | undefined, journey: TextProps['journey']): string => {
    if (color) {
        return color;
    }
    if (journey && journey in colors.journeys) {
        return colors.journeys[journey].text;
    }
    return colors.neutral.gray900;
};

/** Picks defined spacing props into a partial TextStyle. */
const pickSpacing = (p: Partial<TextProps>): Partial<TextStyle> => {
    const s: Partial<TextStyle> = {};
    if (p.margin !== undefined) {
        s.margin = p.margin as number;
    }
    if (p.marginTop !== undefined) {
        s.marginTop = p.marginTop as number;
    }
    if (p.marginBottom !== undefined) {
        s.marginBottom = p.marginBottom as number;
    }
    if (p.marginLeft !== undefined) {
        s.marginLeft = p.marginLeft as number;
    }
    if (p.marginRight !== undefined) {
        s.marginRight = p.marginRight as number;
    }
    if (p.padding !== undefined) {
        s.padding = p.padding as number;
    }
    if (p.paddingTop !== undefined) {
        s.paddingTop = p.paddingTop as number;
    }
    if (p.paddingBottom !== undefined) {
        s.paddingBottom = p.paddingBottom as number;
    }
    if (p.paddingLeft !== undefined) {
        s.paddingLeft = p.paddingLeft as number;
    }
    if (p.paddingRight !== undefined) {
        s.paddingRight = p.paddingRight as number;
    }
    return s;
};

/**
 * Text component (React Native).
 * Native implementation mirroring the web Text.tsx variant system,
 * mapping typography tokens to React Native TextStyle properties.
 */
const Text = forwardRef<RNText, TextProps & RNTextProps>((props, ref) => {
    const {
        variant,
        fontFamily: ff,
        fontSize: fs,
        fontWeight: fw,
        lineHeight: lh,
        color,
        textAlign = 'left',
        truncate = false,
        numberOfLines,
        ellipsizeMode,
        maxFontSizeMultiplier = 1.5,
        journey,
        testID,
        accessibilityLabel,
        style,
        children,
        as: _as,
        'aria-label': ariaLabel,
        'aria-hidden': _ariaHidden,
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        padding,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        ...rest
    } = props;

    const vc = variant ? variantConfig[variant as VariantName] : undefined;
    const rFS = vc ? vc.fontSize : resolveFontSize(fs);
    const rFW = vc ? vc.fontWeight : resolveFontWeight(fw);
    const rLH = vc ? vc.lineHeight : resolveLineHeight(lh);
    const rFF = vc ? vc.fontFamily : resolveFontFamily(ff, rFW);

    const computedStyle: TextStyle = {
        fontFamily: rFF,
        fontSize: rFS,
        fontWeight: rFW,
        lineHeight: Math.round(rFS * rLH),
        color: getTextColor(color, journey),
        textAlign: textAlign as TextStyle['textAlign'],
        ...pickSpacing({
            margin,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            padding,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
        }),
    };

    const lines = numberOfLines !== undefined ? numberOfLines : truncate ? 1 : undefined;

    return (
        <RNText
            ref={ref}
            style={[computedStyle, style]}
            numberOfLines={lines}
            ellipsizeMode={ellipsizeMode ?? (lines ? 'tail' : undefined)}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            testID={testID}
            accessibilityLabel={accessibilityLabel ?? ariaLabel}
            {...rest}
        >
            {children}
        </RNText>
    );
});

Text.displayName = 'Text';

export { Text };
export default Text;
