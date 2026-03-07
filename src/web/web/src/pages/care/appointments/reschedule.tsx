import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const REASONS = ['Conflito de agenda', 'Imprevisto pessoal', 'Problema de transporte', 'Outro motivo'];

const ReschedulePage: React.FC = () => {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState('');

    const canConfirm = selectedDay !== null && selectedTime !== null && selectedReason !== '';

    const handleConfirm = () => {
        router.push('/care/appointments/list');
    };

    return (
        <CareLayout>
            <JourneyHeader title="Reagendar Consulta" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Card journey="care" elevation="sm" style={{ marginBottom: spacing.xl }}>
                    <Box padding="md">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Consulta atual
                        </Text>
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            Dra. Ana Silva — Cardiologia
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.primary}>
                            03/03/2026 as 14:00 — Presencial
                        </Text>
                    </Box>
                </Card>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Selecione uma nova data
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.md }}>
                    Marco 2026
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: spacing.xs,
                        marginBottom: spacing.xl,
                    }}
                >
                    {DAYS.map((day) => {
                        const isSelected = selectedDay === day;
                        const isDisabled = day < 4 || day % 7 === 0;
                        return (
                            <button
                                key={day}
                                disabled={isDisabled}
                                onClick={() => setSelectedDay(day)}
                                aria-label={`Dia ${day}`}
                                aria-pressed={isSelected}
                                style={{
                                    padding: spacing.xs,
                                    borderRadius: '8px',
                                    border: isSelected
                                        ? `2px solid ${colors.journeys.care.primary}`
                                        : `1px solid ${colors.neutral.gray300}`,
                                    backgroundColor: isSelected
                                        ? colors.journeys.care.background
                                        : isDisabled
                                          ? colors.neutral.gray100
                                          : colors.neutral.white,
                                    color: isDisabled
                                        ? colors.neutral.gray400
                                        : isSelected
                                          ? colors.journeys.care.primary
                                          : colors.journeys.care.text,
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: isSelected ? 700 : 400,
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Horarios disponiveis
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: spacing.xs,
                        marginBottom: spacing.xl,
                    }}
                >
                    {TIME_SLOTS.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                aria-label={`Horario ${time}`}
                                aria-pressed={isSelected}
                                style={{
                                    padding: spacing.xs,
                                    borderRadius: '8px',
                                    border: isSelected
                                        ? `2px solid ${colors.journeys.care.primary}`
                                        : `1px solid ${colors.neutral.gray300}`,
                                    backgroundColor: isSelected
                                        ? colors.journeys.care.background
                                        : colors.neutral.white,
                                    color: isSelected ? colors.journeys.care.primary : colors.journeys.care.text,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: isSelected ? 700 : 400,
                                }}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Motivo do reagendamento
                </Text>
                <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    aria-label="Motivo do reagendamento"
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '16px',
                        marginBottom: spacing.xl,
                    }}
                >
                    <option value="">Selecione o motivo</option>
                    {REASONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        journey="care"
                        variant="outlined"
                        onPress={() => router.back()}
                        accessibilityLabel="Cancelar"
                    >
                        Cancelar
                    </Button>
                    <Button
                        journey="care"
                        onPress={handleConfirm}
                        disabled={!canConfirm}
                        accessibilityLabel="Confirmar reagendamento"
                    >
                        Confirmar Reagendamento
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default ReschedulePage;
