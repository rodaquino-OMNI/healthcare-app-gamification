import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

const STAR_LABELS = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const LogSleepPage: React.FC = () => {
    const router = useRouter();
    const [bedtime, setBedtime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        window.alert(`Sleep logged: ${bedtime} - ${wakeTime}, Rating: ${rating}/5`);
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
                Log Sleep
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Record your sleep for last night
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" style={{ gap: spacing.md }}>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            Bedtime
                        </Text>
                        <input
                            type="time"
                            value={bedtime}
                            onChange={(e) => setBedtime(e.target.value)}
                            aria-label="Bedtime"
                            style={inputStyle}
                        />
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            Wake Time
                        </Text>
                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) => setWakeTime(e.target.value)}
                            aria-label="Wake time"
                            style={inputStyle}
                        />
                    </Box>
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Quality Rating
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {STAR_LABELS.map((label, i) => (
                        <div
                            key={label}
                            onClick={() => setRating(i + 1)}
                            role="radio"
                            aria-checked={rating === i + 1}
                            aria-label={label}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setRating(i + 1);
                            }}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <Text fontSize="2xl">{rating >= i + 1 ? '\u2605' : '\u2606'}</Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {label}
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
                Notes
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did you sleep? Any dreams?"
                    aria-label="Sleep notes"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </Card>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save sleep log">
                Save Sleep Log
            </Button>
        </div>
    );
};

export default LogSleepPage;
