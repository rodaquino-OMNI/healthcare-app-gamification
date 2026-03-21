import React from 'react';
import { View, StyleSheet } from 'react-native';

import ErrorState from './ErrorState';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error for monitoring/debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return (
                    <View testID="error-boundary-fallback" style={styles.container}>
                        {this.props.fallback}
                    </View>
                );
            }

            return (
                <View testID="error-boundary-fallback" style={styles.container}>
                    <ErrorState
                        icon="alert-circle"
                        title="Something went wrong"
                        message={this.state.error?.message}
                        onRetry={this.handleRetry}
                        retryLabel="Try Again"
                        testID="error-boundary-error-state"
                    />
                </View>
            );
        }

        return (
            <View testID="error-boundary" style={styles.wrapper}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },
});

export { ErrorBoundary };
export default ErrorBoundary;
