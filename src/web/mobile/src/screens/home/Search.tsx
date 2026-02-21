import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import { useTranslation } from 'react-i18next';

/**
 * Tipos de filtro de busca
 */
type SearchFilter = 'all' | 'doctors' | 'medications' | 'articles';

/**
 * Interface para buscas recentes
 */
interface RecentSearch {
  id: string;
  query: string;
  filter: SearchFilter;
  timestamp: number;
}

/**
 * Sugestoes de busca pre-definidas
 */
const SEARCH_SUGGESTIONS: string[] = [
  'Cardiologista',
  'Pediatra',
  'Dermatologista',
  'Paracetamol',
  'Ibuprofeno',
  'Pressao arterial',
  'Diabetes',
  'Vacinas',
  'Exame de sangue',
  'Nutricionista',
];

/**
 * Abas de filtro disponiveis
 */
const FILTER_TABS: { key: SearchFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'searchScreens.filterAll' },
  { key: 'doctors', labelKey: 'searchScreens.filterDoctors' },
  { key: 'medications', labelKey: 'searchScreens.filterMedications' },
  { key: 'articles', labelKey: 'searchScreens.filterArticles' },
];

/**
 * Tela de busca do AUSTA SuperApp.
 * Permite buscar medicos, medicamentos e artigos com filtros,
 * buscas recentes e sugestoes.
 */
export const SearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: '1', query: 'Cardiologista', filter: 'doctors', timestamp: Date.now() - 86400000 },
    { id: '2', query: 'Paracetamol', filter: 'medications', timestamp: Date.now() - 172800000 },
    { id: '3', query: 'Pressao arterial', filter: 'articles', timestamp: Date.now() - 259200000 },
  ]);

  // Submeter busca
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    // Adicionar a buscas recentes
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      filter: activeFilter,
      timestamp: Date.now(),
    };
    setRecentSearches((prev) => [newSearch, ...prev.filter((s) => s.query !== query.trim()).slice(0, 9)]);

    // Navegar para resultados
    navigation.navigate(ROUTES.SEARCH_RESULTS as never, {
      query: query.trim(),
      filter: activeFilter,
    } as never);
  }, [query, activeFilter, navigation]);

  // Busca rapida a partir de sugestao ou recente
  const handleQuickSearch = useCallback(
    (searchQuery: string, filter?: SearchFilter) => {
      setQuery(searchQuery);
      navigation.navigate(ROUTES.SEARCH_RESULTS as never, {
        query: searchQuery,
        filter: filter || activeFilter,
      } as never);
    },
    [activeFilter, navigation],
  );

  // Limpar buscas recentes
  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Remover busca recente individual
  const handleRemoveRecent = useCallback((id: string) => {
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={t('common.placeholders.search')}
            placeholderTextColor={colors.gray[40]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoFocus
            accessibilityLabel="Campo de busca"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              style={styles.clearButton}
              accessibilityLabel={t('searchScreens.clearSearch')}
            >
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Abas de filtro */}
      <View style={styles.filterContainer}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Buscas recentes */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('searchScreens.recentSearches')}</Text>
              <TouchableOpacity onPress={handleClearRecent} accessibilityRole="button">
                <Text style={styles.clearAllText}>{t('searchScreens.clearAll')}</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentItem}
                onPress={() => handleQuickSearch(item.query, item.filter)}
                accessibilityRole="button"
              >
                <Text style={styles.recentIcon}>🕐</Text>
                <Text style={styles.recentText}>{item.query}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveRecent(item.id)}
                  style={styles.removeButton}
                  accessibilityLabel={`Remover ${item.query} das buscas recentes`}
                >
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sugestoes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('searchScreens.suggestions')}</Text>
          <View style={styles.suggestionsGrid}>
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestionChip}
                onPress={() => handleQuickSearch(suggestion)}
                accessibilityRole="button"
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  searchContainer: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[10],
    borderRadius: borderRadiusValues.md,
    paddingHorizontal: spacingValues.sm,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacingValues.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizeValues.md,
    color: colors.gray[70],
    fontFamily: typography.fontFamily.body,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[30],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: colors.neutral.white,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  filterTab: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    marginRight: spacingValues.xs,
  },
  filterTabActive: {
    backgroundColor: colors.brand.primary + '15',
  },
  filterTabText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: colors.gray[50],
  },
  filterTabTextActive: {
    color: colors.brand.primary,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  section: {
    marginBottom: spacingValues.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  sectionTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
    color: colors.gray[70],
  },
  clearAllText: {
    fontSize: fontSizeValues.sm,
    color: colors.brand.primary,
    fontWeight: String(typography.fontWeight.medium) as '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[10],
  },
  recentIcon: {
    fontSize: 14,
    marginRight: spacingValues.sm,
  },
  recentText: {
    flex: 1,
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray[20],
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 10,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: colors.gray[50],
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
    marginTop: spacingValues.xs,
  },
  suggestionChip: {
    backgroundColor: colors.gray[10],
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    borderWidth: 1,
    borderColor: colors.gray[20],
  },
  suggestionText: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
    fontWeight: String(typography.fontWeight.medium) as '500',
  },
});

export default SearchScreen;
