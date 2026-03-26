/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
// DEMO_MODE — Use plain RN primitives instead of @austa/design-system (web-only styled-components)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

const ErrorState: React.FC<ErrorStateProps> = ({ message, title, onRetry, retryLabel, testID }) => {
    return (
        <View style={styles.container} testID={testID || 'error-state'} accessibilityRole="alert">
            <View style={styles.inner}>
                <Text style={styles.icon}>⚠️</Text>

                {title && <Text style={styles.title}>{title}</Text>}

                {message && <Text style={styles.message}>{message}</Text>}

                {onRetry && (
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={onRetry}
                        accessibilityLabel={retryLabel || 'Retry'}
                    >
                        <Text style={styles.retryLabel}>{retryLabel || 'Retry'}</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#FFFFFF',
    },
    inner: {
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1A1A2E',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0066CC',
        marginTop: 8,
    },
    retryLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0066CC',
    },
});

export { ErrorState };
export default ErrorState;
