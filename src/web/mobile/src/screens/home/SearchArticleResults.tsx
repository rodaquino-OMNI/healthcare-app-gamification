import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Types ---

interface ArticleResult {
  id: string;
  title: string;
  source: string;
  readTime: number;
  category: string;
  thumbnailColor: string;
}

// --- Mock Data ---

const MOCK_ARTICLES: ArticleResult[] = [
  {
    id: 'a1',
    title: 'Como controlar a pressao arterial no dia a dia',
    source: 'Ministerio da Saude',
    readTime: 5,
    category: 'Saude',
    thumbnailColor: colors.journeys.health.primary,
  },
  {
    id: 'a2',
    title: 'Alimentacao equilibrada para diabeticos',
    source: 'Sociedade Brasileira de Diabetes',
    readTime: 8,
    category: 'Nutricao',
    thumbnailColor: colors.journeys.care.primary,
  },
  {
    id: 'a3',
    title: 'Importancia das vacinas em adultos',
    source: 'Fiocruz',
    readTime: 4,
    category: 'Prevencao',
    thumbnailColor: colors.brand.primary,
  },
  {
    id: 'a4',
    title: 'Exercicios fisicos para a saude cardiovascular',
    source: 'Sociedade Brasileira de Cardiologia',
    readTime: 6,
    category: 'Exercicio',
    thumbnailColor: colors.journeys.health.primary,
  },
  {
    id: 'a5',
    title: 'Saude mental: sinais de alerta e quando buscar ajuda',
    source: 'CVV - Centro de Valorizacao da Vida',
    readTime: 7,
    category: 'Bem-estar',
    thumbnailColor: colors.journeys.plan.primary,
  },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.default};
`;

const BackButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.xs};
`;

const BackText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const ResultCount = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const ArticleCard = styled.TouchableOpacity`
  flex-direction: row;
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-top: ${spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const Thumbnail = styled.View<{ bgColor: string }>`
  width: 72px;
  height: 72px;
  border-radius: ${borderRadius.md};
  background-color: ${(props) => props.bgColor + '20'};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const ThumbnailEmoji = styled.Text`
  font-size: 28px;
`;

const ArticleInfo = styled.View`
  flex: 1;
`;

const CategoryBadge = styled.View`
  align-self: flex-start;
  background-color: ${colors.journeys.plan.background};
  padding-horizontal: ${spacing.xs};
  padding-vertical: ${spacing['4xs']};
  border-radius: ${borderRadius.xs};
  margin-bottom: ${spacing['3xs']};
`;

const CategoryText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.journeys.plan.primary};
`;

const ArticleTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing['3xs']};
`;

const SourceRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing['4xs']};
`;

const SourceText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Dot = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-horizontal: ${spacing['3xs']};
`;

const ReadTime = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['3xl']};
`;

const EmptyText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-top: ${spacing.md};
`;

// --- Component ---

/**
 * SearchArticleResults -- Displays article search results as a FlatList.
 * Each card shows thumbnail placeholder, title, source, read time, and category badge.
 */
export const SearchArticleResults: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleArticlePress = useCallback((_articleId: string) => {
    // TODO: Navigate to article detail when route is available
  }, []);

  const renderArticleItem = useCallback(
    ({ item }: { item: ArticleResult }) => (
      <ArticleCard
        onPress={() => handleArticlePress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.source}, ${item.readTime} ${t('search.articleResults.minRead')}`}
        testID={`article-card-${item.id}`}
      >
        <Thumbnail bgColor={item.thumbnailColor}>
          <ThumbnailEmoji>{'\u{1F4F0}'}</ThumbnailEmoji>
        </Thumbnail>
        <ArticleInfo>
          <CategoryBadge>
            <CategoryText testID={`article-category-${item.id}`}>
              {item.category}
            </CategoryText>
          </CategoryBadge>
          <ArticleTitle
            numberOfLines={2}
            testID={`article-title-${item.id}`}
          >
            {item.title}
          </ArticleTitle>
          <SourceRow>
            <SourceText testID={`article-source-${item.id}`}>
              {item.source}
            </SourceText>
            <Dot>{'\u2022'}</Dot>
            <ReadTime testID={`article-readtime-${item.id}`}>
              {item.readTime} {t('search.articleResults.minRead')}
            </ReadTime>
          </SourceRow>
        </ArticleInfo>
      </ArticleCard>
    ),
    [handleArticlePress, t],
  );

  const keyExtractor = useCallback((item: ArticleResult) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyText testID="article-results-empty">
          {t('search.articleResults.empty')}
        </EmptyText>
      </EmptyContainer>
    ),
    [t],
  );

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="article-results-back"
        >
          <BackText>{'\u2190'}</BackText>
        </BackButton>
        <HeaderTitle testID="article-results-title">
          {t('search.articleResults.title')}
        </HeaderTitle>
        <ResultCount testID="article-results-count">
          {MOCK_ARTICLES.length} {t('search.articleResults.found')}
        </ResultCount>
      </Header>

      <FlatList
        data={MOCK_ARTICLES}
        renderItem={renderArticleItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacingValues['3xl'],
        }}
        testID="article-results-list"
      />
    </Container>
  );
};

export default SearchArticleResults;
