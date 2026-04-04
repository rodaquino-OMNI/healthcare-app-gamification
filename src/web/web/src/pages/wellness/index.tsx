import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

const MOOD_OPTIONS = [
    { labelKey: 'wellness.mood.veryBad', value: 1 },
    { labelKey: 'wellness.mood.bad', value: 2 },
    { labelKey: 'wellness.mood.neutral', value: 3 },
    { labelKey: 'wellness.mood.good', value: 4 },
    { labelKey: 'wellness.mood.veryGood', value: 5 },
];

const PLACEHOLDER_USER_ID = 'me';

const NAV_LINKS = [
    { labelKey: 'wellness.explore.chat', href: '/wellness/chat' },
    { labelKey: 'wellness.explore.breathing', href: '/wellness/breathing' },
    { labelKey: 'wellness.explore.meditation', href: '/wellness/meditation' },
    { labelKey: 'wellness.explore.dailyPlan', href: '/wellness/daily-plan' },
    { labelKey: 'wellness.explore.insights', href: '/wellness/insights' },
    { labelKey: 'wellness.explore.goals', href: '/wellness/goals' },
    { labelKey: 'wellness.explore.journal', href: '/wellness/journal' },
    { labelKey: 'wellness.explore.challenges', href: '/wellness/challenges' },
    { labelKey: 'wellness.explore.streaks', href: '/wellness/streaks' },
];

const WellnessHomePage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const { chatHistory, loadChatHistory, submitMood } = useWellness();

    useEffect(() => {
        void loadChatHistory(PLACEHOLDER_USER_ID);
    }, [loadChatHistory]);

    const handleMoodSelect = (value: number): void => {
        setSelectedMood(value);
    };

    const handleMoodSubmit = (): void => {
        if (selectedMood === null) {
            return;
        }
        const moodMap: Record<number, 'great' | 'good' | 'okay' | 'bad' | 'terrible'> = {
            5: 'great',
            4: 'good',
            3: 'okay',
            2: 'bad',
            1: 'terrible',
        };
        void submitMood(PLACEHOLDER_USER_ID, {
            mood: moodMap[selectedMood] ?? 'okay',
            energy: selectedMood,
            stress: 6 - selectedMood,
        });
    };

    const recentMessages = chatHistory?.messages.slice(-3) ?? [];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                {t('wellness.title')}
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                {t('wellness.subtitle')}
            </Text>

            <Card journey="health" elevation="sm" padding="md">
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    {t('wellness.mood.question')}
                </Text>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.sm }}>
                    {MOOD_OPTIONS.map((mood) => (
                        <button
                            key={mood.value}
                            onClick={() => handleMoodSelect(mood.value)}
                            aria-label={t(mood.labelKey)}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                border: `2px solid ${selectedMood === mood.value ? colors.journeys.health.primary : colors.gray[20]}`,
                                backgroundColor:
                                    selectedMood === mood.value ? colors.journeys.health.background : colors.gray[0],
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: selectedMood === mood.value ? colors.journeys.health.primary : colors.gray[50],
                            }}
                        >
                            {mood.value}
                        </button>
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Text fontSize="xs" color={colors.gray[40]}>
                        {t('wellness.mood.veryBad')}
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        {t('wellness.mood.veryGood')}
                    </Text>
                </Box>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.lg }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => void router.push('/wellness/chat')}
                    accessibilityLabel={t('wellness.actions.startChat')}
                >
                    {t('wellness.actions.startChat')}
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => {
                        handleMoodSubmit();
                        void router.push('/wellness/mood');
                    }}
                    accessibilityLabel={t('wellness.actions.moodHistory')}
                >
                    {t('wellness.actions.moodHistory')}
                </Button>
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                {t('wellness.conversations.title')}
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {recentMessages.length > 0 ? (
                    recentMessages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => void router.push('/wellness/chat')}
                            style={{ cursor: 'pointer' }}
                            role="link"
                            tabIndex={0}
                            aria-label={`Chat: ${msg.content}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void router.push('/wellness/chat');
                                }
                            }}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box style={{ flex: 1 }}>
                                        <Text fontSize="sm" color={colors.gray[60]}>
                                            {msg.content}
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            color={colors.gray[40]}
                                            style={{ marginTop: spacing['3xs'] }}
                                        >
                                            {msg.timestamp}
                                        </Text>
                                    </Box>
                                    <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                        {msg.role === 'user'
                                            ? t('wellness.conversations.you')
                                            : t('wellness.conversations.ai')}
                                    </Text>
                                </Box>
                            </Card>
                        </div>
                    ))
                ) : (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        {t('wellness.conversations.empty')}
                    </Text>
                )}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                {t('wellness.explore.title')}
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {NAV_LINKS.map((link) => (
                    <Button
                        key={link.href}
                        variant="secondary"
                        journey="health"
                        onPress={() => void router.push(link.href)}
                        accessibilityLabel={t(link.labelKey)}
                    >
                        {t(link.labelKey)}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default WellnessHomePage;
