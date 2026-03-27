import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import { Text } from '../../primitives/Text/Text.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export interface BadgeProps {
    size?: 'sm' | 'md' | 'lg';
    unlocked?: boolean;
    journey?: 'health' | 'care' | 'plan';
    children?: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
    testID?: string;
    status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    dot?: boolean;
    variant?: 'achievement' | 'status';
    type?: 'dot' | 'icon' | 'text';
}

const getBadgeSize = (size: 'sm' | 'md' | 'lg'): number => {
    switch (size) {
        case 'sm':
            return 24;
        case 'lg':
            return 40;
        case 'md':
        default:
            return 32;
    }
};

const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return '#7ab765';
        case 'warning':
            return '#f59e0b';
        case 'error':
            return '#e11d48';
        case 'info':
            return '#3b82f6';
        case 'neutral':
        default:
            return colors.neutral.gray500;
    }
};

const getStatusBgColor = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return '#f0fdf4';
        case 'warning':
            return '#fffbeb';
        case 'error':
            return '#fff1f2';
        case 'info':
            return '#eff6ff';
        case 'neutral':
        default:
            return colors.neutral.gray200;
    }
};

const getStatusIcon = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return '\u2713';
        case 'error':
            return '\u2717';
        case 'warning':
            return '\u26A0';
        case 'info':
            return '\u2139';
        case 'neutral':
        default:
            return '\u2014';
    }
};

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
    getBadgeSize(size);

    const isDot = type === 'dot' || (type === undefined && dot);

    // Status variant
    if (variant === 'status' && status) {
        const fgColor = getStatusColor(status);
        const bgColor = getStatusBgColor(status);
        const showIcon = type === 'icon';

        if (isDot) {
            return (
                <View
                    testID={testID}
                    accessibilityLabel={accessibilityLabel || `${status} status`}
                    style={[styles.dotBase, { backgroundColor: fgColor }]}
                />
            );
        }

        return (
            <View
                testID={testID}
                accessibilityLabel={accessibilityLabel || `${status} status`}
                style={[styles.statusContainer, { backgroundColor: bgColor }]}
            >
                {showIcon && (
                    <Text style={[styles.statusIcon, { color: fgColor }]} accessibilityElementsHidden>
                        {getStatusIcon(status)}
                    </Text>
                )}
                {children !== undefined && children !== null && (
                    <Text style={[styles.statusText, { color: fgColor }]}>{children}</Text>
                )}
            </View>
        );
    }

    // Achievement variant
    const backgroundColor = unlocked ? colors.journeys[journey].primary : colors.neutral.gray200;
    const textColor = unlocked ? colors.neutral.white : colors.neutral.gray700;

    const containerStyle: ViewStyle = {
        ...styles.achievementContainer,
        backgroundColor,
    };

    if (onPress) {
        return (
            <Pressable
                testID={testID}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                onPress={onPress}
                style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
            >
                <Text style={[styles.achievementText, { color: textColor }]}>{children}</Text>
            </Pressable>
        );
    }

    return (
        <View testID={testID} accessibilityLabel={accessibilityLabel} style={containerStyle}>
            <Text style={[styles.achievementText, { color: textColor }]}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    dotBase: {
        width: 16,
        height: 16,
        borderRadius: 8,
    } as ViewStyle,
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: borderRadiusValues.sm,
        paddingHorizontal: spacingValues.xs,
        paddingVertical: spacingValues['3xs'],
    } as ViewStyle,
    statusIcon: {
        fontSize: 12,
        fontWeight: '500',
        marginRight: spacingValues['3xs'],
    } as TextStyle,
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    } as TextStyle,
    achievementContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadiusValues.md,
        padding: spacingValues.sm,
        alignSelf: 'flex-start',
    } as ViewStyle,
    achievementText: {
        fontSize: 14,
    } as TextStyle,
    pressed: {
        opacity: 0.7,
    } as ViewStyle,
});
