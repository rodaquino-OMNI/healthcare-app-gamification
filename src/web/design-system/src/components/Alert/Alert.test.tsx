import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Alert } from './Alert';

describe('Alert component', () => {
    it('renders with success type', () => {
        render(<Alert type="success" message="Operation successful" />);
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
        expect(screen.getByTestId('alert')).toBeInTheDocument();
    });

    it('renders with error type', () => {
        render(<Alert type="error" message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders with warning type', () => {
        render(<Alert type="warning" message="Please be careful" />);
        expect(screen.getByText('Please be careful')).toBeInTheDocument();
    });

    it('renders with info type', () => {
        render(<Alert type="info" message="Here is some information" />);
        expect(screen.getByText('Here is some information')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(<Alert type="success" title="Success" message="It worked" />);
        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('It worked')).toBeInTheDocument();
    });

    it('does not render title when not provided', () => {
        render(<Alert type="info" message="No title here" />);
        expect(screen.getByText('No title here')).toBeInTheDocument();
        // Only the message span should be in content area
        const alert = screen.getByTestId('alert');
        expect(alert).toBeInTheDocument();
    });

    it('renders dismiss button when dismissible is true', () => {
        render(<Alert type="info" message="Dismissible" dismissible onDismiss={jest.fn()} />);
        expect(screen.getByTestId('alert-dismiss-button')).toBeInTheDocument();
    });

    it('does not render dismiss button when dismissible is false', () => {
        render(<Alert type="info" message="Not dismissible" />);
        expect(screen.queryByTestId('alert-dismiss-button')).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
        const onDismiss = jest.fn();
        render(<Alert type="warning" message="Dismiss me" dismissible onDismiss={onDismiss} />);

        fireEvent.click(screen.getByTestId('alert-dismiss-button'));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('has role="alert" for accessibility', () => {
        render(<Alert type="error" message="Error message" />);
        const alertEl = screen.getByRole('alert');
        expect(alertEl).toBeInTheDocument();
        expect(alertEl).toHaveAttribute('role', 'alert');
    });

    it('renders custom icon when provided', () => {
        render(<Alert type="info" message="Custom icon" icon="!" />);
        expect(screen.getByText('!')).toBeInTheDocument();
    });

    it('uses custom testID', () => {
        render(<Alert type="info" message="Custom ID" testID="my-alert" />);
        expect(screen.getByTestId('my-alert')).toBeInTheDocument();
    });
});
