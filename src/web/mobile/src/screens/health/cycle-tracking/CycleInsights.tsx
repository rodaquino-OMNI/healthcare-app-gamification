import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';

import { ROUTES } from '../../../constants/routes';

/**
 * Article category type.
 */
type ArticleCategory = 'nutrition' | 'exercise' | 'mental_health' | 'sleep' | 'hormones';

/**
 * Article data model.
 */
interface Article {
    id: string;
    title: string;
    category: ArticleCategory;
    readingTimeMin: number;
    isFeatured: boolean;
    publishDate: string;
}

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
    nutrition: colors.semantic.success,
    exercise: colors.journeys.health.primary,
    mental_health: colors.journeys.community.primary,
    sleep: colors.journeys.plan.primary,
    hormones: colors.semantic.warning,
};

const ALL_CATEGORIES: ArticleCategory[] = ['nutrition', 'exercise', 'mental_health', 'sleep', 'hormones'];

const MOCK_ARTICLES: Article[] = [
    {
        id: 'art-1',
        title: 'How Nutrition Affects Your Menstrual Cycle',
        category: 'nutrition',
        readingTimeMin: 5,
        isFeatured: true,
        publishDate: '2026-02-15',
    },
    {
        id: 'art-2',
        title: 'Best Exercises During Your Period',
        category: 'exercise',
        readingTimeMin: 4,
        isFeatured: true,
        publishDate: '2026-02-10',
    },
    {
        id: 'art-3',
        title: 'Understanding Hormonal Changes Throughout Your Cycle',
        category: 'hormones',
        readingTimeMin: 7,
        isFeatured: false,
        publishDate: '2026-02-08',
    },
    {
        id: 'art-4',
        title: 'Managing PMS-Related Anxiety and Mood Swings',
        category: 'mental_health',
        readingTimeMin: 6,
        isFeatured: true,
        publishDate: '2026-02-05',
    },
    {
        id: 'art-5',
        title: 'Sleep Quality and Your Menstrual Cycle',
        category: 'sleep',
        readingTimeMin: 5,
        isFeatured: false,
        publishDate: '2026-01-28',
    },
    {
        id: 'art-6',
        title: 'Iron-Rich Foods for Period Recovery',
        category: 'nutrition',
        readingTimeMin: 3,
        isFeatured: false,
        publishDate: '2026-01-20',
    },
    {
        id: 'art-7',
        title: 'Yoga Poses to Relieve Menstrual Cramps',
        category: 'exercise',
        readingTimeMin: 4,
        isFeatured: false,
        publishDate: '2026-01-15',
    },
    {
        id: 'art-8',
        title: 'How Cortisol and Progesterone Interact',
        category: 'hormones',
        readingTimeMin: 8,
        isFeatured: false,
        publishDate: '2026-01-10',
    },
    {
        id: 'art-9',
        title: 'Creating a Sleep Routine Around Your Cycle',
        category: 'sleep',
        readingTimeMin: 5,
        isFeatured: false,
        publishDate: '2026-01-05',
    },
    {
        id: 'art-10',
        title: 'Mindfulness Techniques for Cycle Awareness',
        category: 'mental_health',
        readingTimeMin: 6,
        isFeatured: false,
        publishDate: '2025-12-28',
    },
];

/**
 * CycleInsights displays educational articles related to menstrual health.
 * Features category filtering, featured/recent sections, and navigation to detail.
 */
export const CycleInsights: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'all') {
            return MOCK_ARTICLES;
        }
        return MOCK_ARTICLES.filter((a) => a.category === selectedCategory);
    }, [selectedCategory]);

    const featuredArticles = useMemo(() => filteredArticles.filter((a) => a.isFeatured), [filteredArticles]);

    const recentArticles = useMemo(() => filteredArticles.filter((a) => !a.isFeatured), [filteredArticles]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleArticlePress = useCallback(
        (articleId: string) => {
            navigation.navigate(ROUTES.HEALTH_CYCLE_ARTICLE_DETAIL, { articleId });
        },
        [navigation]
    );

    const handleCategoryPress = useCallback((category: ArticleCategory | 'all') => {
        setSelectedCategory(category);
    }, []);

    const renderArticleCard = useCallback(
        (article: Article) => (
            <Touchable
                key={article.id}
                onPress={() => handleArticlePress(article.id)}
                accessibilityLabel={article.title}
                accessibilityRole="button"
                testID={`article-${article.id}`}
            >
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.articleRow}>
                        <View style={styles.thumbnailPlaceholder}>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.cycle.insights.thumbnail')}
                            </Text>
                        </View>
                        <View style={styles.articleContent}>
                            <Text fontSize="md" fontWeight="semiBold" numberOfLines={2}>
                                {article.title}
                            </Text>
                            <View style={styles.articleMeta}>
                                <View
                                    style={[
                                        styles.categoryBadge,
                                        { backgroundColor: CATEGORY_COLORS[article.category] },
                                    ]}
                                >
                                    <Text fontSize="xs" color={colors.gray[0]}>
                                        {t(`journeys.health.cycle.insights.categories.${article.category}`)}
                                    </Text>
                                </View>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {article.readingTimeMin} {t('journeys.health.cycle.insights.minRead')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </Touchable>
        ),
        [handleArticlePress, t]
    );

    const renderListHeader = useCallback(
        () => (
            <View>
                {/* Category Filter */}
                <View style={styles.categoryContainer}>
                    <Touchable
                        onPress={() => handleCategoryPress('all')}
                        accessibilityLabel={t('journeys.health.cycle.insights.allCategories')}
                        accessibilityRole="button"
                        testID="category-all"
                        style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive] as any}
                    >
                        <Text fontSize="sm" color={selectedCategory === 'all' ? colors.gray[0] : colors.gray[50]}>
                            {t('journeys.health.cycle.insights.all')}
                        </Text>
                    </Touchable>
                    {ALL_CATEGORIES.map((cat) => (
                        <Touchable
                            key={cat}
                            onPress={() => handleCategoryPress(cat)}
                            accessibilityLabel={t(`journeys.health.cycle.insights.categories.${cat}`)}
                            accessibilityRole="button"
                            testID={`category-${cat}`}
                            style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive] as any}
                        >
                            <Text fontSize="sm" color={selectedCategory === cat ? colors.gray[0] : colors.gray[50]}>
                                {t(`journeys.health.cycle.insights.categories.${cat}`)}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Featured Section */}
                {featuredArticles.length > 0 && (
                    <View style={styles.sectionContainer}>
                        <Text fontSize="lg" fontWeight="semiBold" journey="health">
                            {t('journeys.health.cycle.insights.featured')}
                        </Text>
                        <View style={styles.articleList}>{featuredArticles.map(renderArticleCard)}</View>
                    </View>
                )}

                {/* Recent Section Header */}
                {recentArticles.length > 0 && (
                    <View style={styles.sectionHeader}>
                        <Text fontSize="lg" fontWeight="semiBold" journey="health">
                            {t('journeys.health.cycle.insights.recent')}
                        </Text>
                    </View>
                )}
            </View>
        ),
        [selectedCategory, featuredArticles, recentArticles, handleCategoryPress, renderArticleCard, t]
    );

    const renderRecentItem = useCallback(
        ({ item }: ListRenderItemInfo<Article>) => renderArticleCard(item),
        [renderArticleCard]
    );

    const keyExtractor = useCallback((item: Article) => item.id, []);

    return (
        <View style={styles.container}>
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
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.insights.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={recentArticles}
                renderItem={renderRecentItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={renderListHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="insights-list"
            />
        </View>
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
    headerSpacer: {
        width: 40,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues.xs,
        marginTop: spacingValues.sm,
    },
    categoryChip: {
        paddingHorizontal: spacingValues.sm,
        paddingVertical: spacingValues['3xs'],
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.gray[20],
        backgroundColor: colors.gray[0],
    },
    categoryChipActive: {
        backgroundColor: colors.journeys.health.primary,
        borderColor: colors.journeys.health.primary,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    sectionHeader: {
        marginTop: spacingValues.xl,
        marginBottom: spacingValues.sm,
    },
    articleList: {
        gap: spacingValues.sm,
    },
    articleRow: {
        flexDirection: 'row',
    },
    thumbnailPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    articleContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    articleMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
        marginTop: spacingValues['3xs'],
    },
    categoryBadge: {
        paddingHorizontal: spacingValues.xs,
        paddingVertical: spacingValues['4xs'],
        borderRadius: 10,
    },
});

export default CycleInsights;
