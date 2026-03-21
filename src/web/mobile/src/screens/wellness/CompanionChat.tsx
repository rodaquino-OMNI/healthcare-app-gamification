/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Represents a recent conversation preview.
 */
interface ConversationPreview {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

/**
 * Mock conversation data for development.
 */
const MOCK_CONVERSATIONS: ConversationPreview[] = [
    {
        id: 'conv-001',
        title: 'journeys.health.wellness.chat.convMorningCheckIn',
        lastMessage: 'journeys.health.wellness.chat.convMorningLastMsg',
        timestamp: '2h',
        unread: true,
    },
    {
        id: 'conv-002',
        title: 'journeys.health.wellness.chat.convStressRelief',
        lastMessage: 'journeys.health.wellness.chat.convStressLastMsg',
        timestamp: '1d',
        unread: false,
    },
    {
        id: 'conv-003',
        title: 'journeys.health.wellness.chat.convSleepTips',
        lastMessage: 'journeys.health.wellness.chat.convSleepLastMsg',
        timestamp: '2d',
        unread: false,
    },
    {
        id: 'conv-004',
        title: 'journeys.health.wellness.chat.convNutritionPlan',
        lastMessage: 'journeys.health.wellness.chat.convNutritionLastMsg',
        timestamp: '3d',
        unread: false,
    },
    {
        id: 'conv-005',
        title: 'journeys.health.wellness.chat.convMindfulness',
        lastMessage: 'journeys.health.wellness.chat.convMindfulnessLastMsg',
        timestamp: '5d',
        unread: false,
    },
];

/**
 * CompanionChatScreen displays the AI Wellness Companion chat home,
 * featuring an avatar, greeting, and a list of recent conversation previews.
 */
export const CompanionChatScreen: React.FC = () => {
    const navigation = useNavigation<WellnessNavigationProp>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const handleConversationPress = useCallback(
        (_conversationId: string) => {
            navigation.navigate(ROUTES.WELLNESS_CHAT_ACTIVE as 'WellnessChatActive');
        },
        [navigation]
    );

    const handleMoodPrompt = useCallback(() => {
        navigation.navigate(ROUTES.WELLNESS_MOOD_CHECK_IN as 'WellnessMoodCheckIn');
    }, [navigation]);

    const handleNewChat = useCallback(() => {
        navigation.navigate(ROUTES.WELLNESS_CHAT_ACTIVE as 'WellnessChatActive');
    }, [navigation]);

    const renderAvatar = (): React.ReactElement | null => (
        <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{'\u{1F9D8}'}</Text>
            </View>
            <Text style={styles.greeting}>{t('journeys.health.wellness.chat.greeting')}</Text>
            <Text style={styles.subtitle}>{t('journeys.health.wellness.chat.subtitle')}</Text>
        </View>
    );

    const renderMoodPrompt = (): React.ReactElement | null => (
        <TouchableOpacity
            style={styles.moodPrompt}
            onPress={handleMoodPrompt}
            accessibilityLabel={t('journeys.health.wellness.chat.moodPromptLabel')}
            accessibilityRole="button"
            testID="wellness-mood-prompt"
        >
            <Text style={styles.moodEmoji}>{'\u{1F60A}'}</Text>
            <View style={styles.moodTextContainer}>
                <Text style={styles.moodTitle}>{t('journeys.health.wellness.chat.moodPromptTitle')}</Text>
                <Text style={styles.moodSubtitle}>{t('journeys.health.wellness.chat.moodPromptSubtitle')}</Text>
            </View>
            <Text style={styles.moodArrow}>{'\u203A'}</Text>
        </TouchableOpacity>
    );

    const renderConversationItem = ({ item }: { item: ConversationPreview }): React.ReactElement | null => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item.id)}
            accessibilityLabel={t(item.title)}
            accessibilityRole="button"
            testID={`conversation-${item.id}`}
        >
            <View style={styles.conversationIcon}>
                <Text style={styles.conversationEmoji}>{'\u{1F4AC}'}</Text>
            </View>
            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={[styles.conversationTitle, item.unread && styles.conversationTitleUnread]}>
                        {t(item.title)}
                    </Text>
                    <Text style={styles.conversationTimestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.conversationMessage} numberOfLines={1}>
                    {t(item.lastMessage)}
                </Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} testID="wellness-chat-screen">
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{t('journeys.health.wellness.chat.screenTitle')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={MOCK_CONVERSATIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderConversationItem}
                ListHeaderComponent={
                    <>
                        {renderAvatar()}
                        {renderMoodPrompt()}
                        <Text style={styles.sectionLabel}>
                            {t('journeys.health.wellness.chat.recentConversations')}
                        </Text>
                    </>
                }
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                testID="conversation-list"
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={handleNewChat}
                accessibilityLabel={t('journeys.health.wellness.chat.newChat')}
                accessibilityRole="button"
                testID="new-chat-button"
            >
                <Text style={styles.fabIcon}>{'\u002B'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: 40,
            height: 40,
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
            width: 40,
        },
        listContent: {
            paddingBottom: spacingValues['5xl'],
        },
        avatarSection: {
            alignItems: 'center',
            paddingVertical: spacingValues['2xl'],
        },
        avatarCircle: {
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: colors.brand.secondary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacingValues.md,
        },
        avatarEmoji: {
            fontSize: 48,
        },
        greeting: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.text.default,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.text.muted,
            textAlign: 'center',
            marginTop: spacingValues['3xs'],
        },
        moodPrompt: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: spacingValues.md,
            marginBottom: spacingValues.lg,
            padding: spacingValues.md,
            backgroundColor: colors.semantic.info + '15',
            borderRadius: borderRadiusValues.lg,
        },
        moodEmoji: {
            fontSize: 28,
            marginRight: spacingValues.sm,
        },
        moodTextContainer: {
            flex: 1,
        },
        moodTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.text.default,
        },
        moodSubtitle: {
            fontSize: 13,
            color: theme.colors.text.muted,
            marginTop: spacingValues['4xs'],
        },
        moodArrow: {
            fontSize: 24,
            color: theme.colors.text.muted,
        },
        sectionLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text.default,
            marginHorizontal: spacingValues.md,
            marginBottom: spacingValues.sm,
        },
        conversationItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
        },
        conversationIcon: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.background.subtle,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.sm,
        },
        conversationEmoji: {
            fontSize: 20,
        },
        conversationContent: {
            flex: 1,
        },
        conversationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        conversationTitle: {
            fontSize: 15,
            fontWeight: '500',
            color: theme.colors.text.default,
            flex: 1,
        },
        conversationTitleUnread: {
            fontWeight: '700',
        },
        conversationTimestamp: {
            fontSize: 12,
            color: theme.colors.text.muted,
            marginLeft: spacingValues.xs,
        },
        conversationMessage: {
            fontSize: 13,
            color: theme.colors.text.muted,
            marginTop: spacingValues['4xs'],
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.brand.primary,
            marginLeft: spacingValues.xs,
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border.default,
            marginLeft: spacingValues.md + 44 + spacingValues.sm,
        },
        fab: {
            position: 'absolute',
            bottom: spacingValues['2xl'],
            right: spacingValues.md,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.brand.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
        },
        fabIcon: {
            fontSize: 28,
            color: theme.colors.text.onBrand,
            fontWeight: '300',
        },
    });

export default CompanionChatScreen;
