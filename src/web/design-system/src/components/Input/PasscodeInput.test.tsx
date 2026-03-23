import { describe, it, expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { PasscodeInput } from './PasscodeInput';
import { colors } from '../../tokens/colors';

describe('PasscodeInput', () => {
    it('renders 4 digit cells when digits=4', () => {
        render(<PasscodeInput digits={4} value="" onChangeText={() => {}} testID="pin" />);
        for (let i = 0; i < 4; i++) {
            expect(screen.getByTestId(`pin-cell-${i}`)).toBeInTheDocument();
        }
        // Should not render a 5th cell
        expect(screen.queryByTestId('pin-cell-4')).not.toBeInTheDocument();
    });

    it('renders 6 digit cells when digits=6', () => {
        render(<PasscodeInput digits={6} value="" onChangeText={() => {}} testID="otp" />);
        for (let i = 0; i < 6; i++) {
            expect(screen.getByTestId(`otp-cell-${i}`)).toBeInTheDocument();
        }
        expect(screen.queryByTestId('otp-cell-6')).not.toBeInTheDocument();
    });

    it('displays entered digits in cells', () => {
        render(<PasscodeInput digits={4} value="12" onChangeText={() => {}} testID="pin" />);
        expect(screen.getByTestId('pin-cell-0')).toHaveTextContent('1');
        expect(screen.getByTestId('pin-cell-1')).toHaveTextContent('2');
        expect(screen.getByTestId('pin-cell-2')).toHaveTextContent('');
        expect(screen.getByTestId('pin-cell-3')).toHaveTextContent('');
    });

    it('shows dots when secureTextEntry is true', () => {
        render(<PasscodeInput digits={4} value="12" onChangeText={() => {}} secureTextEntry testID="pin" />);
        // Filled cells should not show the digit text
        expect(screen.getByTestId('pin-cell-0')).not.toHaveTextContent('1');
        expect(screen.getByTestId('pin-cell-1')).not.toHaveTextContent('2');
        // Should render dot divs (circular elements) for filled cells
        const cell0 = screen.getByTestId('pin-cell-0');
        const cell1 = screen.getByTestId('pin-cell-1');
        expect(cell0.querySelector('div')).toBeInTheDocument();
        expect(cell1.querySelector('div')).toBeInTheDocument();
    });

    it('shows error message and applies error styling', () => {
        render(<PasscodeInput digits={4} value="12" onChangeText={() => {}} error="Invalid PIN" testID="pin" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid PIN');
        // Error cells should have error border color
        const cell = screen.getByTestId('pin-cell-0');
        expect(cell).toHaveStyle({
            borderColor: colors.semantic.error,
        });
    });

    it('calls onChangeText when input changes', () => {
        const handleChange = jest.fn();
        render(<PasscodeInput digits={4} value="" onChangeText={handleChange} testID="pin" />);
        const hiddenInput = screen.getByTestId('pin-hidden-input');
        fireEvent.change(hiddenInput, { target: { value: '1' } });
        expect(handleChange).toHaveBeenCalledWith('1');
    });

    it('strips non-digit characters from input', () => {
        const handleChange = jest.fn();
        render(<PasscodeInput digits={4} value="" onChangeText={handleChange} testID="pin" />);
        const hiddenInput = screen.getByTestId('pin-hidden-input');
        fireEvent.change(hiddenInput, { target: { value: '1a2b' } });
        expect(handleChange).toHaveBeenCalledWith('12');
    });

    it('truncates input to max digits', () => {
        const handleChange = jest.fn();
        render(<PasscodeInput digits={4} value="" onChangeText={handleChange} testID="pin" />);
        const hiddenInput = screen.getByTestId('pin-hidden-input');
        fireEvent.change(hiddenInput, { target: { value: '123456' } });
        expect(handleChange).toHaveBeenCalledWith('1234');
    });

    it('handles backspace to remove last digit', () => {
        const handleChange = jest.fn();
        render(<PasscodeInput digits={4} value="123" onChangeText={handleChange} testID="pin" />);
        const hiddenInput = screen.getByTestId('pin-hidden-input');
        fireEvent.keyDown(hiddenInput, { key: 'Backspace' });
        expect(handleChange).toHaveBeenCalledWith('12');
    });

    it('highlights the active (next empty) cell with brand color', () => {
        render(<PasscodeInput digits={4} value="1" onChangeText={() => {}} testID="pin" />);
        // Cell 1 (index 1) should be the active cell
        const activeCell = screen.getByTestId('pin-cell-1');
        expect(activeCell).toHaveStyle({
            borderColor: colors.componentColors.brand,
        });
    });

    it('disables input when disabled prop is true', () => {
        render(<PasscodeInput digits={4} value="" onChangeText={() => {}} disabled testID="pin" />);
        const hiddenInput = screen.getByTestId('pin-hidden-input');
        expect(hiddenInput).toBeDisabled();
    });
});
