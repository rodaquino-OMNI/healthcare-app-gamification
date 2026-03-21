import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Select } from './Select';

// Mock react-native
jest.mock('react-native', () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Mock factory returns untyped test double
    StyleSheet: { create: (styles: Record<string, unknown>) => styles },
    Platform: { OS: 'web' },
}));

// Mock DS primitives
jest.mock('../../primitives/Box/Box', () => ({
    Box: ({ children, style: _style, ...props }: any) => (
        <div data-testid="box" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('../../primitives/Text/Text', () => ({
    Text: ({ children, style: _style, ...props }: any) => (
        <span data-testid="text" {...props}>
            {children}
        </span>
    ),
}));

jest.mock('../../primitives/Touchable/Touchable', () => {
    const MockTouchable = React.forwardRef(({ children, onPress, disabled, testID, ...props }: any, ref: any) => (
        <button
            ref={ref}
            data-testid={testID || 'select-trigger'}
            onClick={!disabled ? onPress : undefined}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    ));
    MockTouchable.displayName = 'MockTouchable';
    return { Touchable: MockTouchable };
});

// Track modal visibility for assertions
let _modalVisible = false;
jest.mock('../../components/Modal/Modal', () => ({
    Modal: ({ visible, onClose, title, children }: any) => {
        _modalVisible = visible;
        if (!visible) {
            return null;
        }
        return (
            <div data-testid="modal" role="dialog">
                <span data-testid="modal-title">{title}</span>
                <button data-testid="modal-close" onClick={onClose}>
                    Close
                </button>
                {children}
            </div>
        );
    },
}));

jest.mock('../../components/Checkbox/Checkbox', () => ({
    Checkbox: ({ label, checked, onChange, testID }: any) => (
        <label data-testid={testID || 'checkbox'}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                data-testid={`${testID || 'checkbox'}-input`}
            />
            {label}
        </label>
    ),
}));

jest.mock('../../components/RadioButton/RadioButton', () => ({
    RadioButton: ({ label, checked, onChange, testID }: any) => (
        <label data-testid={testID || 'radio'}>
            <input type="radio" checked={checked} onChange={onChange} data-testid={`${testID || 'radio'}-input`} />
            {label}
        </label>
    ),
}));

jest.mock('../../components/Input/Input', () => ({
    Input: ({ value, onChange, placeholder, testID }: any) => (
        <input data-testid={testID || 'input'} value={value} onChange={onChange} placeholder={placeholder} />
    ),
}));

// Mock tokens
jest.mock('../../tokens', () => ({
    tokens: {
        colors: {
            brand: { primary: '#0066CC' },
            journeys: {
                health: { primary: '#0ACF83' },
                care: { primary: '#FF8C42' },
                plan: { primary: '#3A86FF' },
            },
        },
        spacing: { md: 16 },
    },
}));

jest.mock('../../tokens/colors', () => ({
    colors: {
        neutral: { gray300: '#D4D4D4', gray500: '#737373', gray900: '#1A1A1A', white: '#FFFFFF' },
    },
}));

jest.mock('../../tokens/spacing', () => ({
    spacing: { xs: '4px', sm: '8px', md: '16px' },
    spacingValues: { xs: 4, sm: 8, md: 16 },
}));

jest.mock('../../tokens/typography', () => ({
    typography: { fontSize: { md: '16px' } },
}));

jest.mock('../../tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', md: '8px' },
    borderRadiusValues: { xs: 4, md: 8 },
}));

const defaultOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
];

describe('Select', () => {
    beforeEach(() => {
        _modalVisible = false;
    });

    it('renders with label', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose one" />);
        const texts = screen.getAllByTestId('text');
        const labelText = texts.find((t) => t.textContent === 'Choose one');
        expect(labelText).toBeTruthy();
    });

    it('displays placeholder when no value selected', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose" />);
        const texts = screen.getAllByTestId('text');
        const placeholder = texts.find((t) => t.textContent === 'Select an option');
        expect(placeholder).toBeTruthy();
    });

    it('displays selected option label for single select', () => {
        render(<Select options={defaultOptions} value="b" onChange={jest.fn()} label="Choose" />);
        const texts = screen.getAllByTestId('text');
        const selected = texts.find((t) => t.textContent === 'Option B');
        expect(selected).toBeTruthy();
    });

    it('opens modal when trigger is clicked', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose" />);
        const trigger = screen.getByTestId('select-component');
        fireEvent.click(trigger);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('renders radio buttons for single select options in modal', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose" />);
        fireEvent.click(screen.getByTestId('select-component'));
        expect(screen.getByTestId('select-radio-a')).toBeInTheDocument();
        expect(screen.getByTestId('select-radio-b')).toBeInTheDocument();
        expect(screen.getByTestId('select-radio-c')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        const onChangeMock = jest.fn();
        render(<Select options={defaultOptions} value="" onChange={onChangeMock} label="Choose" />);
        fireEvent.click(screen.getByTestId('select-component'));
        fireEvent.change(screen.getByTestId('select-radio-b-input'));
        expect(onChangeMock).toHaveBeenCalledWith('b');
    });

    it('renders checkboxes for multi-select in modal', () => {
        render(<Select options={defaultOptions} value={[]} onChange={jest.fn()} label="Choose" multiple />);
        fireEvent.click(screen.getByTestId('select-component'));
        expect(screen.getByTestId('select-checkbox-a')).toBeInTheDocument();
        expect(screen.getByTestId('select-checkbox-b')).toBeInTheDocument();
    });

    it('shows count for multi-select with multiple values', () => {
        render(<Select options={defaultOptions} value={['a', 'b']} onChange={jest.fn()} label="Choose" multiple />);
        const texts = screen.getAllByTestId('text');
        const count = texts.find((t) => t.textContent === '2 selected');
        expect(count).toBeTruthy();
    });

    it('does not open when disabled', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose" disabled />);
        const trigger = screen.getByTestId('select-component');
        fireEvent.click(trigger);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders search input when searchable', () => {
        render(<Select options={defaultOptions} value="" onChange={jest.fn()} label="Choose" searchable />);
        fireEvent.click(screen.getByTestId('select-component'));
        expect(screen.getByTestId('select-search-input')).toBeInTheDocument();
    });

    it('has correct displayName', () => {
        expect(Select.displayName).toBe('Select');
    });
});
