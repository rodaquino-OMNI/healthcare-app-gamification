import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type Filter = 'All' | 'Fitness' | 'Nutrition' | 'Mental Health';
const FILTERS: Filter[] = ['All', 'Fitness', 'Nutrition', 'Mental Health'];

const ARTICLES = [
  { id: 'a1', title: 'Building a Consistent Exercise Habit', category: 'Fitness', readTime: '6 min', summary: 'Learn evidence-based strategies to make exercise a daily routine.' },
  { id: 'a2', title: 'Understanding Macronutrients', category: 'Nutrition', readTime: '8 min', summary: 'A comprehensive guide to proteins, carbs, and fats in your diet.' },
  { id: 'a3', title: 'Managing Daily Stress', category: 'Mental Health', readTime: '5 min', summary: 'Practical techniques for reducing stress and improving well-being.' },
  { id: 'a4', title: 'Stretching for Office Workers', category: 'Fitness', readTime: '4 min', summary: 'Simple stretches you can do at your desk throughout the day.' },
  { id: 'a5', title: 'Healthy Snacking Strategies', category: 'Nutrition', readTime: '5 min', summary: 'Smart snack choices that fuel your body between meals.' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: spacing.xs,
  border: `1px solid ${colors.gray[20]}`, borderRadius: '8px',
  fontSize: '14px', color: colors.gray[60],
};

const ArticleListPage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = ARTICLES.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || a.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/wellness-resources')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to wellness resources"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Articles
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
        Expert-written health and wellness articles
      </Text>

      <input
        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search articles..." aria-label="Search articles" style={{ ...inputStyle, marginBottom: spacing.md }}
      />

      <Box display="flex" style={{ gap: spacing.xs, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'secondary'} journey="health" onPress={() => setFilter(f)} accessibilityLabel={`Filter by ${f}`}>
            {f}
          </Button>
        ))}
      </Box>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {filtered.map((article) => (
          <Card key={article.id} journey="health" elevation="sm" padding="md" style={{ cursor: 'pointer' }} onClick={() => router.push(`/health/wellness-resources/${article.id}`)}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing['3xs'] }}>
              <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>{article.category}</Text>
              <Text fontSize="xs" color={colors.gray[40]}>{article.readTime}</Text>
            </Box>
            <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.text}>{article.title}</Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>{article.summary}</Text>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Text fontSize="sm" color={colors.gray[40]} style={{ textAlign: 'center', padding: spacing.xl }}>
            No articles found matching your criteria.
          </Text>
        )}
      </div>
    </div>
  );
};

export default ArticleListPage;
