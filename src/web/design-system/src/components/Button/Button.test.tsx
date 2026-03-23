import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Button } from './Button';

// Mock react-native components
jest.mock('react-native', () => ({
    ActivityIndicator: ({ size, color, ...props }: { size?: string; color?: string; [key: string]: unknown }) => (
        <div data-testid="activity-indicator" data-size={size} data-color={color} {...props} />
    ),
}));

// Mock the Touchable component to pass through props to a button element
jest.mock('../../primitives/Touchable/Touchable', () => ({
    Touchable: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
        <button data-testid="button" {...props}>
            {children}
        </button>
    ),
}));

// Mock the Icon component
jest.mock('../../primitives/Icon/Icon', () => ({
    Icon: ({
        name,
        size,
        color,
        ...props
    }: {
        name?: string;
        size?: string;
        color?: string;
        [key: string]: unknown;
    }) => <span data-testid="icon" data-name={name} data-size={size} data-color={color} {...props} />,
}));

// Mock the Text component
jest.mock('../../primitives/Text/Text', () => ({
    Text: ({
        children,
        fontSize,
        fontWeight,
        color,
        ...props
    }: {
        children?: React.ReactNode;
        fontSize?: string;
        fontWeight?: string;
        color?: string;
        [key: string]: unknown;
    }) => (
        <span data-testid="text" data-font-size={fontSize} data-font-weight={fontWeight} data-color={color} {...props}>
            {children}
        </span>
    ),
}));

describe('Button', () => {
    // Test rendering with default props
    it('renders correctly with default props', () => {
        render(<Button>Test Button</Button>);

        // Button should render with correct text content
        expect(screen.getByTestId('button')).toBeInTheDocument();
        expect(screen.getByTestId('text')).toHaveTextContent('Test Button');
    });

    // Test button variants
    it('renders different variants correctly', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('variant', 'primary');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('variant', 'secondary');

        rerender(<Button variant="tertiary">Tertiary</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('variant', 'tertiary');
    });

    // Test button sizes
    it('renders different sizes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('size', 'sm');

        rerender(<Button size="md">Medium</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('size', 'md');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('size', 'lg');
    });

    // Test disabled state
    it('renders disabled state correctly', () => {
        render(<Button disabled>Disabled Button</Button>);

        const button = screen.getByTestId('button');
        expect(button).toHaveAttribute('disabled', 'true');
    });

    // Test loading state
    it('renders loading state correctly', () => {
        render(<Button loading>Loading Button</Button>);

        // Button should be disabled when loading
        const button = screen.getByTestId('button');
        expect(button).toHaveAttribute('disabled', 'true');

        // ActivityIndicator should be present
        expect(screen.getByTestId('activity-indicator')).toBeInTheDocument();

        // Text content should not be visible
        expect(screen.queryByTestId('text')).not.toBeInTheDocument();
    });

    // Test journey-specific theming
    it('renders with different journey themes correctly', () => {
        const { rerender } = render(<Button journey="health">Health</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('journey', 'health');

        rerender(<Button journey="care">Care</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('journey', 'care');

        rerender(<Button journey="plan">Plan</Button>);
        expect(screen.getByTestId('button')).toHaveAttribute('journey', 'plan');
    });

    // Test icon rendering
    it('renders with icon correctly', () => {
        render(<Button icon="heart">Heart Icon</Button>);

        const icon = screen.getByTestId('icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('data-name', 'heart');
        expect(screen.getByTestId('text')).toHaveTextContent('Heart Icon');
    });

    it('renders with icon only (no text) correctly', () => {
        render(<Button icon="heart" />);

        const icon = screen.getByTestId('icon');
        expect(icon).toBeInTheDocument();
        expect(screen.queryByTestId('text')).not.toBeInTheDocument();
    });

    // Test accessibility
    it('has correct accessibility attributes', () => {
        render(<Button accessibilityLabel="Accessible Button">Button</Button>);

        const button = screen.getByTestId('button');
        expect(button).toHaveAttribute('accessibilityRole', 'button');
        expect(button).toHaveAttribute('accessibilityLabel', 'Accessible Button');
    });

    it('uses content as accessibility label when not explicitly provided', () => {
        render(<Button>Button Text</Button>);

        const button = screen.getByTestId('button');
        expect(button).toHaveAttribute('accessibilityLabel', 'Button Text');
    });

    // Test interactions
    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        render(<Button onPress={onPressMock}>Clickable Button</Button>);

        const button = screen.getByTestId('button');
        fireEvent.click(button);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
        const onPressMock = jest.fn();
        render(
            <Button onPress={onPressMock} disabled>
                Disabled Button
            </Button>
        );

        const button = screen.getByTestId('button');
        fireEvent.click(button);

        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
        const onPressMock = jest.fn();
        render(
            <Button onPress={onPressMock} loading>
                Loading Button
            </Button>
        );

        const button = screen.getByTestId('button');
        fireEvent.click(button);

        expect(onPressMock).not.toHaveBeenCalled();
    });

    // Test icon size based on button size
    it('passes correct icon size based on button size', () => {
        const { rerender } = render(
            <Button size="sm" icon="heart">
                Small
            </Button>
        );
        expect(screen.getByTestId('icon')).toHaveAttribute('data-size', '16px');

        rerender(
            <Button size="md" icon="heart">
                Medium
            </Button>
        );
        expect(screen.getByTestId('icon')).toHaveAttribute('data-size', '20px');

        rerender(
            <Button size="lg" icon="heart">
                Large
            </Button>
        );
        expect(screen.getByTestId('icon')).toHaveAttribute('data-size', '24px');
    });

    // Test font size based on button size
    it('passes correct font size based on button size', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByTestId('text')).toHaveAttribute('data-font-size', 'sm');

        rerender(<Button size="md">Medium</Button>);
        expect(screen.getByTestId('text')).toHaveAttribute('data-font-size', 'md');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByTestId('text')).toHaveAttribute('data-font-size', 'lg');
    });

    // --- Figma color system tests ---

    describe('Figma color system', () => {
        it('renders with color=brand', () => {
            render(<Button color="brand">Brand</Button>);
            const button = screen.getByTestId('button');
            expect(button).toHaveAttribute('color', 'brand');
        });

        it('renders with color=destructive', () => {
            render(<Button color="destructive">Delete</Button>);
            const button = screen.getByTestId('button');
            expect(button).toHaveAttribute('color', 'destructive');
        });

        it('renders hierarchy=secondary differently than primary', () => {
            const { rerender } = render(
                <Button color="brand" hierarchy="primary">
                    Primary
                </Button>
            );
            const primaryButton = screen.getByTestId('button');
            expect(primaryButton).toHaveAttribute('hierarchy', 'primary');

            rerender(
                <Button color="brand" hierarchy="secondary">
                    Secondary
                </Button>
            );
            const secondaryButton = screen.getByTestId('button');
            expect(secondaryButton).toHaveAttribute('hierarchy', 'secondary');
        });

        it('renders hierarchy=noFill differently', () => {
            render(
                <Button color="brand" hierarchy="noFill">
                    No Fill
                </Button>
            );
            const button = screen.getByTestId('button');
            expect(button).toHaveAttribute('hierarchy', 'noFill');
        });

        it('accepts isMobile prop', () => {
            render(<Button isMobile>Mobile Button</Button>);
            const button = screen.getByTestId('button');
            expect(button).toBeInTheDocument();
        });

        it('maintains backward compat: variant still works without color', () => {
            const { rerender } = render(<Button variant="primary">Primary</Button>);
            expect(screen.getByTestId('button')).toHaveAttribute('variant', 'primary');

            rerender(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByTestId('button')).toHaveAttribute('variant', 'secondary');

            rerender(<Button variant="tertiary">Tertiary</Button>);
            expect(screen.getByTestId('button')).toHaveAttribute('variant', 'tertiary');
        });
    });
});
