import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface QuickReply {
    id: string;
    text: string;
    category: string;
}

const CATEGORIES = ['All', 'Mood', 'Health', 'Activity', 'Nutrition'];

const QUICK_REPLIES: QuickReply[] = [
    { id: '1', text: 'I feel anxious today', category: 'Mood' },
    { id: '2', text: 'I slept poorly last night', category: 'Health' },
    { id: '3', text: 'Suggest a workout', category: 'Activity' },
    { id: '4', text: 'What should I eat for energy?', category: 'Nutrition' },
    { id: '5', text: 'I feel happy and energetic', category: 'Mood' },
    { id: '6', text: 'I have a headache', category: 'Health' },
    { id: '7', text: 'Help me stretch', category: 'Activity' },
    { id: '8', text: 'Healthy snack ideas', category: 'Nutrition' },
    { id: '9', text: 'I am feeling overwhelmed', category: 'Mood' },
    { id: '10', text: 'Track my water intake', category: 'Health' },
    { id: '11', text: 'Quick 5-minute exercise', category: 'Activity' },
    { id: '12', text: 'Meal planning help', category: 'Nutrition' },
    { id: '13', text: 'I need motivation', category: 'Mood' },
    { id: '14', text: 'My back hurts', category: 'Health' },
    { id: '15', text: 'Yoga for beginners', category: 'Activity' },
    { id: '16', text: 'Anti-inflammatory foods', category: 'Nutrition' },
];

const chipStyle = (selected: boolean) => ({
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '20px',
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.gray[20]}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.gray[0],
    color: selected ? colors.journeys.health.primary : colors.gray[60],
    fontWeight: selected ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
});

const QuickRepliesPage: React.FC = () => {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered =
        activeCategory === 'All' ? QUICK_REPLIES : QUICK_REPLIES.filter((r) => r.category === activeCategory);

    const handleSelect = (reply: QuickReply) => {
        router.push({ pathname: '/wellness/chat', query: { message: reply.text } });
    };

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
                Quick Replies
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Choose a suggestion to start a conversation
            </Text>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.xs,
                    overflowX: 'auto',
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.xs,
                }}
                role="tablist"
                aria-label="Reply categories"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={chipStyle(activeCategory === cat)}
                        role="tab"
                        aria-selected={activeCategory === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                {filtered.map((reply) => (
                    <div
                        key={reply.id}
                        onClick={() => handleSelect(reply)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        aria-label={reply.text}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSelect(reply);
                        }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Text
                                fontSize="xs"
                                fontWeight="semiBold"
                                color={colors.journeys.health.primary}
                                style={{ marginBottom: spacing['3xs'] }}
                            >
                                {reply.category}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[60]}>
                                {reply.text}
                            </Text>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickRepliesPage;
