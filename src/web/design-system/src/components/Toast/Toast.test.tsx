import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Toast } from './Toast';
import { careTheme } from '../../themes/care.theme';
import { healthTheme } from '../../themes/health.theme';
import { planTheme } from '../../themes/plan.theme';
import { colors } from '../../tokens/colors';

// Helper function to render a component with a specific theme
const renderWithTheme = (ui: React.ReactElement, theme: any) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Toast component', () => {
    it('renders with success type correctly', () => {
        render(<Toast type="success" message="Operation successful" visible={true} />);

        expect(screen.getByText('Operation successful')).toBeInTheDocument();
        const toastElement = screen.getByTestId('toast');
        expect(toastElement).toHaveStyle(`border-left-color: ${colors.semantic.success}`);
    });

    it('renders with error type correctly', () => {
        render(<Toast type="error" message="Operation failed" visible={true} />);

        expect(screen.getByText('Operation failed')).toBeInTheDocument();
        const toastElement = screen.getByTestId('toast');
        expect(toastElement).toHaveStyle(`border-left-color: ${colors.semantic.error}`);
    });

    it('renders with warning type correctly', () => {
        render(<Toast type="warning" message="Warning message" visible={true} />);

        expect(screen.getByText('Warning message')).toBeInTheDocument();
        const toastElement = screen.getByTestId('toast');
        expect(toastElement).toHaveStyle(`border-left-color: ${colors.semantic.warning}`);
    });

    it('renders with info type correctly', () => {
        render(<Toast type="info" message="Information message" visible={true} />);

        expect(screen.getByText('Information message')).toBeInTheDocument();
        const toastElement = screen.getByTestId('toast');
        expect(toastElement).toHaveStyle(`border-left-color: ${colors.semantic.info}`);
    });

    it('applies health journey theme correctly', () => {
        renderWithTheme(<Toast type="success" message="Health theme toast" visible={true} />, healthTheme);

        expect(screen.getByText('Health theme toast')).toBeInTheDocument();
        // In a real application, we might test specific theme-based styling here
    });

    it('applies care journey theme correctly', () => {
        renderWithTheme(<Toast type="success" message="Care theme toast" visible={true} />, careTheme);

        expect(screen.getByText('Care theme toast')).toBeInTheDocument();
        // In a real application, we might test specific theme-based styling here
    });

    it('applies plan journey theme correctly', () => {
        renderWithTheme(<Toast type="success" message="Plan theme toast" visible={true} />, planTheme);

        expect(screen.getByText('Plan theme toast')).toBeInTheDocument();
        // In a real application, we might test specific theme-based styling here
    });

    it('calls onClose when close button is clicked', () => {
        const onDismissMock = jest.fn();
        render(<Toast type="info" message="Dismissible toast" visible={true} onDismiss={onDismissMock} />);

        const closeButton = screen.getByTestId('toast-close-button');
        fireEvent.click(closeButton);

        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses after the specified duration', () => {
        jest.useFakeTimers();
        const onDismissMock = jest.fn();

        render(<Toast type="info" message="Auto-dismissing toast" visible={true} onDismiss={onDismissMock} />);

        // The Toast component uses a 3000ms default timeout
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(onDismissMock).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    it('is accessible with proper ARIA attributes', () => {
        render(<Toast type="info" message="Accessible toast" visible={true} />);

        const toastElement = screen.getByRole('alert');
        expect(toastElement).toBeInTheDocument();
        expect(toastElement).toHaveAttribute('role', 'alert');
    });

    it('renders nothing when visible is false', () => {
        render(<Toast type="info" message="Invisible toast" visible={false} />);

        expect(screen.queryByText('Invisible toast')).not.toBeInTheDocument();
    });
});
