/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';

import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'energetic' | 'tired' | 'grateful' | 'stressed';

interface JournalEntry {
    id: string;
    date: string;
    mood: MoodType;
    previewText: string;
    wordCount: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOOD_ICONS: Record<MoodType, string> = {
    happy: '\u{1F60A}',
    calm: '\u{1F60C}',
    anxious: '\u{1F630}',
    sad: '\u{1F622}',
    energetic: '\u{26A1}',
    tired: '\u{1F634}',
    grateful: '\u{1F64F}',
    stressed: '\u{1F624}',
};

const MOOD_FILTER_OPTIONS: Array<{ key: MoodType | 'all'; labelKey: string }> = [
    { key: 'all', labelKey: 'journeys.health.wellness.journalHistory.filterAll' },
    { key: 'happy', labelKey: 'journeys.health.wellness.journal.moods.happy' },
    { key: 'calm', labelKey: 'journeys.health.wellness.journal.moods.calm' },
    { key: 'anxious', labelKey: 'journeys.health.wellness.journal.moods.anxious' },
    { key: 'sad', labelKey: 'journeys.health.wellness.journal.moods.sad' },
    { key: 'energetic', labelKey: 'journeys.health.wellness.journal.moods.energetic' },
    { key: 'tired', labelKey: 'journeys.health.wellness.journal.moods.tired' },
    { key: 'grateful', labelKey: 'journeys.health.wellness.journal.moods.grateful' },
    { key: 'stressed', labelKey: 'journeys.health.wellness.journal.moods.stressed' },
];

const MOCK_ENTRIES: JournalEntry[] = [
    {
        id: 'j-1',
        date: '2026-02-23',
        mood: 'happy',
        previewText:
            'Today was a wonderful day. I managed to complete my morning meditation and felt very focused throughout the day...',
        wordCount: 156,
    },
    {
        id: 'j-2',
        date: '2026-02-22',
        mood: 'calm',
        previewText:
            'Practiced deep breathing exercises in the afternoon. Feeling much more centered and at peace with myself...',
        wordCount: 89,
    },
    {
        id: 'j-3',
        date: '2026-02-21',
        mood: 'anxious',
        previewText:
            'Had a stressful meeting but managed to use my coping techniques. The wellness breathing exercise helped...',
        wordCount: 203,
    },
    {
        id: 'j-4',
        date: '2026-02-20',
        mood: 'energetic',
        previewText:
            'Great workout this morning! Hit my step goal before noon and ate well all day. Feeling accomplished...',
        wordCount: 112,
    },
    {
        id: 'j-5',
        date: '2026-02-19',
        mood: 'grateful',
        previewText:
            'Thankful for my health journey progress. My sleep quality has improved significantly over the past week...',
        wordCount: 178,
    },
    {
        id: 'j-6',
        date: '2026-02-18',
        mood: 'tired',
        previewText:
            'Did not sleep well last night. Going to try the sleep hygiene routine the wellness companion suggested...',
        wordCount: 95,
    },
    {
        id: 'j-7',
        date: '2026-02-17',
        mood: 'happy',
        previewText:
            'Reached my weekly meditation goal! The companion AI suggested trying a longer session tomorrow...',
        wordCount: 134,
    },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionJournalHistoryScreen: React.FC = () => {
    const navigation = useNavigation<WellnessNavigationProp>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const [moodFilter, setMoodFilter] = useState<MoodType | 'all'>('all');

    const filteredEntries = moodFilter === 'all' ? MOCK_ENTRIES : MOCK_ENTRIES.filter((e) => e.mood === moodFilter);

    const formatDate = useCallback((dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    const renderEntry = ({ item }: { item: JournalEntry }): React.ReactElement | null => (
        <TouchableOpacity
            style={styles.entryCard}
            testID={`journal-entry-${item.id}`}
            accessibilityLabel={t('journeys.health.wellness.journalHistory.entryLabel', {
                date: formatDate(item.date),
            })}
        >
            {/* Timeline indicator */}
            <View style={styles.timelineColumn}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
            </View>

            {/* Entry content */}
            <View style={styles.entryContent}>
                <View style={styles.entryHeader}>
                    <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
                    <View style={styles.moodBadge}>
                        <Text style={styles.moodBadgeIcon}>{MOOD_ICONS[item.mood]}</Text>
                        <Text style={styles.moodBadgeText}>
                            {t(`journeys.health.wellness.journal.moods.${item.mood}`)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.entryPreview} numberOfLines={3}>
                    {item.previewText}
                </Text>
                <Text style={styles.entryWordCount}>
                    {t('journeys.health.wellness.journal.wordCount', { count: item.wordCount })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = (): React.ReactElement | null => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{'\u{1F4D3}'}</Text>
            <Text style={styles.emptyTitle}>{t('journeys.health.wellness.journalHistory.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('journeys.health.wellness.journalHistory.emptySubtitle')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} testID="wellness-journal-history-screen">
            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('journeys.health.wellness.journalHistory.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Mood Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {MOOD_FILTER_OPTIONS.map((option) => {
                    const isActive = moodFilter === option.key;
                    return (
                        <TouchableOpacity
                            key={option.key}
                            onPress={() => setMoodFilter(option.key)}
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                            accessibilityLabel={t(option.labelKey)}
                            accessibilityState={{ selected: isActive }}
                        >
                            {option.key !== 'all' && <Text style={styles.filterIcon}>{MOOD_ICONS[option.key]}</Text>}
                            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                {t(option.labelKey)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Entry Count */}
            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {t('journeys.health.wellness.journalHistory.entryCount', {
                        count: filteredEntries.length,
                    })}
                </Text>
            </View>

            {/* Entry List */}
            <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id}
                renderItem={renderEntry}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
            />
        </SafeAreaView>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.subtle,
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: sizingValues.component.sm,
            height: sizingValues.component.sm,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: theme.colors.text.onBrand,
            fontWeight: '600',
        },
        screenTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
            textAlign: 'center',
        },
        headerSpacer: {
            width: sizingValues.component.sm,
        },
        filterContainer: {
            maxHeight: 48,
            marginTop: spacingValues.md,
        },
        filterContent: {
            paddingHorizontal: spacingValues.md,
            gap: spacingValues.xs,
            alignItems: 'center',
        },
        filterChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.xs,
            paddingHorizontal: spacingValues.md,
            borderRadius: borderRadiusValues.full,
            borderWidth: 1,
            borderColor: colors.brand.primary,
            gap: spacingValues['3xs'],
        },
        filterChipActive: {
            backgroundColor: colors.brand.primary,
        },
        filterIcon: {
            fontSize: 14,
        },
        filterText: {
            fontSize: 13,
            fontWeight: '500',
            color: colors.brand.primary,
        },
        filterTextActive: {
            color: theme.colors.text.onBrand,
        },
        countContainer: {
            paddingHorizontal: spacingValues.md,
            paddingTop: spacingValues.md,
            paddingBottom: spacingValues.xs,
        },
        countText: {
            fontSize: 13,
            color: theme.colors.text.muted,
        },
        listContent: {
            paddingHorizontal: spacingValues.md,
            paddingBottom: spacingValues['5xl'],
        },
        entryCard: {
            flexDirection: 'row',
            marginBottom: spacingValues.xs,
        },
        timelineColumn: {
            width: 24,
            alignItems: 'center',
        },
        timelineDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.brand.primary,
            marginTop: spacingValues['3xs'],
        },
        timelineLine: {
            flex: 1,
            width: 2,
            backgroundColor: theme.colors.border.default,
            marginTop: spacingValues['4xs'],
        },
        entryContent: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.lg,
            padding: spacingValues.md,
            marginLeft: spacingValues.xs,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        entryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacingValues.xs,
        },
        entryDate: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        moodBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacingValues['4xs'],
            backgroundColor: theme.colors.background.subtle,
            paddingVertical: spacingValues['4xs'],
            paddingHorizontal: spacingValues.xs,
            borderRadius: borderRadiusValues.full,
        },
        moodBadgeIcon: {
            fontSize: 12,
        },
        moodBadgeText: {
            fontSize: 11,
            color: theme.colors.text.muted,
        },
        entryPreview: {
            fontSize: 14,
            color: theme.colors.text.default,
            lineHeight: 20,
        },
        entryWordCount: {
            fontSize: 11,
            color: theme.colors.text.muted,
            marginTop: spacingValues.xs,
        },
        emptyContainer: {
            paddingTop: spacingValues['5xl'],
            alignItems: 'center',
            gap: spacingValues.xs,
        },
        emptyIcon: {
            fontSize: 48,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.colors.text.muted,
            textAlign: 'center',
            paddingHorizontal: spacingValues['2xl'],
        },
    });

export default CompanionJournalHistoryScreen;
