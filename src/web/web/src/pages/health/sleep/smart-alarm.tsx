import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const WINDOW_OPTIONS = [
    { id: '10', label: '10 min' },
    { id: '20', label: '20 min' },
    { id: '30', label: '30 min' },
];

const SOUND_OPTIONS = [
    { id: 'gentle', label: 'Gentle', description: 'Soft chimes and nature sounds' },
    { id: 'moderate', label: 'Moderate', description: 'Melodic tones with gradual increase' },
    { id: 'strong', label: 'Strong', description: 'Energetic alarm for deep sleepers' },
];

const SmartAlarmPage: React.FC = () => {
    const router = useRouter();
    const [wakeWindow, setWakeWindow] = useState('20');
    const [vibration, setVibration] = useState(true);
    const [sound, setSound] = useState('gentle');

    const handleSave = () => {
        globalThis.alert(`Smart alarm: ${wakeWindow}min window, Sound: ${sound}, Vibration: ${vibration}`);
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
                Smart Alarm
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Wake up during light sleep for a refreshed morning
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Wake Window
            </Text>
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
                {WINDOW_OPTIONS.map((opt) => (
                    <div key={opt.id} style={{ flex: 1 }}>
                        <div
                            onClick={() => setWakeWindow(opt.id)}
                            role="radio"
                            aria-checked={wakeWindow === opt.id}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setWakeWindow(opt.id);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card
                                journey="health"
                                elevation="sm"
                                padding="md"
                                style={{
                                    textAlign: 'center',
                                    border:
                                        wakeWindow === opt.id
                                            ? `2px solid ${colors.journeys.health.primary}`
                                            : `2px solid transparent`,
                                }}
                            >
                                <Text
                                    fontSize="md"
                                    fontWeight={wakeWindow === opt.id ? 'bold' : 'regular'}
                                    color={wakeWindow === opt.id ? colors.journeys.health.primary : colors.gray[60]}
                                >
                                    {opt.label}
                                </Text>
                            </Card>
                        </div>
                    </div>
                ))}
            </Box>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <div
                    onClick={() => setVibration(!vibration)}
                    role="checkbox"
                    aria-checked={vibration}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setVibration(!vibration);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text fontSize="md" fontWeight="semiBold">
                                Vibration
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                Gentle vibration before alarm sound
                            </Text>
                        </Box>
                        <div
                            style={{
                                width: 44,
                                height: 24,
                                borderRadius: '12px',
                                padding: '2px',
                                backgroundColor: vibration ? colors.journeys.health.primary : colors.gray[30],
                            }}
                        >
                            <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: colors.gray[0],
                                    transform: vibration ? 'translateX(20px)' : 'translateX(0)',
                                    transition: 'transform 0.2s',
                                }}
                            />
                        </div>
                    </Box>
                </div>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Alarm Sound
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {SOUND_OPTIONS.map((opt) => (
                    <div
                        key={opt.id}
                        onClick={() => setSound(opt.id)}
                        role="radio"
                        aria-checked={sound === opt.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setSound(opt.id);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        border: `2px solid ${colors.journeys.health.primary}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {sound === opt.id && (
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: colors.journeys.health.primary,
                                            }}
                                        />
                                    )}
                                </div>
                                <Box>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {opt.label}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {opt.description}
                                    </Text>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save smart alarm settings">
                Save Alarm Settings
            </Button>
        </div>
    );
};

export default SmartAlarmPage;
