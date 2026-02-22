import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Types ---

type DocCategory = 'all' | 'cards' | 'guides' | 'policies';

interface InsuranceDocument {
  id: string;
  name: string;
  category: Exclude<DocCategory, 'all'>;
  date: string;
  size: string;
}

interface FilterTab {
  key: DocCategory;
  labelKey: string;
}

// --- Constants ---

const FILTER_TABS: FilterTab[] = [
  { key: 'all', labelKey: 'settings.insuranceDocs.filters.all' },
  { key: 'cards', labelKey: 'settings.insuranceDocs.filters.cards' },
  { key: 'guides', labelKey: 'settings.insuranceDocs.filters.guides' },
  { key: 'policies', labelKey: 'settings.insuranceDocs.filters.policies' },
];

const MOCK_DOCUMENTS: InsuranceDocument[] = [
  {
    id: 'doc-1',
    name: 'Carteirinha Digital',
    category: 'cards',
    date: '15/01/2024',
    size: '245 KB',
  },
  {
    id: 'doc-2',
    name: 'Guia Medica 2024',
    category: 'guides',
    date: '01/01/2024',
    size: '2.1 MB',
  },
  {
    id: 'doc-3',
    name: 'Tabela de Coberturas',
    category: 'policies',
    date: '01/01/2024',
    size: '1.5 MB',
  },
  {
    id: 'doc-4',
    name: 'Carta de Carencia',
    category: 'policies',
    date: '15/02/2024',
    size: '890 KB',
  },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.md};
`;

const FilterContainer = styled.View`
  flex-direction: row;
  padding-horizontal: ${spacing.xl};
  padding-bottom: ${spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const FilterTabButton = styled.TouchableOpacity<{ isActive: boolean }>`
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.xs};
  margin-right: ${spacing.xs};
  border-bottom-width: 2px;
  border-bottom-color: ${({ isActive }) =>
    isActive ? colors.brand.primary : 'transparent'};
`;

const FilterTabText = styled.Text<{ isActive: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${({ isActive }) =>
    isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular};
  color: ${({ isActive }) =>
    isActive ? colors.brand.primary : colors.gray[50]};
`;

const DocumentCard = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.sm};
  padding: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const DocIconContainer = styled.View`
  width: ${sizing.component.md};
  height: ${sizing.component.md};
  border-radius: ${borderRadius.md};
  background-color: ${colors.journeys.plan.background};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const DocIconText = styled.Text`
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.journeys.plan.primary};
`;

const DocInfo = styled.View`
  flex: 1;
`;

const DocName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing['3xs']};
`;

const DocMeta = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DocDate = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const DocSeparator = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-horizontal: ${spacing['3xs']};
`;

const DocSize = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const DownloadButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  border-radius: ${borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  align-items: center;
  justify-content: center;
`;

const DownloadIcon = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.brand.primary};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['3xl']};
  margin-top: ${spacing['3xl']};
`;

const EmptyText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

const CategoryIcon: Record<Exclude<DocCategory, 'all'>, string> = {
  cards: 'ID',
  guides: 'GU',
  policies: 'PO',
};

/**
 * InsuranceDocs screen -- displays insurance plan documents with category filters.
 * Filterable list of documents with name, date, size, and download action.
 */
export const InsuranceDocsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<DocCategory>('all');

  const filteredDocs = useMemo(() => {
    if (activeFilter === 'all') {
      return MOCK_DOCUMENTS;
    }
    return MOCK_DOCUMENTS.filter((doc) => doc.category === activeFilter);
  }, [activeFilter]);

  const handleDownload = useCallback(
    (doc: InsuranceDocument) => {
      Alert.alert(
        t('settings.insuranceDocs.download'),
        doc.name,
      );
    },
    [t],
  );

  const renderDocument = useCallback(
    ({ item }: { item: InsuranceDocument }) => (
      <DocumentCard>
        <DocIconContainer>
          <DocIconText>{CategoryIcon[item.category]}</DocIconText>
        </DocIconContainer>

        <DocInfo>
          <DocName numberOfLines={1}>{item.name}</DocName>
          <DocMeta>
            <DocDate>{item.date}</DocDate>
            <DocSeparator>|</DocSeparator>
            <DocSize>{item.size}</DocSize>
          </DocMeta>
        </DocInfo>

        <DownloadButton
          onPress={() => handleDownload(item)}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.insuranceDocs.download')} ${item.name}`}
          testID={`doc-download-${item.id}`}
        >
          <DownloadIcon accessibilityElementsHidden>DL</DownloadIcon>
        </DownloadButton>
      </DocumentCard>
    ),
    [handleDownload, t],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyText>{t('settings.insuranceDocs.empty')}</EmptyText>
      </EmptyContainer>
    ),
    [t],
  );

  return (
    <Container>
      <Title>{t('settings.insuranceDocs.title')}</Title>

      <FilterContainer>
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <FilterTabButton
              key={tab.key}
              isActive={isActive}
              onPress={() => setActiveFilter(tab.key)}
              accessibilityRole="tab"
              accessibilityLabel={t(tab.labelKey)}
              accessibilityState={{ selected: isActive }}
              testID={`doc-filter-${tab.key}`}
            >
              <FilterTabText isActive={isActive}>
                {t(tab.labelKey)}
              </FilterTabText>
            </FilterTabButton>
          );
        })}
      </FilterContainer>

      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={renderDocument}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        testID="insurance-docs-list"
      />
    </Container>
  );
};

export default InsuranceDocsScreen;
