import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import { useTranslation } from 'react-i18next';

import { SearchFilter, FilterPanel } from './SearchResultsFilterPanel';
import {
  DoctorResult,
  MedicationResult,
  ArticleResult,
  MOCK_DOCTORS,
  MOCK_MEDICATIONS,
  MOCK_ARTICLES,
  DoctorCard,
  MedicationCard,
  ArticleCard,
} from './SearchResultsCard';

/**
 * Parametros da rota de resultados de busca
 */
type SearchResultsParams = {
  SearchResults: {
    query: string;
    filter: SearchFilter;
  };
};

/**
 * Tela de resultados de busca do AUSTA SuperApp.
 * Exibe resultados categorizados por medicos, medicamentos e artigos
 * com dados mock e estados de vazio/carregamento.
 */
export const SearchResultsScreen: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SearchResultsParams, 'SearchResults'>>();
  const { query: initialQuery, filter: initialFilter } = route.params;

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<SearchFilter>(initialFilter || 'all');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar resultados baseado na query (busca simples por substring)
  const filteredDoctors = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_DOCTORS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredMedications = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_MEDICATIONS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredArticles = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [query]);

  // Verificar se ha resultados
  const hasResults = useMemo(() => {
    switch (activeFilter) {
      case 'doctors':
        return filteredDoctors.length > 0;
      case 'medications':
        return filteredMedications.length > 0;
      case 'articles':
        return filteredArticles.length > 0;
      default:
        return (
          filteredDoctors.length > 0 ||
          filteredMedications.length > 0 ||
          filteredArticles.length > 0
        );
    }
  }, [activeFilter, filteredDoctors, filteredMedications, filteredArticles]);

  // Submeter nova busca
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setIsLoading(true);
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 500);
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
          accessibilityRole="button"
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrowText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>{'\uD83D\uDD0D'}</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={t('common.placeholders.search')}
            placeholderTextColor={colors.gray[40]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
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
      <FilterPanel activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Estado de carregamento */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
          <Text style={styles.loadingText}>{t('searchScreens.searching')}</Text>
        </View>
      ) : !hasResults ? (
        /* Estado vazio */
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconPlaceholder}>
            <Text style={styles.emptyIconText}>{'\uD83D\uDD0D'}</Text>
          </View>
          <Text style={styles.emptyText}>
            {t('searchScreens.noResults', { query })}
          </Text>
          <Text style={styles.emptySubtext}>
            {t('searchScreens.noResultsHint')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Secao: Medicos */}
          {(activeFilter === 'all' || activeFilter === 'doctors') && filteredDoctors.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('searchScreens.doctorResults.title')}</Text>
                <Text style={styles.resultCount}>{t('searchScreens.found', { count: filteredDoctors.length })}</Text>
              </View>
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => navigation.navigate(ROUTES.CARE_APPOINTMENTS as never)}
                />
              ))}
            </View>
          )}

          {/* Secao: Medicamentos */}
          {(activeFilter === 'all' || activeFilter === 'medications') && filteredMedications.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('searchScreens.medicationResults.title')}</Text>
                <Text style={styles.resultCount}>{t('searchScreens.found', { count: filteredMedications.length })}</Text>
              </View>
              {filteredMedications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onPress={() => navigation.navigate(ROUTES.CARE_MEDICATION_TRACKING as never)}
                />
              ))}
            </View>
          )}

          {/* Secao: Artigos */}
          {(activeFilter === 'all' || activeFilter === 'articles') && filteredArticles.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('searchScreens.articleResults.title')}</Text>
                <Text style={styles.resultCount}>{t('searchScreens.found', { count: filteredArticles.length })}</Text>
              </View>
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backArrow: {
    marginRight: spacingValues.sm,
    paddingVertical: spacingValues['3xs'],
  },
  backArrowText: {
    fontSize: fontSizeValues.xl,
    color: theme.colors.text.default,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.subtle,
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
    color: theme.colors.text.default,
    fontFamily: typography.fontFamily.body,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.border.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.onBrand,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
  },
  loadingText: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.muted,
    marginTop: spacingValues.sm,
  },
  emptyIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingValues.md,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: fontSizeValues.lg,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.default,
    marginBottom: spacingValues.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.subtle,
    textAlign: 'center',
    lineHeight: fontSizeValues.sm * typography.lineHeight.base,
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
    color: theme.colors.text.default,
  },
  resultCount: {
    fontSize: fontSizeValues.xs,
    color: theme.colors.text.subtle,
  },
});

export default SearchResultsScreen;
