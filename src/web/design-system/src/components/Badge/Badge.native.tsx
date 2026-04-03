import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BadgeProps } from './Badge';
import { colors } from '../../tokens/colors';

const spacingValues = { '3xs': 4, xs: 8 };
const borderRadiusValues = { sm: 6, md: 8, full: 9999 };
const badgeSizeMap = { sm: 24, md: 32, lg: 40 } as const;

type StatusKey = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const statusColorMap: Record<StatusKey, { color: string; bg: string }> = {
    success: { color: colors.semantic.success, bg: colors.semantic.successBg },
    warning: { color: colors.semantic.warning, bg: colors.semantic.warningBg },
    error: { color: colors.semantic.error, bg: colors.semantic.errorBg },
    info: { color: colors.semantic.info, bg: colors.semantic.infoBg },
    neutral: { color: colors.neutral.gray500, bg: colors.neutral.gray200 },
};

const statusIconMap: Record<StatusKey, string> = {
    success: '\u2713',
    error: '\u2717',
    warning: '\u26A0',
    info: '\u2139',
    neutral: '\u2014',
};

export { getBadgeSize } from './Badge';

export const Badge: React.FC<BadgeProps> = ({
    size = 'md',
    unlocked = false,
    journey = 'health',
    children,
    onPress,
    accessibilityLabel,
    testID,
    status,
    dot = false,
    variant = 'achievement',
    type,
}) => {
    const isDot = type === 'dot' || (type === undefined && dot);

    // --- Status variant ---
    if (variant === 'status' && status) {
        const sc = statusColorMap[status];
        const showIcon = type === 'icon';
        const dotSize = 16;

        if (isDot) {
            return (
                <View
                    testID={testID}
                    accessibilityLabel={accessibilityLabel || `${status} status`}
                    style={[styles.statusDot, { width: dotSize, height: dotSize, backgroundColor: sc.color }]}
                />
            );
        }

        return (
            <View
                testID={testID}
                accessibilityLabel={accessibilityLabel || `${status} status`}
                style={[styles.statusLabel, { backgroundColor: sc.bg }]}
            >
                {showIcon && <Text style={[styles.statusIcon, { color: sc.color }]}>{statusIconMap[status]}</Text>}
                {children !== null && <Text style={[styles.statusText, { color: sc.color }]}>{children}</Text>}
            </View>
        );
    }

    // --- Achievement variant ---
    const dim = badgeSizeMap[size];
    const bg = unlocked ? colors.journeys[journey].primary : colors.neutral.gray200;
    const textColor = unlocked ? colors.neutral.white : colors.neutral.gray700;

    const content = (
        <>
            {children !== null && (
                <Text style={{ color: textColor, fontWeight: '500', fontSize: size === 'sm' ? 10 : 12 }}>
                    {children}
                </Text>
            )}
        </>
    );

    const containerStyle = [
        styles.achievement,
        { width: dim, height: dim, backgroundColor: bg, borderRadius: borderRadiusValues.md },
    ];

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                testID={testID}
                style={containerStyle}
            >
                {content}
            </Pressable>
        );
    }

    return (
        <View accessibilityLabel={accessibilityLabel} testID={testID} style={containerStyle}>
            {content}
        </View>
    );
};

const styles = StyleSheet.create({
    achievement: { alignItems: 'center', justifyContent: 'center' },
    statusDot: { borderRadius: borderRadiusValues.full },
    statusLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadiusValues.sm,
        paddingVertical: spacingValues['3xs'],
        paddingHorizontal: spacingValues.xs,
        minWidth: 16,
    },
    statusIcon: { fontSize: 12, marginRight: spacingValues['3xs'] },
    statusText: { fontSize: 12, fontWeight: '500' },
});
