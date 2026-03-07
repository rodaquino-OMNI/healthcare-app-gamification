import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
    const defaultOptions = [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c', disabled: true },
    ];

    it('renders with placeholder', () => {
        render(<Dropdown options={defaultOptions} placeholder="Choose one" />);
        expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Choose one');
    });

    it('shows selected option label', () => {
        render(<Dropdown options={defaultOptions} value="a" />);
        expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Option A');
    });

    it('opens menu on click', () => {
        render(<Dropdown options={defaultOptions} />);
        fireEvent.click(screen.getByTestId('dropdown-trigger'));
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });

    it('calls onChange when option is selected', () => {
        const onChange = jest.fn();
        render(<Dropdown options={defaultOptions} onChange={onChange} />);
        fireEvent.click(screen.getByTestId('dropdown-trigger'));
        fireEvent.click(screen.getByTestId('dropdown-option-b'));
        expect(onChange).toHaveBeenCalledWith('b');
    });

    it('does not open when disabled', () => {
        render(<Dropdown options={defaultOptions} disabled />);
        fireEvent.click(screen.getByTestId('dropdown-trigger'));
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });

    it('renders search input when searchable', () => {
        render(<Dropdown options={defaultOptions} searchable />);
        fireEvent.click(screen.getByTestId('dropdown-trigger'));
        expect(screen.getByTestId('dropdown-search')).toBeInTheDocument();
    });

    it('has correct aria attributes', () => {
        render(<Dropdown options={defaultOptions} accessibilityLabel="Choose fruit" />);
        const trigger = screen.getByTestId('dropdown-trigger');
        expect(trigger).toHaveAttribute('aria-label', 'Choose fruit');
        expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });
});
