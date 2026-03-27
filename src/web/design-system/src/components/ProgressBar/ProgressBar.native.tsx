import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { Text } from '../../primitives/Text/Text.native';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';

export interface ProgressBarProps {
    current: number;
    total: number;
    journey?: 'health' | 'care' | 'plan';
    ariaLabel?: string;
    size?: 'sm' | 'md' | 'lg';
    testId?: string;
    animated?: boolean;
    labelPosition?: 'above' | 'below' | 'inline' | 'none';
    label?: string;
}

const calculatePercentage = (current: number, total: number): number => {
    if (total <= 0) {
        return 0;
    }
    return Math.min(Math.max((current / total) * 100, 0), 100);
};

const getTrackHeight = (size: 'sm' | 'md' | 'lg'): number => {
    switch (size) {
        case 'sm':
            return spacingValues.xs; // 8
        case 'lg':
            return spacingValues.md; // 16
        case 'md':
        default:
            return spacingValues.sm; // 12
    }
};

const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    total,
    journey,
    ariaLabel,
    size = 'md',
    testId,
    animated = true,
    labelPosition = 'none',
    label,
}) => {
    const percentage = calculatePercentage(current, total);
    const labelText = label ?? `${Math.round(percentage)}%`;
    const fillColor = journey ? colors.journeys[journey].primary : colors.brand.primary;
    const trackHeight = getTrackHeight(size);
    const accessibilityLabel = ariaLabel || `Progress: ${Math.round(percentage)}%`;

    const animatedWidth = useRef(new Animated.Value(animated ? 0 : percentage)).current;

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedWidth, {
                toValue: percentage,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            animatedWidth.setValue(percentage);
        }
    }, [percentage, animated, animatedWidth]);

    const widthStyle = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View
            testID={testId ? `${testId}-outer` : undefined}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: percentage }}
            accessibilityLabel={accessibilityLabel}
        >
            {labelPosition === 'above' && (
                <Text style={styles.labelAbove} testID={testId ? `${testId}-label` : undefined}>
                    {labelText}
                </Text>
            )}

            <View testID={testId} style={[styles.track, { height: trackHeight }]}>
                <Animated.View style={[styles.fill, { width: widthStyle, backgroundColor: fillColor }]} />
                {labelPosition === 'inline' && (
                    <Text style={styles.labelInline} testID={testId ? `${testId}-label` : undefined}>
                        {labelText}
                    </Text>
                )}
            </View>

            {labelPosition === 'below' && (
                <Text style={styles.labelBelow} testID={testId ? `${testId}-label` : undefined}>
                    {labelText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: '100%',
        backgroundColor: colors.neutral.gray200,
        borderRadius: 9999,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 9999,
    },
    labelAbove: {
        marginBottom: 4,
    },
    labelBelow: {
        marginTop: 4,
    },
    labelInline: {
        position: 'absolute',
        alignSelf: 'center',
        fontSize: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});

export { ProgressBar };
export default ProgressBar;
