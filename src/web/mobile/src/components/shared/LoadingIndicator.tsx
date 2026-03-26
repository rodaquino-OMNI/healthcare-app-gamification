import { colors } from '@design-system/tokens/colors';
import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

import { JOURNEY_COLORS } from '@constants/journeys';

export interface LoadingIndicatorProps {
    journey?: 'health' | 'care' | 'plan';
    size?: 'sm' | 'md' | 'lg' | string;
    label?: string;
    testID?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ journey, size = 'md', label, testID }) => {
    const rnSize = size === 'lg' ? 'large' : 'small';

    const journeyMapping = {
        health: 'MyHealth',
        care: 'CareNow',
        plan: 'MyPlan',
    };

    const spinnerColor = journey
        ? JOURNEY_COLORS[journeyMapping[journey] as keyof typeof JOURNEY_COLORS]
        : colors.brand.primary;

    return (
        <View style={styles.container} testID={testID}>
            <ActivityIndicator size={rnSize} color={spinnerColor} />
            {label && <Text style={[styles.label, { color: spinnerColor }]}>{label}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginTop: 8,
        fontSize: 14,
    },
});

export default LoadingIndicator;
