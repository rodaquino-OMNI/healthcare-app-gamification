import { Text, Button, Icon } from '@austa/design-system';
import React from 'react';
import { View, StyleSheet } from 'react-native';

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

const ErrorState: React.FC<ErrorStateProps> = ({ message, icon, title, onRetry, retryLabel, journey, testID }) => {
    return (
        <View style={styles.container} testID={testID || 'error-state'} accessibilityRole="alert">
            <View style={styles.inner}>
                <Icon name={icon || 'alert-circle'} size={48} />

                {title && (
                    <Text fontSize="lg" fontWeight="bold" textAlign="center">
                        {title}
                    </Text>
                )}

                {message && (
                    <Text fontSize="md" textAlign="center" color="#666666">
                        {message}
                    </Text>
                )}

                {onRetry && (
                    <Button
                        variant="outline"
                        onPress={onRetry}
                        accessibilityLabel={retryLabel || 'Retry'}
                        journey={journey}
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
