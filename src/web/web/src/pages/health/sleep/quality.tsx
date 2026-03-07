import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const QUALITY_OPTIONS = [
    { emoji: '\ud83d\ude29', label: 'Terrible', value: 1 },
    { emoji: '\ud83d\ude1f', label: 'Poor', value: 2 },
    { emoji: '\ud83d\ude10', label: 'Fair', value: 3 },
    { emoji: '\ud83d\ude0a', label: 'Good', value: 4 },
    { emoji: '\ud83e\udd29', label: 'Excellent', value: 5 },
];

const FACTORS = [
    { id: 'noise', label: 'Noise' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'caffeine', label: 'Caffeine' },
    { id: 'stress', label: 'Stress' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'screen_time', label: 'Screen Time' },
];

const SleepQualityPage: React.FC = () => {
    const router = useRouter();
    const [selected, setSelected] = useState(0);
    const [factors, setFactors] = useState<string[]>([]);

    const toggleFactor = (id: string) => {
        setFactors((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
    };

    const handleSave = () => {
        const quality = QUALITY_OPTIONS.find((o) => o.value === selected);
        window.alert(`Quality: ${quality?.label || 'None'}, Factors: ${factors.join(', ') || 'None'}`);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/sleep')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Quality
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                How would you rate your sleep last night?
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {QUALITY_OPTIONS.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => setSelected(opt.value)}
                            role="radio"
                            aria-checked={selected === opt.value}
                            aria-label={opt.label}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setSelected(opt.value);
                            }}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                padding: spacing.xs,
                                borderRadius: '12px',
                                backgroundColor:
                                    selected === opt.value ? `${colors.journeys.health.primary}22` : 'transparent',
                            }}
                        >
                            <Text fontSize="2xl">{opt.emoji}</Text>
                            <Text
                                fontSize="xs"
                                color={selected === opt.value ? colors.journeys.health.primary : colors.gray[40]}
                            >
                                {opt.label}
                            </Text>
                        </div>
                    ))}
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Sleep Factors
            </Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
                Select factors that affected your sleep
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {FACTORS.map((factor) => (
                    <div
                        key={factor.id}
                        onClick={() => toggleFactor(factor.id)}
                        role="checkbox"
                        aria-checked={factors.includes(factor.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') toggleFactor(factor.id);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '4px',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        backgroundColor: factors.includes(factor.id)
                                            ? colors.journeys.health.primary
                                            : 'transparent',
                                    }}
                                >
                                    {factors.includes(factor.id) && (
                                        <Text fontSize="xs" color={colors.gray[0]} fontWeight="bold">
                                            &#10003;
                                        </Text>
                                    )}
                                </div>
                                <Text fontSize="md">{factor.label}</Text>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save sleep quality">
                Save Quality Report
            </Button>
        </div>
    );
};

export default SleepQualityPage;
