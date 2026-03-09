import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const MOOD_OPTIONS = [
    { emoji: '1', label: 'Very Bad', value: 1 },
    { emoji: '2', label: 'Bad', value: 2 },
    { emoji: '3', label: 'Neutral', value: 3 },
    { emoji: '4', label: 'Good', value: 4 },
    { emoji: '5', label: 'Very Good', value: 5 },
];

interface RecentChat {
    id: string;
    preview: string;
    date: string;
    mood: string;
}

const RECENT_CHATS: RecentChat[] = [
    { id: '1', preview: 'We discussed breathing exercises for stress...', date: 'Today, 9:30 AM', mood: 'Calm' },
    { id: '2', preview: 'Tips for better sleep hygiene were shared...', date: 'Yesterday, 8:15 PM', mood: 'Tired' },
    { id: '3', preview: 'Meditation routine planning session...', date: 'Feb 21, 3:00 PM', mood: 'Focused' },
];

const NAV_LINKS = [
    { label: 'Chat', href: '/wellness/chat' },
    { label: 'Breathing', href: '/wellness/breathing' },
    { label: 'Meditation', href: '/wellness/meditation' },
    { label: 'Daily Plan', href: '/wellness/daily-plan' },
    { label: 'Insights', href: '/wellness/insights' },
    { label: 'Goals', href: '/wellness/goals' },
    { label: 'Journal', href: '/wellness/journal' },
    { label: 'Challenges', href: '/wellness/challenges' },
    { label: 'Streaks', href: '/wellness/streaks' },
];

const WellnessHomePage: React.FC = () => {
    const router = useRouter();
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    const handleMoodSelect = (value: number): void => {
        setSelectedMood(value);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                AI Wellness Companion
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your personal wellness assistant
            </Text>

            <Card journey="health" elevation="sm" padding="md">
                <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>
                    How are you feeling today?
                </Text>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.sm }}>
                    {MOOD_OPTIONS.map((mood) => (
                        <button
                            key={mood.value}
                            onClick={() => handleMoodSelect(mood.value)}
                            aria-label={mood.label}
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
                        Very Bad
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        Very Good
                    </Text>
                </Box>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.lg }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => void router.push('/wellness/chat')}
                    accessibilityLabel="Start new chat"
                >
                    Start New Chat
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/wellness/mood')}
                    accessibilityLabel="View mood history"
                >
                    Mood History
                </Button>
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Recent Conversations
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                {RECENT_CHATS.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => void router.push('/wellness/chat')}
                        style={{ cursor: 'pointer' }}
                        role="link"
                        tabIndex={0}
                        aria-label={`Chat: ${chat.preview}`}
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
                                        {chat.preview}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                                        {chat.date}
                                    </Text>
                                </Box>
                                <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                    {chat.mood}
                                </Text>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Explore
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
                {NAV_LINKS.map((link) => (
                    <Button
                        key={link.href}
                        variant="secondary"
                        journey="health"
                        onPress={() => void router.push(link.href)}
                        accessibilityLabel={link.label}
                    >
                        {link.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default WellnessHomePage;
