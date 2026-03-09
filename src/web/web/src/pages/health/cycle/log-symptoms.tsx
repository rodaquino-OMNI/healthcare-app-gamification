import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SYMPTOM_CATEGORIES = [
    { id: 'cramps', label: 'Cramps' },
    { id: 'headache', label: 'Headache' },
    { id: 'bloating', label: 'Bloating' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'breast_tenderness', label: 'Breast Tenderness' },
    { id: 'acne', label: 'Acne' },
    { id: 'backache', label: 'Backache' },
    { id: 'nausea', label: 'Nausea' },
    { id: 'insomnia', label: 'Insomnia' },
    { id: 'cravings', label: 'Cravings' },
];

const MOOD_OPTIONS = [
    { id: 'happy', label: 'Happy' },
    { id: 'calm', label: 'Calm' },
    { id: 'sad', label: 'Sad' },
    { id: 'anxious', label: 'Anxious' },
    { id: 'irritable', label: 'Irritable' },
    { id: 'sensitive', label: 'Sensitive' },
];

const ENERGY_LEVELS = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
];

const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '20px',
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.gray[20]}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.gray[0],
    color: selected ? colors.journeys.health.primary : colors.gray[60],
    fontWeight: selected ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
});

const LogSymptomsPage: React.FC = () => {
    const router = useRouter();
    const todayStr = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(todayStr);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedMood, setSelectedMood] = useState('');
    const [energyLevel, setEnergyLevel] = useState('');
    const [notes, setNotes] = useState('');

    const toggleSymptom = (id: string): void => {
        setSelectedSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
    };

    const handleSave = (): void => {
        window.alert(`Symptoms logged for ${date}`);
        void router.push('/health/cycle');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Log Symptoms
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Track how you are feeling today
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                    Date
                </Text>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label="Symptom date"
                    style={{
                        width: '100%',
                        padding: spacing.xs,
                        border: `1px solid ${colors.gray[20]}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: colors.gray[60],
                    }}
                />
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Symptoms
            </Text>
            <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl }}
                role="group"
                aria-label="Symptom categories"
            >
                {SYMPTOM_CATEGORIES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => toggleSymptom(s.id)}
                        style={chipStyle(selectedSymptoms.includes(s.id))}
                        aria-pressed={selectedSymptoms.includes(s.id)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Mood
            </Text>
            <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl }}
                role="radiogroup"
                aria-label="Mood selection"
            >
                {MOOD_OPTIONS.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setSelectedMood(m.id)}
                        style={chipStyle(selectedMood === m.id)}
                        aria-checked={selectedMood === m.id}
                        role="radio"
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Energy Level
            </Text>
            <div
                style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.xl }}
                role="radiogroup"
                aria-label="Energy level"
            >
                {ENERGY_LEVELS.map((e) => (
                    <button
                        key={e.id}
                        onClick={() => setEnergyLevel(e.id)}
                        style={{ ...chipStyle(energyLevel === e.id), flex: 1, textAlign: 'center' as const }}
                        aria-checked={energyLevel === e.id}
                        role="radio"
                    >
                        {e.label}
                    </button>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Notes
            </Text>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                aria-label="Symptom notes"
                rows={3}
                style={{
                    width: '100%',
                    padding: spacing.sm,
                    border: `1px solid ${colors.gray[20]}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: colors.gray[60],
                    resize: 'vertical',
                    fontFamily: 'inherit',
                }}
            />

            <Box display="flex" style={{ flexDirection: 'column', gap: spacing.sm, marginTop: spacing['2xl'] }}>
                <Button journey="health" onPress={handleSave} accessibilityLabel="Save symptoms">
                    Save
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/health/cycle')}
                    accessibilityLabel="Cancel"
                >
                    Cancel
                </Button>
            </Box>
        </div>
    );
};

export default LogSymptomsPage;
