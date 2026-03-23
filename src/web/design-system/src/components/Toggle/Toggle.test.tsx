import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Toggle } from './Toggle';

describe('Toggle component', () => {
    const defaultProps = {
        value: false,
        onValueChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<Toggle {...defaultProps} />);
        const toggle = screen.getByTestId('toggle');
        expect(toggle).toBeInTheDocument();
    });

    it('toggles on click and calls onValueChange', () => {
        const onValueChange = jest.fn();
        render(<Toggle value={false} onValueChange={onValueChange} />);

        fireEvent.click(screen.getByTestId('toggle'));
        expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('calls onValueChange with false when toggling off', () => {
        const onValueChange = jest.fn();
        render(<Toggle value={true} onValueChange={onValueChange} />);

        fireEvent.click(screen.getByTestId('toggle'));
        expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('does not toggle when disabled', () => {
        const onValueChange = jest.fn();
        render(<Toggle value={false} onValueChange={onValueChange} disabled />);

        fireEvent.click(screen.getByTestId('toggle'));
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('renders with label', () => {
        render(<Toggle {...defaultProps} label="Enable feature" />);
        expect(screen.getByText('Enable feature')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
        render(<Toggle {...defaultProps} />);
        const toggle = screen.getByTestId('toggle');
        expect(toggle.querySelectorAll('span')).toHaveLength(0);
    });

    it('renders small size', () => {
        render(<Toggle {...defaultProps} size="sm" testID="toggle-sm" />);
        expect(screen.getByTestId('toggle-sm')).toBeInTheDocument();
    });

    it('renders medium size', () => {
        render(<Toggle {...defaultProps} size="md" testID="toggle-md" />);
        expect(screen.getByTestId('toggle-md')).toBeInTheDocument();
    });

    it('renders large size', () => {
        render(<Toggle {...defaultProps} size="lg" testID="toggle-lg" />);
        expect(screen.getByTestId('toggle-lg')).toBeInTheDocument();
    });

    it('has role="switch" attribute', () => {
        render(<Toggle {...defaultProps} />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toBeInTheDocument();
    });

    it('has aria-checked set to false when off', () => {
        render(<Toggle {...defaultProps} value={false} />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });

    it('has aria-checked set to true when on', () => {
        render(<Toggle {...defaultProps} value={true} />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('uses accessibilityLabel for aria-label', () => {
        render(<Toggle {...defaultProps} accessibilityLabel="Dark mode toggle" />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toHaveAttribute('aria-label', 'Dark mode toggle');
    });

    it('uses label as aria-label when accessibilityLabel is not provided', () => {
        render(<Toggle {...defaultProps} label="Notifications" />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toHaveAttribute('aria-label', 'Notifications');
    });

    it('has aria-disabled when disabled', () => {
        render(<Toggle {...defaultProps} disabled />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toHaveAttribute('aria-disabled', 'true');
    });

    it('uses custom testID', () => {
        render(<Toggle {...defaultProps} testID="my-toggle" />);
        expect(screen.getByTestId('my-toggle')).toBeInTheDocument();
    });
});
