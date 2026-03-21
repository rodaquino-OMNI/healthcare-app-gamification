import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Content category types for the dashboard.
 */
type ContentCategory = 'article' | 'video' | 'program';

/**
 * A category card on the dashboard.
 */
interface CategoryCard {
    id: string;
    labelKey: string;
    icon: keyof typeof Ionicons.glyphMap;
    screen: string;
}

/**
 * A featured content item.
 */
interface FeaturedContent {
    id: string;
    title: string;
    category: ContentCategory;
    readTime: string;
}

/**
 * A recent activity item.
 */
interface RecentActivity {
    id: string;
    title: string;
    category: ContentCategory;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryCard[] = [
    {
        id: 'cat-articles',
        labelKey: 'journeys.health.wellnessResources.home.articles',
        icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
        screen: 'HealthWellnessResourcesArticleList',
    },
    {
        id: 'cat-videos',
        labelKey: 'journeys.health.wellnessResources.home.videos',
        icon: 'videocam-outline' as keyof typeof Ionicons.glyphMap,
        screen: 'HealthWellnessResourcesVideoLibrary',
    },
    {
        id: 'cat-programs',
        labelKey: 'journeys.health.wellnessResources.home.programs',
        icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
        screen: 'HealthWellnessResourcesPrograms',
    },
];

const MOCK_FEATURED: FeaturedContent[] = [
    { id: 'featured-1', title: '10 Tips for Better Sleep', category: 'article', readTime: '5 min' },
    { id: 'featured-2', title: 'Morning Yoga Flow', category: 'video', readTime: '12 min' },
    { id: 'featured-3', title: 'Mindful Eating Guide', category: 'article', readTime: '8 min' },
    { id: 'featured-4', title: '30-Day Wellness Challenge', category: 'program', readTime: '30 days' },
];

const MOCK_RECENT: RecentActivity[] = [
    {
        id: 'recent-1',
        title: 'Understanding Macronutrients',
        category: 'article',
        subtitle: '5 min read',
        icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
        id: 'recent-2',
        title: 'Guided Meditation for Stress',
        category: 'video',
        subtitle: '15 min watch',
        icon: 'videocam-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
        id: 'recent-3',
        title: 'Beginner Fitness Program',
        category: 'program',
        subtitle: '4 weeks',
        icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
    },
];

const CATEGORY_ICON_MAP: Record<ContentCategory, keyof typeof Ionicons.glyphMap> = {
    article: 'book-outline' as keyof typeof Ionicons.glyphMap,
    video: 'videocam-outline' as keyof typeof Ionicons.glyphMap,
    program: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
};

/**
 * WellnessResourcesHome displays a dashboard with category cards,
 * featured content, and recent activity for wellness resources.
 */
export const WellnessResourcesHome: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();

    const handleCategoryPress = useCallback(
        (screen: string) => {
            navigation.navigate(screen);
        },
        [navigation]
    );

    const handleBookmarksPress = useCallback(() => {
        navigation.navigate('HealthWellnessResourcesBookmarks');
    }, [navigation]);

    const handleFeaturedPress = useCallback(
        (item: FeaturedContent) => {
            if (item.category === 'article') {
                navigation.navigate('HealthWellnessResourcesArticleDetail', { articleId: item.id });
            } else if (item.category === 'video') {
                navigation.navigate('HealthWellnessResourcesVideoPlayer', { videoId: item.id });
            } else {
                navigation.navigate('HealthWellnessResourcesProgramDetail', { programId: item.id });
            }
        },
        [navigation]
    );

    const handleRecentPress = useCallback(
        (item: RecentActivity) => {
            if (item.category === 'article') {
                navigation.navigate('HealthWellnessResourcesArticleDetail', { articleId: item.id });
            } else if (item.category === 'video') {
                navigation.navigate('HealthWellnessResourcesVideoPlayer', { videoId: item.id });
            } else {
                navigation.navigate('HealthWellnessResourcesProgramDetail', { programId: item.id });
            }
        },
        [navigation]
    );

    return (
        <View style={styles.container} testID="wellness-resources-home-screen">
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="wellness-resources-home-back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.wellnessResources.home.title')}
                </Text>
                <Touchable
                    onPress={handleBookmarksPress}
                    accessibilityLabel={t('journeys.health.wellnessResources.home.bookmarks')}
                    accessibilityRole="button"
                    testID="wellness-resources-home-bookmarks-button"
                >
                    <Ionicons name="bookmark-outline" size={24} color={colors.journeys.health.primary} />
                </Touchable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Category Cards */}
                <View style={styles.categoriesRow}>
                    {CATEGORIES.map((cat) => (
                        <Touchable
                            key={cat.id}
                            onPress={() => handleCategoryPress(cat.screen)}
                            accessibilityLabel={t(cat.labelKey)}
                            accessibilityRole="button"
                            testID={`wellness-resources-home-category-${cat.id}`}
                            style={styles.categoryTouchable}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.categoryContent}>
                                    <View style={styles.categoryIconCircle}>
                                        <Ionicons name={cat.icon} size={28} color={colors.journeys.health.primary} />
                                    </View>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="semiBold"
                                        journey="health"
                                        style={styles.categoryLabel}
                                    >
                                        {t(cat.labelKey)}
                                    </Text>
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Featured Content */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.wellnessResources.home.featured')}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredScroll}
                    >
                        {MOCK_FEATURED.map((item) => (
                            <Touchable
                                key={item.id}
                                onPress={() => handleFeaturedPress(item)}
                                accessibilityLabel={item.title}
                                accessibilityRole="button"
                                testID={`wellness-resources-home-featured-${item.id}`}
                            >
                                <View style={styles.featuredCard}>
                                    <View style={styles.featuredImagePlaceholder}>
                                        <Ionicons
                                            name={CATEGORY_ICON_MAP[item.category]}
                                            size={32}
                                            color={colors.journeys.health.primary}
                                        />
                                    </View>
                                    <View style={styles.featuredInfo}>
                                        <View style={styles.featuredCategoryBadge}>
                                            <Text fontSize="xs" color={colors.journeys.health.primary}>
                                                {item.category}
                                            </Text>
                                        </View>
                                        <Text fontSize="sm" fontWeight="semiBold" numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[50]}>
                                            {item.readTime}
                                        </Text>
                                    </View>
                                </View>
                            </Touchable>
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Activity */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.wellnessResources.home.recentActivity')}
                    </Text>
                    {MOCK_RECENT.map((item) => (
                        <Touchable
                            key={item.id}
                            onPress={() => handleRecentPress(item)}
                            accessibilityLabel={item.title}
                            accessibilityRole="button"
                            testID={`wellness-resources-home-recent-${item.id}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.recentRow}>
                                    <View style={styles.recentIconCircle}>
                                        <Ionicons name={item.icon} size={20} color={colors.journeys.health.primary} />
                                    </View>
                                    <View style={styles.recentTextCol}>
                                        <Text fontSize="md" fontWeight="semiBold" numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[50]}>
                                            {item.subtitle}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={colors.gray[40]} />
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Search Shortcut */}
                <View style={styles.searchContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => navigation.navigate('HealthWellnessResourcesArticleList')}
                        accessibilityLabel={t('journeys.health.wellnessResources.home.searchAll')}
                        testID="wellness-resources-home-search-button"
                    >
                        {t('journeys.health.wellnessResources.home.searchAll')}
                    </Button>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    categoriesRow: {
        flexDirection: 'row',
        gap: spacingValues.sm,
        marginBottom: spacingValues.md,
    },
    categoryTouchable: {
        flex: 1,
    },
    categoryContent: {
        alignItems: 'center',
        gap: spacingValues.xs,
    },
    categoryIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryLabel: {
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    featuredScroll: {
        gap: spacingValues.sm,
    },
    featuredCard: {
        width: 200,
        borderRadius: 12,
        backgroundColor: colors.gray[0],
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gray[10],
    },
    featuredImagePlaceholder: {
        width: 200,
        height: 120,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuredInfo: {
        padding: spacingValues.sm,
        gap: spacingValues['4xs'],
    },
    featuredCategoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacingValues.xs,
        paddingVertical: spacingValues['4xs'],
        borderRadius: 4,
        backgroundColor: colors.journeys.health.background,
    },
    recentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    recentIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTextCol: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    searchContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default WellnessResourcesHome;
