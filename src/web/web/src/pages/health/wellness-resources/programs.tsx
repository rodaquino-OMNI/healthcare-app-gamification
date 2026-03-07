import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type Level = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
const LEVELS: Level[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const PROGRAMS = [
    {
        id: 'p1',
        title: '7-Day Mindfulness Challenge',
        level: 'Beginner',
        duration: '7 days',
        enrolled: 1240,
        progress: 0,
    },
    {
        id: 'p2',
        title: 'Strength Training Fundamentals',
        level: 'Beginner',
        duration: '14 days',
        enrolled: 856,
        progress: 45,
    },
    {
        id: 'p3',
        title: 'Intermittent Fasting Guide',
        level: 'Intermediate',
        duration: '21 days',
        enrolled: 632,
        progress: 0,
    },
    { id: 'p4', title: 'Advanced Yoga Series', level: 'Advanced', duration: '30 days', enrolled: 418, progress: 72 },
    {
        id: 'p5',
        title: 'Sleep Optimization Program',
        level: 'Intermediate',
        duration: '14 days',
        enrolled: 975,
        progress: 0,
    },
];

const WellnessProgramsPage: React.FC = () => {
    const router = useRouter();
    const [level, setLevel] = useState<Level>('All');

    const filtered = PROGRAMS.filter((p) => level === 'All' || p.level === level);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/wellness-resources')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness resources"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Wellness Programs
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
                Structured programs to build lasting healthy habits
            </Text>

            <Box display="flex" style={{ gap: spacing.xs, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
                {LEVELS.map((l) => (
                    <Button
                        key={l}
                        variant={level === l ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setLevel(l)}
                        accessibilityLabel={`Filter ${l}`}
                    >
                        {l}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {filtered.map((program) => (
                    <Card
                        key={program.id}
                        journey="health"
                        elevation="sm"
                        padding="md"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/health/wellness-resources/program-detail?id=${program.id}`)}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.text}>
                                {program.title}
                            </Text>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {program.level}
                            </Text>
                        </Box>
                        <Box display="flex" style={{ gap: spacing.md, marginBottom: spacing.xs }}>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {program.duration}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {program.enrolled.toLocaleString()} enrolled
                            </Text>
                        </Box>
                        {program.progress > 0 && (
                            <div style={{ marginBottom: spacing.xs }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: colors.gray[10],
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${program.progress}%`,
                                            height: '100%',
                                            borderRadius: 3,
                                            backgroundColor: colors.journeys.health.primary,
                                        }}
                                    />
                                </div>
                                <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                                    {program.progress}% complete
                                </Text>
                            </div>
                        )}
                        <Button
                            variant={program.progress > 0 ? 'primary' : 'secondary'}
                            journey="health"
                            onPress={() => router.push(`/health/wellness-resources/program-detail?id=${program.id}`)}
                            accessibilityLabel={program.progress > 0 ? 'Continue program' : 'Enroll in program'}
                        >
                            {program.progress > 0 ? 'Continue' : 'Enroll'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WellnessProgramsPage;
