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
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';

/**
 * Tipos de filtro de busca
 */
type SearchFilter = 'all' | 'doctors' | 'medications' | 'articles';

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
 * Interface para resultado de medico
 */
interface DoctorResult {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  availableDate: string;
}

/**
 * Interface para resultado de medicamento
 */
interface MedicationResult {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: string;
}

/**
 * Interface para resultado de artigo
 */
interface ArticleResult {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
}

/**
 * Dados mock de medicos
 */
const MOCK_DOCTORS: DoctorResult[] = [
  { id: 'd1', name: 'Dra. Ana Silva', specialty: 'Cardiologista', rating: 4.8, reviewCount: 127, availableDate: 'Disponivel amanha' },
  { id: 'd2', name: 'Dr. Carlos Mendes', specialty: 'Clinico Geral', rating: 4.6, reviewCount: 89, availableDate: 'Disponivel hoje' },
  { id: 'd3', name: 'Dra. Maria Santos', specialty: 'Dermatologista', rating: 4.9, reviewCount: 203, availableDate: 'Disponivel em 3 dias' },
  { id: 'd4', name: 'Dr. Paulo Oliveira', specialty: 'Pediatra', rating: 4.7, reviewCount: 156, availableDate: 'Disponivel amanha' },
];

/**
 * Dados mock de medicamentos
 */
const MOCK_MEDICATIONS: MedicationResult[] = [
  { id: 'm1', name: 'Paracetamol', dosage: '500mg', frequency: 'A cada 6 horas', category: 'Analgesico' },
  { id: 'm2', name: 'Ibuprofeno', dosage: '400mg', frequency: 'A cada 8 horas', category: 'Anti-inflamatorio' },
  { id: 'm3', name: 'Losartana', dosage: '50mg', frequency: '1x ao dia', category: 'Anti-hipertensivo' },
  { id: 'm4', name: 'Metformina', dosage: '850mg', frequency: '2x ao dia', category: 'Antidiabetico' },
];

/**
 * Dados mock de artigos
 */
const MOCK_ARTICLES: ArticleResult[] = [
  { id: 'a1', title: 'Como controlar a pressao arterial', summary: 'Dicas praticas para manter sua pressao arterial em niveis saudaveis no dia a dia.', readTime: '5 min', category: 'Saude' },
  { id: 'a2', title: 'Alimentacao para diabeticos', summary: 'Guia completo sobre alimentacao adequada para quem convive com diabetes.', readTime: '8 min', category: 'Nutricao' },
  { id: 'a3', title: 'Importancia das vacinas', summary: 'Entenda por que manter o calendario vacinal em dia e essencial para sua saude.', readTime: '4 min', category: 'Prevencao' },
  { id: 'a4', title: 'Exercicios para o coracao', summary: 'Os melhores exercicios fisicos para manter a saude cardiovascular.', readTime: '6 min', category: 'Exercicio' },
];

/**
 * Abas de filtro
 */
const FILTER_TABS: { key: SearchFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'doctors', label: 'Medicos' },
  { key: 'medications', label: 'Medicamentos' },
  { key: 'articles', label: 'Artigos' },
];

/**
 * Renderiza estrelas de avaliacao
 */
const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  if (halfStar) stars += '½';
  return stars;
};

/**
 * Tela de resultados de busca do AUSTA SuperApp.
 * Exibe resultados categorizados por medicos, medicamentos e artigos
 * com dados mock e estados de vazio/carregamento.
 */
export const SearchResultsScreen: React.FC = () => {
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

  // Renderizar card de medico
  const renderDoctorCard = (doctor: DoctorResult) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.resultCard}
      onPress={() => navigation.navigate(ROUTES.CARE_APPOINTMENTS as never)}
      accessibilityRole="button"
      accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}
    >
      <View style={styles.doctorRow}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.journeys.care.background }]}>
          <Text style={[styles.avatarText, { color: colors.journeys.care.primary }]}>
            {doctor.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>{renderStars(doctor.rating)}</Text>
            <Text style={styles.ratingText}>
              {doctor.rating} ({doctor.reviewCount} avaliacoes)
            </Text>
          </View>
          <Text style={styles.availableText}>{doctor.availableDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Renderizar card de medicamento
  const renderMedicationCard = (medication: MedicationResult) => (
    <TouchableOpacity
      key={medication.id}
      style={styles.resultCard}
      onPress={() => navigation.navigate(ROUTES.CARE_MEDICATION_TRACKING as never)}
      accessibilityRole="button"
      accessibilityLabel={`${medication.name}, ${medication.dosage}`}
    >
      <View style={styles.medicationRow}>
        <View style={[styles.medicationIcon, { backgroundColor: colors.journeys.health.background }]}>
          <Text style={styles.medicationIconText}>{'💊'}</Text>
        </View>
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationDosage}>{medication.dosage}</Text>
          <Text style={styles.medicationFrequency}>{medication.frequency}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.journeys.health.background }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.journeys.health.primary }]}>
              {medication.category}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Renderizar card de artigo
  const renderArticleCard = (article: ArticleResult) => (
    <TouchableOpacity
      key={article.id}
      style={styles.resultCard}
      accessibilityRole="button"
      accessibilityLabel={article.title}
    >
      <View style={styles.articleContent}>
        <View style={styles.articleImagePlaceholder}>
          <Text style={styles.articleImageText}>{'📰'}</Text>
        </View>
        <View style={styles.articleInfo}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.journeys.plan.background }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.journeys.plan.primary }]}>
              {article.category}
            </Text>
          </View>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.articleSummary} numberOfLines={2}>
            {article.summary}
          </Text>
          <Text style={styles.readTime}>{article.readTime} de leitura</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>{'🔍'}</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar medicos, medicamentos, artigos..."
            placeholderTextColor={colors.gray[40]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            accessibilityLabel="Campo de busca"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              style={styles.clearButton}
              accessibilityLabel="Limpar busca"
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
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Estado de carregamento */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
          <Text style={styles.loadingText}>Buscando resultados...</Text>
        </View>
      ) : !hasResults ? (
        /* Estado vazio */
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconPlaceholder}>
            <Text style={styles.emptyIconText}>{'🔍'}</Text>
          </View>
          <Text style={styles.emptyText}>
            Nenhum resultado para '{query}'
          </Text>
          <Text style={styles.emptySubtext}>
            Tente buscar com termos diferentes ou verifique a ortografia
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
                <Text style={styles.sectionTitle}>Medicos</Text>
                <Text style={styles.resultCount}>{filteredDoctors.length} encontrados</Text>
              </View>
              {filteredDoctors.map(renderDoctorCard)}
            </View>
          )}

          {/* Secao: Medicamentos */}
          {(activeFilter === 'all' || activeFilter === 'medications') && filteredMedications.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Medicamentos</Text>
                <Text style={styles.resultCount}>{filteredMedications.length} encontrados</Text>
              </View>
              {filteredMedications.map(renderMedicationCard)}
            </View>
          )}

          {/* Secao: Artigos */}
          {(activeFilter === 'all' || activeFilter === 'articles') && filteredArticles.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Artigos</Text>
                <Text style={styles.resultCount}>{filteredArticles.length} encontrados</Text>
              </View>
              {filteredArticles.map(renderArticleCard)}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[20],
  },
  backArrow: {
    marginRight: spacingValues.sm,
    paddingVertical: spacingValues['3xs'],
  },
  backArrowText: {
    fontSize: fontSizeValues.xl,
    color: colors.gray[60],
  },
  searchInputWrapper: {
    flex: 1,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
  },
  loadingText: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginTop: spacingValues.sm,
  },
  emptyIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[10],
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
    color: colors.gray[60],
    marginBottom: spacingValues.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[40],
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
    color: colors.gray[70],
  },
  resultCount: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
  },
  // Doctor card styles
  resultCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadiusValues.md,
    padding: spacingValues.md,
    marginBottom: spacingValues.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.gray[20],
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadiusValues.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingValues.sm,
  },
  avatarText: {
    fontSize: fontSizeValues.lg,
    fontWeight: String(typography.fontWeight.bold) as '700',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
    color: colors.gray[70],
    marginBottom: spacingValues['4xs'],
  },
  doctorSpecialty: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    marginBottom: spacingValues['3xs'],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  ratingStars: {
    fontSize: fontSizeValues.sm,
    color: colors.semantic.warning,
    marginRight: spacingValues['3xs'],
  },
  ratingText: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
  },
  availableText: {
    fontSize: fontSizeValues.xs,
    color: colors.journeys.care.primary,
    fontWeight: String(typography.fontWeight.medium) as '500',
  },
  // Medication card styles
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadiusValues.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingValues.sm,
  },
  medicationIconText: {
    fontSize: 22,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
    color: colors.gray[70],
    marginBottom: spacingValues['4xs'],
  },
  medicationDosage: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[60],
    marginBottom: spacingValues['4xs'],
  },
  medicationFrequency: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
    marginBottom: spacingValues['3xs'],
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
    borderRadius: borderRadiusValues.xs,
  },
  categoryBadgeText: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(typography.fontWeight.medium) as '500',
  },
  // Article card styles
  articleContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  articleImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: borderRadiusValues.md,
    backgroundColor: colors.gray[10],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingValues.sm,
  },
  articleImageText: {
    fontSize: 28,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
    color: colors.gray[70],
    marginTop: spacingValues['3xs'],
    marginBottom: spacingValues['3xs'],
  },
  articleSummary: {
    fontSize: fontSizeValues.sm,
    color: colors.gray[50],
    lineHeight: fontSizeValues.sm * typography.lineHeight.base,
    marginBottom: spacingValues['3xs'],
  },
  readTime: {
    fontSize: fontSizeValues.xs,
    color: colors.gray[40],
  },
});

export default SearchResultsScreen;
