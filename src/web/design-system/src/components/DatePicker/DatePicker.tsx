import { format, type Locale } from 'date-fns';
import { pt } from 'date-fns/locale';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReactDatePicker, { registerLocale, setDefaultLocale, CalendarContainerProps } from 'react-datepicker';
import styled from 'styled-components';

import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

// Local utility replacing shared package import
const isValidDate = (date: unknown): date is Date => date instanceof Date && !isNaN(date.getTime());

// Register the Brazilian Portuguese locale for the datepicker
const ptLocale: Locale = pt as unknown as Locale;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
registerLocale('pt-BR', ptLocale);
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
(setDefaultLocale as (locale: string) => void)('pt-BR');

/**
 * Props for the DatePicker component
 */
export interface DatePickerProps {
    /**
     * The currently selected date
     */
    value?: Date | null;

    /**
     * Callback when date changes
     */
    onChange?: (date: Date | null) => void;

    /**
     * Placeholder text when no date is selected
     */
    placeholder?: string;

    /**
     * Label for the date picker
     */
    label?: string;

    /**
     * Whether the input is disabled
     */
    disabled?: boolean;

    /**
     * Format for displaying the date
     * @default "dd/MM/yyyy"
     */
    dateFormat?: string;

    /**
     * Minimum selectable date
     */
    minDate?: Date;

    /**
     * Maximum selectable date
     */
    maxDate?: Date;

    /**
     * Journey identifier for journey-specific styling
     * @default "health"
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Accessibility label
     */
    accessibilityLabel?: string;

    /**
     * Error message if the date is invalid
     */
    error?: string;

    /**
     * Test ID for testing
     */
    testID?: string;
}

// Styled container for the date input display
const DateInputContainer = styled(Box)<{ hasError?: boolean; journey?: string }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.md};
    border: 1px solid
        ${(props) =>
            props.hasError
                ? colors.semantic.error
                : props.journey
                  ? colors.journeys[props.journey as keyof typeof colors.journeys].primary
                  : colors.neutral.gray300};
    background-color: ${colors.neutral.white};

    &:focus-within {
        border-color: ${(props) =>
            props.journey
                ? colors.journeys[props.journey as keyof typeof colors.journeys].accent
                : colors.brand.primary};
        box-shadow: 0 0 0 2px
            ${(props) =>
                props.journey
                    ? `${colors.journeys[props.journey as keyof typeof colors.journeys].primary}33`
                    : `${colors.brand.primary}33`};
    }
`;

// Styled container for the calendar
const CalendarContainer = styled.div<{ journey?: string }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.md};

    .react-datepicker {
        border-radius: ${borderRadius.md};
        border: 1px solid ${colors.neutral.gray300};
        box-shadow: ${shadows.md};
        font-family: inherit;
    }

    .react-datepicker__header {
        background-color: ${colors.neutral.gray100};
        border-bottom: 1px solid ${colors.neutral.gray300};
        border-top-left-radius: ${borderRadius.md};
        border-top-right-radius: ${borderRadius.md};
    }

    .react-datepicker__current-month {
        font-weight: ${typography.fontWeight.medium};
        font-size: ${typography.fontSize.md};
    }

    .react-datepicker__day-name {
        color: ${colors.neutral.gray700};
    }

    .react-datepicker__day {
        border-radius: ${borderRadius.xs};

        &:hover {
            background-color: ${colors.neutral.gray200};
        }
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
        background-color: ${(props) =>
            props.journey
                ? colors.journeys[props.journey as keyof typeof colors.journeys].primary
                : colors.brand.primary};
        color: ${colors.neutral.white};

        &:hover {
            background-color: ${(props) =>
                props.journey
                    ? colors.journeys[props.journey as keyof typeof colors.journeys].accent
                    : colors.brand.secondary};
        }
    }
`;

// Styled button container for modal actions
const ButtonContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: ${spacing.md};
    gap: ${spacing.sm};
`;

/**
 * A reusable DatePicker component for the AUSTA SuperApp.
 * Provides a consistent interface for selecting dates across the application.
 * Integrates with the design system for theming and uses react-datepicker for date selection.
 */
export const DatePicker = forwardRef<any, DatePickerProps>((props, ref) => {
    const {
        value,
        onChange,
        placeholder = 'Selecione uma data',
        label,
        disabled = false,
        dateFormat = 'dd/MM/yyyy',
        minDate,
        maxDate,
        journey = 'health',
        accessibilityLabel,
        error,
        testID,
    } = props;

    // State for modal visibility
    const [isOpen, setIsOpen] = useState(false);

    // State for temporary date selection (before confirming)
    const [tempDate, setTempDate] = useState<Date | null>(value || null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        clear: () => {
            setTempDate(null);
            onChange?.(null);
        },
    }));

    // Handle date change from the picker
    const handleDateChange = (date: Date | null): void => {
        setTempDate(date);
    };

    // Handle confirm button in modal
    const handleConfirm = (): void => {
        onChange?.(tempDate);
        setIsOpen(false);
    };

    // Handle cancel button in modal
    const handleCancel = (): void => {
        setTempDate(value ?? null);
        setIsOpen(false);
    };

    // Custom input to display the selected date
    const CustomInput = (): React.ReactElement => {
        // Format the date according to the specified format
        const formattedDate = value && isValidDate(value) ? format(value, dateFormat) : '';

        return (
            <Touchable
                onPress={() => {
                    if (!disabled) {
                        setIsOpen(true);
                    }
                }}
                disabled={disabled}
                accessibilityLabel={accessibilityLabel || label || 'Select date'}
                accessibilityHint={placeholder}
                accessibilityRole="button"
                testID={testID || 'date-picker-input'}
                journey={journey}
            >
                <DateInputContainer hasError={!!error} journey={journey}>
                    <Text
                        color={formattedDate ? colors.neutral.gray900 : colors.neutral.gray500}
                        testID="date-picker-text"
                    >
                        {formattedDate || placeholder}
                    </Text>
                    <Box padding="xs">
                        <Text fontSize="xl" color={colors.neutral.gray600}>
                            📅
                        </Text>
                    </Box>
                </DateInputContainer>
            </Touchable>
        );
    };

    // Render calendar container with custom styling and actions
    const renderCalendarContainer = ({ className, children }: CalendarContainerProps): React.ReactElement => (
        <Box padding="md">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <CalendarContainer journey={journey} className={className}>
                {children}
            </CalendarContainer>
            <ButtonContainer>
                <Button variant="secondary" journey={journey} onPress={handleCancel} accessibilityLabel="Cancelar">
                    Cancelar
                </Button>
                <Button variant="primary" journey={journey} onPress={handleConfirm} accessibilityLabel="Confirmar">
                    Confirmar
                </Button>
            </ButtonContainer>
        </Box>
    );

    return (
        <>
            <CustomInput />

            <Modal visible={isOpen} onClose={handleCancel} title="Selecione uma data" journey={journey}>
                <ReactDatePicker
                    selected={tempDate}
                    onChange={handleDateChange}
                    calendarContainer={renderCalendarContainer}
                    locale="pt-BR"
                    inline
                    showPopperArrow={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat={dateFormat}
                    disabledKeyboardNavigation={false}
                    aria-label={accessibilityLabel || 'Calendário para seleção de data'}
                />
            </Modal>

            {error && (
                <Box marginTop="xs">
                    <Text fontSize="sm" color={colors.semantic.error}>
                        {error}
                    </Text>
                </Box>
            )}
        </>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
