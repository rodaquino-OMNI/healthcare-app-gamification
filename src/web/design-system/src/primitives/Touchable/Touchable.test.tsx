import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Touchable } from './Touchable';

// Mock react-native
jest.mock('react-native', () => ({
    TouchableOpacity: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <button ref={ref} {...props}>
            {children}
        </button>
    )),
    GestureResponderEvent: {},
    Platform: { OS: 'web' },
}));

// Mock styled Touchable to render a button
jest.mock('./Touchable.styles', () => ({
    StyledTouchableOpacity: React.forwardRef(
        ({ children, fullWidth, onPress, disabled, testID, ...props }: any, ref: any) => (
            <button
                ref={ref}
                data-testid={testID || 'touchable'}
                data-full-width={fullWidth ? 'true' : undefined}
                onClick={!disabled ? onPress : undefined}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        )
    ),
}));

// Mock tokens
jest.mock('../../tokens/colors', () => ({
    colors: {
        journeys: {
            health: { primary: '#0ACF83', accent: '#08A66A' },
            care: { primary: '#FF8C42', accent: '#E07030' },
            plan: { primary: '#3A86FF', accent: '#2A6ECC' },
        },
    },
}));

jest.mock('../../tokens/borderRadius', () => ({
    borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));

describe('Touchable', () => {
    it('renders children correctly', () => {
        render(
            <Touchable testID="touchable">
                <span>Press me</span>
            </Touchable>
        );
        const touchable = screen.getByTestId('touchable');
        expect(touchable).toBeInTheDocument();
        expect(touchable).toHaveTextContent('Press me');
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        render(
            <Touchable testID="touchable" onPress={onPressMock}>
                <span>Click</span>
            </Touchable>
        );
        fireEvent.click(screen.getByTestId('touchable'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
        const onPressMock = jest.fn();
        render(
            <Touchable testID="touchable" onPress={onPressMock} disabled>
                <span>Disabled</span>
            </Touchable>
        );
        fireEvent.click(screen.getByTestId('touchable'));
        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('applies disabled attribute', () => {
        render(
            <Touchable testID="touchable" disabled>
                <span>Disabled</span>
            </Touchable>
        );
        const touchable = screen.getByTestId('touchable');
        expect(touchable).toBeDisabled();
    });

    it('applies journey prop for theming', () => {
        render(
            <Touchable testID="touchable" journey="health">
                <span>Health</span>
            </Touchable>
        );
        const touchable = screen.getByTestId('touchable');
        expect(touchable).toBeInTheDocument();
    });

    it('applies accessibility props', () => {
        render(
            <Touchable
                testID="touchable"
                accessibilityLabel="Submit form"
                accessibilityHint="Submits the registration form"
            >
                <span>Submit</span>
            </Touchable>
        );
        const touchable = screen.getByTestId('touchable');
        expect(touchable).toHaveAttribute('accessibilitylabel', 'Submit form');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<any>();
        render(
            <Touchable ref={ref} testID="touchable">
                <span>Ref</span>
            </Touchable>
        );
        expect(ref.current).toBeTruthy();
    });

    it('has correct displayName', () => {
        expect(Touchable.displayName).toBe('Touchable');
    });
});
