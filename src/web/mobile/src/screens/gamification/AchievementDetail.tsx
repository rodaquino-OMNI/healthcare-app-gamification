/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizingValues } from '@design-system/tokens/sizing';
import { spacingValues } from '@design-system/tokens/spacing';
import { fontSizeValues } from '@design-system/tokens/typography';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Achievement } from '@shared/types/gamification.types';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native';

import { useAchievements } from '../../hooks/useGamification';
import { useTheme } from '../../hooks/useTheme';
import { haptic } from '../../utils/haptics';

type AchievementDetailParamList = {
    GamificationAchievementDetail: { achievementId: string };
};

interface Requirement {
    id: string;
    label: string;
    completed: boolean;
}

function getJourneyColor(journey: string): string {
    const key = journey.toLowerCase() as keyof typeof colors.journeys;
    return colors.journeys[key]?.primary ?? colors.brand.primary;
}

function getJourneyBackground(journey: string): string {
    const key = journey.toLowerCase() as keyof typeof colors.journeys;
    return colors.journeys[key]?.background ?? colors.gray[5];
}

function getJourneyLabelKey(journey: string): string {
    const keys: Record<string, string> = {
        health: 'gamification.achievementDetail.journeyHealth',
        care: 'gamification.achievementDetail.journeyCare',
        plan: 'gamification.achievementDetail.journeyPlan',
    };
    return keys[journey.toLowerCase()] ?? 'gamification.achievementDetail.journeyDefault';
}

/** Generate mock requirements based on achievement progress. */
function getMockRequirements(achievement: Achievement): Requirement[] {
    const total = achievement.total;
    const progress = achievement.progress;
    const stepSize = total > 0 ? Math.ceil(total / 4) : 1;

    return [
        {
            id: 'req-1',
            label: `Completar ${stepSize} atividades`,
            completed: progress >= stepSize,
        },
        {
            id: 'req-2',
            label: `Completar ${stepSize * 2} atividades`,
            completed: progress >= stepSize * 2,
        },
        {
            id: 'req-3',
            label: `Completar ${stepSize * 3} atividades`,
            completed: progress >= stepSize * 3,
        },
        {
            id: 'req-4',
            label: `Completar todas as ${total} atividades`,
            completed: progress >= total,
        },
    ];
}

/** Achievement detail: progress, requirements, reward preview, share. */
const AchievementDetailScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme as Theme);
    const route = useRoute<RouteProp<AchievementDetailParamList, 'GamificationAchievementDetail'>>();
    const { achievementId } = (route.params ?? {}) as Partial<{ achievementId: string }>;

    const achievements: Achievement[] | undefined = useAchievements();

    const achievement = useMemo(() => {
        if (!achievements || !achievementId) {
            return undefined;
        }
        return achievements.find((a) => a.id === achievementId);
    }, [achievements, achievementId]);

    // Fire success haptic when viewing an unlocked achievement
    useEffect(() => {
        if (achievement?.unlocked) {
            void haptic.success();
        }
    }, [achievement?.unlocked]);

    const handleShare = async (): Promise<void> => {
        if (!achievement) {
            return;
        }
        try {
            await Share.share({
                message: `Confira minha conquista no AUSTA: "${achievement.title}" - ${achievement.description}`,
                title: achievement.title,
            });
        } catch (error) {
            Alert.alert(
                t('gamification.achievementDetail.shareError'),
                t('gamification.achievementDetail.shareErrorMessage')
            );
        }
    };

    const handleGoBack = (): void => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    if (!achievementId) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel={t('common.buttons.back')}
                    >
                        <Text style={styles.backButtonText}>
                            {'<'} {t('common.buttons.back')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centeredMessage}>
                    <Text style={styles.errorText}>{t('gamification.achievementDetail.notFound')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!achievements) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centeredMessage}>
                    <Text style={styles.loadingText}>{t('gamification.achievementDetail.loading')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!achievement) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel={t('common.buttons.back')}
                    >
                        <Text style={styles.backButtonText}>
                            {'<'} {t('common.buttons.back')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centeredMessage}>
                    <Text style={styles.errorText}>{t('gamification.achievementDetail.notFound')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const journeyColor = getJourneyColor(achievement.journey);
    const journeyBg = getJourneyBackground(achievement.journey);
    const journeyLabel = t(getJourneyLabelKey(achievement.journey));
    const progressPercent = achievement.total > 0 ? Math.round((achievement.progress / achievement.total) * 100) : 0;
    const requirements = getMockRequirements(achievement);
    const mockXPReward = achievement.total * 10;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleGoBack}
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backButtonText}>
                        {'<'} {t('common.buttons.back')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => void handleShare()}
                    style={styles.shareButton}
                    accessibilityRole="button"
                    accessibilityLabel={t('gamification.achievementDetail.shareLabel')}
                >
                    <Text style={styles.shareButtonText}>{t('gamification.achievementDetail.share')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Icon */}
                <View
                    style={[
                        styles.iconContainer,
                        {
                            borderColor: achievement.unlocked ? journeyColor : colors.gray[20],
                            backgroundColor: journeyBg,
                        },
                    ]}
                >
                    <Text style={styles.iconText}>{achievement.icon}</Text>
                </View>

                {/* Unlocked badge */}
                {achievement.unlocked && (
                    <View style={[styles.statusBadge, { backgroundColor: colors.semantic.successBg }]}>
                        <Text style={[styles.statusBadgeText, { color: colors.semantic.success }]}>
                            {t('gamification.achievementDetail.unlocked')}
                        </Text>
                    </View>
                )}

                {/* Title + Description */}
                <Text style={styles.title}>{achievement.title}</Text>
                <Text style={styles.description}>{achievement.description}</Text>

                {/* Journey Badge */}
                <View style={[styles.journeyBadge, { backgroundColor: journeyBg }]}>
                    <View style={[styles.journeyDot, { backgroundColor: journeyColor }]} />
                    <Text style={[styles.journeyBadgeText, { color: journeyColor }]}>{journeyLabel}</Text>
                </View>

                {/* Progress Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('gamification.achievementDetail.progress')}</Text>
                    <View style={styles.progressRow}>
                        <Text style={styles.progressPercent}>{progressPercent}%</Text>
                        <Text style={styles.progressFraction}>
                            {achievement.progress}/{achievement.total}
                        </Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progressPercent}%`,
                                    backgroundColor: achievement.unlocked ? journeyColor : colors.gray[30],
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Requirements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('gamification.achievementDetail.requirements')}</Text>
                    {requirements.map((req) => (
                        <View key={req.id} style={styles.requirementRow}>
                            <View
                                style={[
                                    styles.checkCircle,
                                    req.completed && {
                                        backgroundColor: colors.semantic.success,
                                        borderColor: colors.semantic.success,
                                    },
                                ]}
                            >
                                {req.completed && <Text style={styles.checkMark}>{'✓'}</Text>}
                            </View>
                            <Text style={[styles.requirementLabel, req.completed && styles.requirementLabelDone]}>
                                {req.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Reward Preview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('gamification.achievementDetail.reward')}</Text>
                    <View style={[styles.rewardCard, { borderColor: journeyColor }]}>
                        <Text style={styles.rewardIcon}>{'⭐'}</Text>
                        <View style={styles.rewardInfo}>
                            <Text style={styles.rewardTitle}>{t('gamification.achievementDetail.xpBonus')}</Text>
                            <Text style={[styles.rewardXP, { color: journeyColor }]}>+{mockXPReward} XP</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background.default },
        centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        loadingText: { fontSize: fontSizeValues.md, color: theme.colors.text.muted },
        errorText: { fontSize: fontSizeValues.md, color: theme.colors.text.muted },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        backButton: { paddingVertical: spacingValues.xs, paddingRight: spacingValues.md },
        backButtonText: { fontSize: fontSizeValues.md, fontWeight: '600', color: colors.brand.primary },
        shareButton: { paddingVertical: spacingValues.xs, paddingLeft: spacingValues.md },
        shareButtonText: { fontSize: fontSizeValues.sm, fontWeight: '600', color: colors.brand.primary },
        scrollContent: {
            alignItems: 'center',
            paddingHorizontal: spacingValues.xl,
            paddingBottom: spacingValues['4xl'],
        },
        iconContainer: {
            width: 96,
            height: 96,
            borderRadius: 48,
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacingValues['2xl'],
            marginBottom: spacingValues.md,
        },
        iconText: { fontSize: 44 },
        statusBadge: {
            borderRadius: borderRadiusValues.full,
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues['3xs'],
            marginBottom: spacingValues.md,
        },
        statusBadgeText: { fontSize: fontSizeValues.xs, fontWeight: '600' },
        title: {
            fontSize: fontSizeValues.xl,
            fontWeight: '700',
            color: theme.colors.text.default,
            textAlign: 'center',
            marginBottom: spacingValues.xs,
        },
        description: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            textAlign: 'center',
            lineHeight: fontSizeValues.sm * 1.5,
            marginBottom: spacingValues.md,
        },
        journeyBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: borderRadiusValues.full,
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues['3xs'],
            marginBottom: spacingValues.xl,
        },
        journeyDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacingValues['2xs'] },
        journeyBadgeText: { fontSize: fontSizeValues.xs, fontWeight: '600' },
        section: { width: '100%', marginBottom: spacingValues.xl },
        sectionTitle: {
            fontSize: fontSizeValues.md,
            fontWeight: '700',
            color: theme.colors.text.default,
            marginBottom: spacingValues.sm,
        },
        progressRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: spacingValues.xs,
        },
        progressPercent: { fontSize: fontSizeValues['2xl'], fontWeight: '700', color: theme.colors.text.default },
        progressFraction: { fontSize: fontSizeValues.sm, color: theme.colors.text.muted },
        progressTrack: {
            height: 10,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.sm,
            overflow: 'hidden',
        },
        progressFill: { height: 10, borderRadius: borderRadiusValues.sm },
        requirementRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacingValues.xs,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
        },
        checkCircle: {
            width: sizingValues.component.xs,
            height: sizingValues.component.xs,
            borderRadius: sizingValues.component.xs / 2,
            borderWidth: 2,
            borderColor: colors.gray[30],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacingValues.sm,
        },
        checkMark: { fontSize: fontSizeValues.xs, color: theme.colors.text.onBrand, fontWeight: '700' },
        requirementLabel: { fontSize: fontSizeValues.sm, color: theme.colors.text.default, flex: 1 },
        requirementLabelDone: { color: theme.colors.text.subtle, textDecorationLine: 'line-through' },
        rewardCard: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacingValues.md,
            backgroundColor: theme.colors.background.muted,
            borderRadius: borderRadiusValues.lg,
            borderWidth: 1,
        },
        rewardIcon: { fontSize: 28, marginRight: spacingValues.sm },
        rewardInfo: { flex: 1 },
        rewardTitle: { fontSize: fontSizeValues.sm, fontWeight: '600', color: theme.colors.text.default },
        rewardXP: { fontSize: fontSizeValues.lg, fontWeight: '700', marginTop: spacingValues['4xs'] },
    });

export default AchievementDetailScreen;
