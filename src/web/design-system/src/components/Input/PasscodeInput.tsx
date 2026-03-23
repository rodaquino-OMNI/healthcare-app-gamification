import React, { useCallback, useRef } from 'react';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';

/**
 * Props interface for the PasscodeInput component.
 */
export interface PasscodeInputProps {
    /** Number of digit cells to render */
    digits: 4 | 6;
    /** Current passcode value */
    value: string;
    /** Callback fired when the passcode value changes */
    onChangeText: (value: string) => void;
    /** When true, displays dots instead of digits */
    secureTextEntry?: boolean;
    /** Error message — applies error styling to all cells */
    error?: string;
    /** Test ID for testing purposes */
    testID?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
}

const CELL_SIZE = 48;
const CELL_BORDER_WIDTH = 2;

/**
 * A passcode input component that renders individual digit cells.
 * Supports 4 or 6 digit modes, secure entry, and error states.
 */
export const PasscodeInput: React.FC<PasscodeInputProps> = ({
    digits,
    value,
    onChangeText,
    secureTextEntry = false,
    error,
    testID,
    disabled = false,
}) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = useCallback(() => {
        if (!disabled) {
            hiddenInputRef.current?.focus();
        }
    }, [disabled]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, digits);
            onChangeText(raw);
        },
        [digits, onChangeText]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && value.length > 0) {
                e.preventDefault();
                onChangeText(value.slice(0, -1));
            }
        },
        [value, onChangeText]
    );

    const getCellBorderColor = (index: number): string => {
        if (error) {
            return colors.semantic.error;
        }
        if (index === value.length && !disabled) {
            return colors.componentColors.brand;
        }
        return colors.gray[20];
    };

    const cellStyle = (index: number): React.CSSProperties => ({
        width: CELL_SIZE,
        height: CELL_SIZE,
        border: `${CELL_BORDER_WIDTH}px solid ${getCellBorderColor(index)}`,
        borderRadius: borderRadius.md,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 600,
        color: colors.gray[70],
        backgroundColor: disabled ? colors.gray[10] : colors.gray[0],
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 150ms ease',
    });

    const containerStyle: React.CSSProperties = {
        display: 'inline-flex',
        gap: spacing.xs,
        alignItems: 'center',
        flexDirection: 'row',
    };

    const hiddenInputStyle: React.CSSProperties = {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
        pointerEvents: 'none',
    };

    const dotStyle: React.CSSProperties = {
        width: 12,
        height: 12,
        borderRadius: borderRadius.full,
        backgroundColor: colors.gray[70],
    };

    return (
        <div data-testid={testID}>
            <div
                style={containerStyle}
                onClick={handleContainerClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleContainerClick();
                    }
                }}
                role="textbox"
                tabIndex={0}
                aria-label={`Passcode input, ${digits} digits`}
            >
                <input
                    ref={hiddenInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={digits}
                    disabled={disabled}
                    style={hiddenInputStyle}
                    aria-hidden="true"
                    tabIndex={-1}
                    data-testid={testID ? `${testID}-hidden-input` : undefined}
                />
                {Array.from({ length: digits }, (_, i) => {
                    const digit = value[i];
                    const isFilled = digit !== undefined;

                    return (
                        <div
                            key={i}
                            style={cellStyle(i)}
                            data-testid={testID ? `${testID}-cell-${i}` : undefined}
                            aria-label={`Digit ${i + 1}`}
                        >
                            {isFilled && secureTextEntry && <div style={dotStyle} />}
                            {isFilled && !secureTextEntry && digit}
                        </div>
                    );
                })}
            </div>
            {error && (
                <span
                    role="alert"
                    style={{
                        color: colors.semantic.error,
                        fontSize: '12px',
                        marginTop: spacing['3xs'],
                        display: 'block',
                    }}
                >
                    {error}
                </span>
            )}
        </div>
    );
};

export default PasscodeInput;
