import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../../constants/routes';
import type { CycleTrackingNavigationProp } from '../../../navigation/types';

/**
 * Route params for the article detail screen.
 */
type ArticleDetailParams = {
    params: {
        articleId: string;
    };
};

/**
 * Article content section.
 */
interface ContentSection {
    id: string;
    heading: string;
    body: string;
}

/**
 * Related article reference.
 */
interface RelatedArticle {
    id: string;
    title: string;
    category: string;
    readingTimeMin: number;
}

/**
 * Full article data.
 */
interface ArticleData {
    id: string;
    title: string;
    author: string;
    publishDate: string;
    category: string;
    readingTimeMin: number;
    sections: ContentSection[];
    relatedArticles: RelatedArticle[];
}

const MOCK_ARTICLE: ArticleData = {
    id: 'art-1',
    title: 'How Nutrition Affects Your Menstrual Cycle',
    author: 'Dr. Ana Costa',
    publishDate: '2026-02-15',
    category: 'nutrition',
    readingTimeMin: 5,
    sections: [
        {
            id: 'sec-1',
            heading: 'The Connection Between Diet and Hormones',
            body: 'Your menstrual cycle is regulated by a complex interplay of hormones, and what you eat can significantly influence these hormonal levels. A balanced diet rich in essential nutrients supports regular cycles and can help alleviate common symptoms like cramps and mood swings.',
        },
        {
            id: 'sec-2',
            heading: 'Key Nutrients for Cycle Health',
            body: 'Iron is crucial during menstruation to replace blood loss. Magnesium helps reduce cramps and bloating. Omega-3 fatty acids have anti-inflammatory properties that can ease period pain. B vitamins support energy levels and mood regulation throughout your cycle.',
        },
        {
            id: 'sec-3',
            heading: 'Foods to Include During Each Phase',
            body: 'During the follicular phase, focus on iron-rich foods like leafy greens and lean meats. Around ovulation, increase fiber intake with whole grains and vegetables. In the luteal phase, complex carbohydrates and magnesium-rich foods like dark chocolate and nuts can help manage PMS symptoms.',
        },
        {
            id: 'sec-4',
            heading: 'What to Avoid',
            body: 'Excess caffeine can worsen breast tenderness and anxiety. High sodium intake increases bloating and water retention. Refined sugars may contribute to energy crashes and mood instability. Alcohol can disrupt hormone balance and worsen PMS symptoms.',
        },
    ],
    relatedArticles: [
        {
            id: 'art-6',
            title: 'Iron-Rich Foods for Period Recovery',
            category: 'nutrition',
            readingTimeMin: 3,
        },
        {
            id: 'art-3',
            title: 'Understanding Hormonal Changes Throughout Your Cycle',
            category: 'hormones',
            readingTimeMin: 7,
        },
        {
            id: 'art-5',
            title: 'Sleep Quality and Your Menstrual Cycle',
            category: 'sleep',
            readingTimeMin: 5,
        },
    ],
};

/**
 * CycleArticleDetail displays the full content of an educational article,
 * including sections, author info, and related articles.
 */
export const CycleArticleDetail: React.FC = () => {
    const navigation = useNavigation<CycleTrackingNavigationProp>();
    const route = useRoute<RouteProp<ArticleDetailParams, 'params'>>();
    const { t } = useTranslation();
    const _articleId = route.params?.articleId ?? 'art-1';

    const article = useMemo(() => MOCK_ARTICLE, []);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleShare = useCallback(() => {
        Alert.alert(
            t('journeys.health.cycle.articleDetail.shareTitle'),
            t('journeys.health.cycle.articleDetail.shareMessage')
        );
    }, [t]);

    const handleBookmark = useCallback(() => {
        Alert.alert(
            t('journeys.health.cycle.articleDetail.bookmarkTitle'),
            t('journeys.health.cycle.articleDetail.bookmarkMessage')
        );
    }, [t]);

    const handleRelatedPress = useCallback(
        (relatedId: string) => {
            navigation.navigate(ROUTES.HEALTH_CYCLE_ARTICLE_DETAIL, { articleId: relatedId });
        },
        [navigation]
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <View style={styles.headerActions}>
                    <Touchable
                        onPress={handleBookmark}
                        accessibilityLabel={t('journeys.health.cycle.articleDetail.bookmark')}
                        accessibilityRole="button"
                        testID="bookmark-button"
                    >
                        <Text fontSize="lg" color={colors.journeys.health.primary}>
                            {t('journeys.health.cycle.articleDetail.bookmark')}
                        </Text>
                    </Touchable>
                    <Touchable
                        onPress={handleShare}
                        accessibilityLabel={t('journeys.health.cycle.articleDetail.share')}
                        accessibilityRole="button"
                        testID="share-button"
                        style={styles.shareButton}
                    >
                        <Text fontSize="lg" color={colors.journeys.health.primary}>
                            {t('journeys.health.cycle.articleDetail.share')}
                        </Text>
                    </Touchable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="article-detail-scroll"
            >
                {/* Category & Reading Time */}
                <View style={styles.metaRow}>
                    <View style={styles.categoryBadge}>
                        <Text fontSize="xs" color={colors.gray[0]}>
                            {t(`journeys.health.cycle.insights.categories.${article.category}`)}
                        </Text>
                    </View>
                    <Text fontSize="xs" color={colors.gray[40]}>
                        {article.readingTimeMin} {t('journeys.health.cycle.insights.minRead')}
                    </Text>
                </View>

                {/* Title */}
                <Text fontSize="xl" fontWeight="bold" journey="health" style={styles.title}>
                    {article.title}
                </Text>

                {/* Author & Date */}
                <View style={styles.authorRow}>
                    <View style={styles.authorAvatar}>
                        <Text fontSize="sm" color={colors.gray[40]}>
                            {article.author.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text fontSize="sm" fontWeight="medium">
                            {article.author}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            {article.publishDate}
                        </Text>
                    </View>
                </View>

                {/* Article Body */}
                {article.sections.map((section) => (
                    <View key={section.id} style={styles.sectionContainer} testID={`section-${section.id}`}>
                        <Text fontSize="lg" fontWeight="semiBold" journey="health">
                            {section.heading}
                        </Text>
                        <Text fontSize="md" color={colors.gray[60]} style={styles.bodyText}>
                            {section.body}
                        </Text>
                    </View>
                ))}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Related Articles */}
                <View style={styles.relatedSection}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.articleDetail.related')}
                    </Text>
                    {article.relatedArticles.map((related) => (
                        <Touchable
                            key={related.id}
                            onPress={() => handleRelatedPress(related.id)}
                            accessibilityLabel={related.title}
                            accessibilityRole="button"
                            testID={`related-${related.id}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <Text fontSize="md" fontWeight="medium" numberOfLines={2}>
                                    {related.title}
                                </Text>
                                <View style={styles.relatedMeta}>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t(`journeys.health.cycle.insights.categories.${related.category}`)}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {related.readingTimeMin} {t('journeys.health.cycle.insights.minRead')}
                                    </Text>
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shareButton: {
        marginLeft: spacingValues.md,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
        marginTop: spacingValues.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacingValues.xs,
        paddingVertical: spacingValues['4xs'],
        borderRadius: 10,
        backgroundColor: colors.journeys.health.primary,
    },
    title: {
        marginTop: spacingValues.sm,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacingValues.md,
        marginBottom: spacingValues.xl,
    },
    authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    sectionContainer: {
        marginTop: spacingValues.lg,
        gap: spacingValues.xs,
    },
    bodyText: {
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[20],
        marginVertical: spacingValues.xl,
    },
    relatedSection: {
        gap: spacingValues.sm,
    },
    relatedMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues['3xs'],
    },
});

export default CycleArticleDetail;
