import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useMedications } from '@/hooks';

type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface EffectType {
    id: string;
    label: string;
}

const COMMON_EFFECTS: EffectType[] = [
    { id: 'nausea', label: 'Nausea' },
    { id: 'headache', label: 'Headache' },
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'insomnia', label: 'Insomnia' },
    { id: 'rash', label: 'Rash' },
    { id: 'other', label: 'Other' },
];

const SEVERITY_OPTIONS: { key: SeverityLevel; label: string; color: string }[] = [
    { key: 'mild', label: 'Mild', color: colors.semantic.info },
    { key: 'moderate', label: 'Moderate', color: colors.semantic.warning },
    { key: 'severe', label: 'Severe', color: colors.semantic.error },
];

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Side effect report form page allowing users to submit a new side effect
 * with type, severity, date, and notes.
 */
const MedicationSideEffectFormPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
    const [severity, setSeverity] = useState<SeverityLevel | null>(null);
    const [date] = useState<Date>(new Date());
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<{ effect?: string; severity?: string }>({});

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const validate = (): boolean => {
        const newErrors: { effect?: string; severity?: string } = {};
        if (!selectedEffect) {
            newErrors.effect = 'Please select a side effect type';
        }
        if (!severity) {
            newErrors.severity = 'Please select a severity level';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (): void => {
        if (!validate()) {
            return;
        }
        // In production, send to API
        router.back();
    };

    const handleCancel = (): void => {
        router.back();
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Report Side Effect
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Log a side effect you have experienced.
            </Text>

            {/* Effect Type Selector */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    Side Effect Type
                </Text>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: spacing.sm,
                    }}
                >
                    {COMMON_EFFECTS.map((effect) => (
                        <button
                            key={effect.id}
                            onClick={() => {
                                setSelectedEffect(effect.id);
                                if (errors.effect) {
                                    setErrors((e) => ({ ...e, effect: undefined }));
                                }
                            }}
                            style={{
                                padding: `${spacing.sm} ${spacing.md}`,
                                borderRadius: '8px',
                                border: `1px solid ${
                                    selectedEffect === effect.id
                                        ? colors.journeys.health.primary
                                        : colors.neutral.gray300
                                }`,
                                backgroundColor:
                                    selectedEffect === effect.id
                                        ? colors.journeys.health.background
                                        : colors.neutral.white,
                                color:
                                    selectedEffect === effect.id
                                        ? colors.journeys.health.primary
                                        : colors.neutral.gray700,
                                fontWeight: selectedEffect === effect.id ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                            data-testid={`effect-${effect.id}`}
                        >
                            {effect.label}
                        </button>
                    ))}
                </div>
                {errors.effect && (
                    <Text fontSize="sm" color={colors.semantic.error} style={{ marginTop: spacing.xs }}>
                        {errors.effect}
                    </Text>
                )}
            </Card>

            {/* Severity Selector */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    Severity
                </Text>
                <div
                    style={{
                        display: 'flex',
                        gap: spacing.sm,
                    }}
                >
                    {SEVERITY_OPTIONS.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => {
                                setSeverity(option.key);
                                if (errors.severity) {
                                    setErrors((e) => ({ ...e, severity: undefined }));
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: spacing.md,
                                borderRadius: '8px',
                                border: `1px solid ${severity === option.key ? option.color : colors.neutral.gray300}`,
                                backgroundColor: severity === option.key ? option.color : colors.neutral.white,
                                color: severity === option.key ? colors.neutral.white : colors.neutral.gray700,
                                fontWeight: severity === option.key ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'center',
                            }}
                            data-testid={`severity-${option.key}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                {errors.severity && (
                    <Text fontSize="sm" color={colors.semantic.error} style={{ marginTop: spacing.xs }}>
                        {errors.severity}
                    </Text>
                )}
            </Card>

            {/* Date Display */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    Date
                </Text>
                <Text fontSize="md" color={colors.neutral.gray700} data-testid="date-display">
                    {formatDate(date)}
                </Text>
            </Card>

            {/* Notes */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    Notes
                </Text>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the side effect in more detail..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '14px',
                        color: colors.neutral.gray800,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                    }}
                    data-testid="notes-input"
                />
            </Card>

            {/* Actions */}
            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleCancel} accessibilityLabel="Cancel">
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={handleSubmit}
                    accessibilityLabel="Submit side effect report"
                >
                    Submit Report
                </Button>
            </Box>
        </div>
    );
};

export default MedicationSideEffectFormPage;
