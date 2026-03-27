import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    isSameDay,
    isSameMonth,
    isAfter,
    isBefore,
} from 'date-fns';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';

import type { DatePickerProps } from './DatePicker';
import { Text } from '../../primitives/Text/Text.native';
import { Touchable } from '../../primitives/Touchable/Touchable.native';
import { borderRadiusValues } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacingValues } from '../../tokens/spacing';
import { Button } from '../Button/Button.native';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isValidDate = (d: unknown): d is Date => d instanceof Date && !isNaN(d.getTime());

const isDateDisabled = (day: Date, minDate?: Date, maxDate?: Date): boolean => {
    if (minDate && isBefore(day, minDate)) {
        return true;
    }
    if (maxDate && isAfter(day, maxDate)) {
        return true;
    }
    return false;
};

const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ---------------------------------------------------------------------------
// CalendarGrid
// ---------------------------------------------------------------------------

interface CalendarGridProps {
    currentMonth: Date;
    selected: Date | null;
    onSelectDay: (day: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    minDate?: Date;
    maxDate?: Date;
    journey: 'health' | 'care' | 'plan';
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    currentMonth,
    selected,
    onSelectDay,
    onPrevMonth,
    onNextMonth,
    minDate,
    maxDate,
    journey,
}) => {
    const primaryColor = colors.journeys[journey].primary;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startOffset = getDay(monthStart); // 0=Sun

    // Build 6×7 grid padded with nulls
    const cells: Array<Date | null> = [...Array(startOffset).fill(null), ...days];
    // Pad to full week rows
    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    return (
        <View style={styles.calendar}>
            {/* Month navigation header */}
            <View style={styles.monthHeader}>
                <Touchable
                    onPress={onPrevMonth}
                    accessibilityLabel="Mes anterior"
                    accessibilityRole="button"
                    testID="calendar-prev-month"
                >
                    <View style={styles.navBtn}>
                        <Text style={[styles.navArrow, { color: primaryColor }]}>{'‹'}</Text>
                    </View>
                </Touchable>

                <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>

                <Touchable
                    onPress={onNextMonth}
                    accessibilityLabel="Proximo mes"
                    accessibilityRole="button"
                    testID="calendar-next-month"
                >
                    <View style={styles.navBtn}>
                        <Text style={[styles.navArrow, { color: primaryColor }]}>{'›'}</Text>
                    </View>
                </Touchable>
            </View>

            {/* Day-of-week labels */}
            <View style={styles.weekRow}>
                {DAY_LABELS.map((label, i) => (
                    <View key={i} style={styles.dayLabelCell}>
                        <Text style={styles.dayLabelText}>{label}</Text>
                    </View>
                ))}
            </View>

            {/* Day cells rendered in rows of 7 */}
            {Array.from({ length: cells.length / 7 }, (_, rowIdx) => (
                <View key={rowIdx} style={styles.weekRow}>
                    {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                        if (!day) {
                            return <View key={colIdx} style={styles.dayCell} />;
                        }
                        const isSelected = selected !== null && isValidDate(selected) && isSameDay(day, selected);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const disabled = isDateDisabled(day, minDate, maxDate);

                        const cellBg = isSelected ? primaryColor : 'transparent';
                        const textCol = isSelected
                            ? colors.neutral.white
                            : !isCurrentMonth || disabled
                              ? colors.neutral.gray400
                              : colors.neutral.gray900;

                        return (
                            <Touchable
                                key={colIdx}
                                onPress={disabled ? undefined : () => onSelectDay(day)}
                                disabled={disabled}
                                accessibilityLabel={format(day, 'dd MMMM yyyy')}
                                accessibilityRole="button"
                                testID={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                            >
                                <View
                                    style={[
                                        styles.dayCell,
                                        { backgroundColor: cellBg, borderRadius: borderRadiusValues.full },
                                    ]}
                                >
                                    <Text style={[styles.dayText, { color: textCol }]}>{format(day, 'd')}</Text>
                                </View>
                            </Touchable>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export const DatePicker = forwardRef<{ open: () => void; close: () => void; clear: () => void }, DatePickerProps>(
    (props, ref) => {
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

        const [isOpen, setIsOpen] = useState(false);
        const [tempDate, setTempDate] = useState<Date | null>(value ?? null);
        const [currentMonth, setCurrentMonth] = useState<Date>(value && isValidDate(value) ? value : new Date());

        useImperativeHandle(ref, () => ({
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            clear: () => {
                setTempDate(null);
                onChange?.(null);
            },
        }));

        const handleConfirm = (): void => {
            onChange?.(tempDate);
            setIsOpen(false);
        };

        const handleCancel = (): void => {
            setTempDate(value ?? null);
            setIsOpen(false);
        };

        const handleOpen = (): void => {
            if (disabled) {
                return;
            }
            setTempDate(value ?? null);
            setCurrentMonth(value && isValidDate(value) ? value : new Date());
            setIsOpen(true);
        };

        const primaryColor = colors.journeys[journey].primary;
        const formattedDate = value && isValidDate(value) ? format(value, dateFormat) : '';
        const displayText = formattedDate || placeholder;
        const displayColor = formattedDate ? colors.neutral.gray900 : colors.neutral.gray500;
        const borderColor = error ? colors.semantic.error : primaryColor;

        return (
            <View testID={testID}>
                {/* Trigger input row */}
                {label ? <Text style={styles.label}>{label}</Text> : null}

                <Touchable
                    onPress={handleOpen}
                    disabled={disabled}
                    accessibilityLabel={accessibilityLabel ?? label ?? 'Selecionar data'}
                    accessibilityHint={placeholder}
                    accessibilityRole="button"
                    testID={`${testID ?? 'date-picker'}-trigger`}
                >
                    <View style={[styles.inputRow, { borderColor }, disabled && styles.inputDisabled]}>
                        <Text style={[styles.inputText, { color: displayColor }]} testID="date-picker-text">
                            {displayText}
                        </Text>
                        <Text style={[styles.calIcon, { color: colors.neutral.gray600 }]}>{'📅'}</Text>
                    </View>
                </Touchable>

                {error ? (
                    <Text style={styles.errorText} testID="date-picker-error">
                        {error}
                    </Text>
                ) : null}

                {/* Picker modal */}
                <RNModal visible={isOpen} transparent animationType="fade" onRequestClose={handleCancel}>
                    <Pressable style={styles.overlay} onPress={handleCancel} testID="date-picker-overlay">
                        <Pressable style={styles.sheet} onPress={() => undefined} testID="date-picker-sheet">
                            {/* Title */}
                            <Text style={[styles.sheetTitle, { color: primaryColor }]}>Selecione uma data</Text>

                            <CalendarGrid
                                currentMonth={currentMonth}
                                selected={tempDate}
                                onSelectDay={setTempDate}
                                onPrevMonth={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                                onNextMonth={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                                minDate={minDate}
                                maxDate={maxDate}
                                journey={journey}
                            />

                            {/* Action buttons */}
                            <View style={styles.actions}>
                                <View style={styles.actionBtn}>
                                    <Button
                                        variant="secondary"
                                        journey={journey}
                                        onPress={handleCancel}
                                        accessibilityLabel="Cancelar"
                                        testID="date-picker-cancel"
                                    >
                                        Cancelar
                                    </Button>
                                </View>
                                <View style={styles.actionBtn}>
                                    <Button
                                        variant="primary"
                                        journey={journey}
                                        onPress={handleConfirm}
                                        accessibilityLabel="Confirmar"
                                        testID="date-picker-confirm"
                                    >
                                        Confirmar
                                    </Button>
                                </View>
                            </View>
                        </Pressable>
                    </Pressable>
                </RNModal>
            </View>
        );
    }
);

DatePicker.displayName = 'DatePicker';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.neutral.gray700,
        marginBottom: spacingValues['3xs'],
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacingValues.sm,
        paddingHorizontal: spacingValues.md,
        borderWidth: 1,
        borderRadius: borderRadiusValues.md,
        backgroundColor: colors.neutral.white,
    },
    inputDisabled: {
        opacity: 0.5,
    },
    inputText: {
        fontSize: 16,
        flex: 1,
    },
    calIcon: {
        fontSize: 18,
        marginLeft: spacingValues.xs,
    },
    errorText: {
        fontSize: 12,
        color: colors.semantic.error,
        marginTop: spacingValues['3xs'],
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheet: {
        width: '90%',
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadiusValues['2xl'],
        padding: spacingValues.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacingValues.md,
        textAlign: 'center',
    },
    calendar: {
        marginBottom: spacingValues.md,
    },
    monthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacingValues.sm,
    },
    navBtn: {
        padding: spacingValues.xs,
    },
    navArrow: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 26,
    },
    monthLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.neutral.gray900,
        textTransform: 'capitalize',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 2,
    },
    dayLabelCell: {
        width: 36,
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    dayLabelText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.neutral.gray600,
    },
    dayCell: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '400',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacingValues.xs,
    },
    actionBtn: {
        marginLeft: spacingValues.sm,
    },
});

export type { DatePickerProps };
export default DatePicker;
