import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type Phase = 'idle' | 'breatheIn' | 'hold' | 'breatheOut';

const PHASE_CONFIG: Record<Exclude<Phase, 'idle'>, { label: string; duration: number }> = {
    breatheIn: { label: 'Breathe In', duration: 4 },
    hold: { label: 'Hold', duration: 7 },
    breatheOut: { label: 'Breathe Out', duration: 8 },
};

const PHASE_ORDER: Exclude<Phase, 'idle'>[] = ['breatheIn', 'hold', 'breatheOut'];
const DURATION_OPTIONS = [3, 5, 10];

const BreathingPage: React.FC = () => {
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState<Phase>('idle');
    const [countdown, setCountdown] = useState(0);
    const [selectedDuration, setSelectedDuration] = useState(5);
    const [sessionsCompleted, setSessionsCompleted] = useState(3);
    const [elapsed, setElapsed] = useState(0);
    const phaseIndex = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isRunning) return;
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    phaseIndex.current = (phaseIndex.current + 1) % PHASE_ORDER.length;
                    const nextPhase = PHASE_ORDER[phaseIndex.current];
                    setPhase(nextPhase);
                    return PHASE_CONFIG[nextPhase].duration;
                }
                return prev - 1;
            });
            setElapsed((prev) => {
                const next = prev + 1;
                if (next >= selectedDuration * 60) {
                    setIsRunning(false);
                    setPhase('idle');
                    setSessionsCompleted((s) => s + 1);
                    return 0;
                }
                return next;
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, selectedDuration]);

    const handleStartPause = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            if (phase === 'idle') {
                phaseIndex.current = 0;
                setPhase('breatheIn');
                setCountdown(PHASE_CONFIG.breatheIn.duration);
                setElapsed(0);
            }
            setIsRunning(true);
        }
    };

    const circleSize = phase === 'breatheIn' ? 200 : phase === 'hold' ? 200 : 140;
    const phaseLabel = phase === 'idle' ? 'Ready' : PHASE_CONFIG[phase].label;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/wellness')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Breathing Exercise
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                4-7-8 breathing technique for relaxation
            </Text>

            <Box display="flex" justifyContent="center" alignItems="center" style={{ marginBottom: spacing.xl }}>
                <div
                    style={{
                        width: circleSize,
                        height: circleSize,
                        borderRadius: '50%',
                        backgroundColor: `${colors.journeys.health.primary}22`,
                        border: `3px solid ${colors.journeys.health.primary}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'width 0.8s ease, height 0.8s ease',
                    }}
                    role="status"
                    aria-label={`${phaseLabel} ${phase !== 'idle' ? countdown : ''}`}
                >
                    <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                        {phaseLabel}
                    </Text>
                    {phase !== 'idle' && (
                        <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                            {countdown}
                        </Text>
                    )}
                </div>
            </Box>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Duration
                </Text>
                <Box display="flex" style={{ gap: spacing.sm }}>
                    {DURATION_OPTIONS.map((mins) => (
                        <button
                            key={mins}
                            onClick={() => {
                                if (!isRunning) setSelectedDuration(mins);
                            }}
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: '8px',
                                border: `2px solid ${selectedDuration === mins ? colors.journeys.health.primary : colors.gray[20]}`,
                                backgroundColor:
                                    selectedDuration === mins ? colors.journeys.health.background : colors.gray[0],
                                color: selectedDuration === mins ? colors.journeys.health.primary : colors.gray[60],
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: isRunning ? 'default' : 'pointer',
                            }}
                            aria-label={`${mins} minutes`}
                        >
                            {mins} min
                        </button>
                    ))}
                </Box>
            </Card>

            <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={handleStartPause}
                    accessibilityLabel={isRunning ? 'Pause' : 'Start'}
                >
                    {isRunning ? 'Pause' : phase === 'idle' ? 'Start' : 'Resume'}
                </Button>
            </Box>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Sessions Completed
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {sessionsCompleted}
                    </Text>
                </Card>
                <Card journey="health" elevation="sm" padding="md">
                    <Text fontSize="xs" color={colors.gray[50]}>
                        Time Elapsed
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
                    </Text>
                </Card>
            </div>
        </div>
    );
};

export default BreathingPage;
