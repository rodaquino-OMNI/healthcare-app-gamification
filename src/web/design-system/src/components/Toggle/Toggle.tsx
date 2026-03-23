import React, { useCallback } from 'react';

import { Label, ToggleContainer, Thumb, Track } from './Toggle.styles';

/**
 * Props for the Toggle component.
 */
export interface ToggleProps {
    /** Current toggle value */
    value: boolean;
    /** Callback when the toggle value changes */
    onValueChange: (value: boolean) => void;
    /** Size variant of the toggle */
    size?: 'sm' | 'md' | 'lg';
    /** Whether the toggle is disabled */
    disabled?: boolean;
    /** Optional label text displayed next to the toggle */
    label?: string;
    /** Accessibility label for screen readers */
    accessibilityLabel?: string;
    /** Test identifier */
    testID?: string;
}

/**
 * Toggle component for binary on/off states.
 * Uses a CSS-based track and thumb with smooth transitions.
 *
 * @example
 * ```tsx
 * <Toggle
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   label="Enable notifications"
 *   size="md"
 * />
 * ```
 */
export const Toggle: React.FC<ToggleProps> = ({
    value,
    onValueChange,
    size = 'md',
    disabled = false,
    label,
    accessibilityLabel,
    testID,
}) => {
    const handleClick = useCallback(() => {
        if (!disabled) {
            onValueChange(!value);
        }
    }, [disabled, onValueChange, value]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onValueChange(!value);
            }
        },
        [disabled, onValueChange, value]
    );

    return (
        <ToggleContainer $isDisabled={disabled} onClick={handleClick} data-testid={testID || 'toggle'}>
            <Track
                $toggleSize={size}
                $checked={value}
                $isDisabled={disabled}
                role="switch"
                aria-checked={value}
                aria-label={accessibilityLabel || label}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
            >
                <Thumb $toggleSize={size} $checked={value} />
            </Track>
            {label && <Label>{label}</Label>}
        </ToggleContainer>
    );
};
