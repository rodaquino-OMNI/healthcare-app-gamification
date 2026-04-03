import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ProgressBarProps } from './ProgressBar';
import { colors } from '../../tokens/colors';

const spacingValues = { xs: 8, sm: 12, md: 16 };
const borderRadiusValues = { full: 9999 };

const calculatePercentage = (current: number, total: number): number => {
    if (total <= 0) {
        return 0;
    }
    return Math.min(Math.max((current / total) * 100, 0), 100);
};

const SIZE_MAP: Record<string, number> = {
    sm: spacingValues.xs,
    md: spacingValues.sm,
    lg: spacingValues.md,
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    total,
    journey = 'health',
    ariaLabel,
    showLevels = false,
    levelMarkers = [],
    size = 'md',
    testId,
    labelPosition = 'none',
    label,
}) => {
    const percentage = calculatePercentage(current, total);
    const labelText = label ?? `${Math.round(percentage)}%`;
    const barHeight = SIZE_MAP[size] ?? spacingValues.sm;
    const fillColor = colors.journeys[journey]?.primary ?? colors.brand.primary;
    const markerColor = colors.journeys[journey]?.secondary ?? colors.brand.secondary;

    return (
        <View testID={testId ? `${testId}-outer` : undefined}>
            {labelPosition === 'above' && (
                <Text style={styles.labelAbove} testID={testId ? `${testId}-label` : undefined}>
                    {labelText}
                </Text>
            )}
            <View
                style={[styles.track, { height: barHeight }]}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: percentage }}
                accessibilityLabel={ariaLabel || `Progress: ${Math.round(percentage)}%`}
                testID={testId}
            >
                <View style={[styles.fill, { width: `${percentage}%` as any, backgroundColor: fillColor }]} />
                {labelPosition === 'inline' && (
                    <Text style={styles.labelInline} testID={testId ? `${testId}-label` : undefined}>
                        {labelText}
                    </Text>
                )}
                {showLevels &&
                    levelMarkers.map((marker, index) => {
                        const pos = calculatePercentage(marker, total);
                        return (
                            <View
                                key={`marker-${index}`}
                                style={[styles.marker, { left: `${pos}%` as any, backgroundColor: markerColor }]}
                            />
                        );
                    })}
            </View>
            {labelPosition === 'below' && (
                <Text style={styles.labelBelow} testID={testId ? `${testId}-label` : undefined}>
                    {labelText}
                </Text>
            )}
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    track: {
        backgroundColor: colors.neutral.gray200,
        borderRadius: borderRadiusValues.full,
        overflow: 'hidden',
        position: 'relative',
    },
    fill: { height: '100%', borderRadius: borderRadiusValues.full },
    marker: {
        position: 'absolute',
        top: 0,
        width: 2,
        height: '100%',
    },
    labelAbove: { fontSize: 12, color: colors.neutral.gray700, marginBottom: 4 },
    labelBelow: { fontSize: 12, color: colors.neutral.gray700, marginTop: 4 },
    labelInline: {
        position: 'absolute',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.neutral.white,
        fontWeight: '600',
    },
});
