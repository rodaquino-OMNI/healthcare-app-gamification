import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Slider } from './Slider';

describe('Slider', () => {
    it('renders the slider', () => {
        render(<Slider value={50} onChange={jest.fn()} />);
        expect(screen.getByTestId('slider')).toBeInTheDocument();
    });

    it('renders with correct value', () => {
        render(<Slider value={75} onChange={jest.fn()} />);
        const input = screen.getByTestId('slider-input');
        expect(input.value).toBe('75');
    });

    it('calls onChange when value changes', () => {
        const onChange = jest.fn();
        render(<Slider value={50} onChange={onChange} />);
        fireEvent.change(screen.getByTestId('slider-input'), { target: { value: '75' } });
        expect(onChange).toHaveBeenCalledWith(75);
    });

    it('shows value label when showValue is true', () => {
        render(<Slider value={42} onChange={jest.fn()} showValue />);
        expect(screen.getByTestId('slider-value')).toHaveTextContent('42');
    });

    it('does not show value label by default', () => {
        render(<Slider value={42} onChange={jest.fn()} />);
        expect(screen.queryByTestId('slider-value')).not.toBeInTheDocument();
    });

    it('has correct aria attributes', () => {
        render(<Slider value={50} min={0} max={100} onChange={jest.fn()} accessibilityLabel="Volume" />);
        const input = screen.getByTestId('slider-input');
        expect(input).toHaveAttribute('aria-label', 'Volume');
        expect(input).toHaveAttribute('aria-valuenow', '50');
        expect(input).toHaveAttribute('aria-valuemin', '0');
        expect(input).toHaveAttribute('aria-valuemax', '100');
    });

    it('respects disabled prop', () => {
        render(<Slider value={50} onChange={jest.fn()} disabled />);
        expect(screen.getByTestId('slider-input')).toBeDisabled();
    });
});
