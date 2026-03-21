/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Text, Button, Icon } from '@austa/design-system';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useJourney } from '../../hooks/useJourney';
import { useTheme } from '../../hooks/useTheme';

interface ErrorStateProps {
    /** Error message to display */
    message?: string;
    /** Icon name to display */
    icon?: string;
    /** Main title */
    title?: string;
    /** Optional retry handler */
    onRetry?: () => void;
    /** Optional retry button label */
    retryLabel?: string;
    /** Journey context for theming */
    journey?: string;
    /** Test ID for component testing */
    testID?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message,
    icon = 'alert-circle',
    title,
    onRetry,
    retryLabel,
    journey,
    testID,
}) => {
    const { journey: contextJourney } = useJourney();
    const currentJourney = journey || contextJourney;
    const { theme } = useTheme();

    const getJourneyColor = () => {
        if (currentJourney === 'health') {
            return theme.colors.journey.health;
        }
        if (currentJourney === 'care') {
            return theme.colors.journey.care;
        }
        if (currentJourney === 'plan') {
            return theme.colors.journey.plan;
        }
        return theme.colors.brand.primary;
    };

    return (
        <View
            style={[styles.container, { backgroundColor: theme.colors.background.default }]}
            testID={testID || 'error-state'}
            accessibilityRole="alert"
        >
            <View style={styles.inner}>
                <Icon name={icon} size={48} color={getJourneyColor()} aria-hidden />

                {title && (
                    <Text fontSize="lg" fontWeight="bold" textAlign="center" color={theme.colors.text.primary}>
                        {title}
                    </Text>
                )}

                {message && (
                    <Text fontSize="md" textAlign="center" color={theme.colors.text.secondary}>
                        {message}
                    </Text>
                )}

                {onRetry && (
                    <Button
                        variant="outline"
                        journey={currentJourney as any}
                        onPress={onRetry}
                        accessibilityLabel={retryLabel || 'Retry'}
                    >
                        {retryLabel || 'Retry'}
                    </Button>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    inner: {
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
});

export { ErrorState };
export default ErrorState;
