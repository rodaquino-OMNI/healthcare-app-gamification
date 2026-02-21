import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Avatar } from 'src/web/design-system/src/components/Avatar/Avatar';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Touchable } from 'src/web/design-system/src/primitives/Touchable/Touchable';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { LoadingIndicator } from 'src/web/mobile/src/components/shared/LoadingIndicator';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';

/**
 * Doctor data interface for search results
 */
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  available: boolean;
  photoUrl?: string;
  price: string;
}

/**
 * Mock doctor data for the search results list.
 */
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dra. Ana Carolina Silva',
    specialty: 'Cardiologia',
    rating: 4.9,
    distance: '1.2 km',
    available: true,
    price: 'R$ 350',
  },
  {
    id: 'doc-002',
    name: 'Dr. Ricardo Mendes',
    specialty: 'Dermatologia',
    rating: 4.7,
    distance: '2.5 km',
    available: true,
    price: 'R$ 280',
  },
  {
    id: 'doc-003',
    name: 'Dra. Juliana Costa',
    specialty: 'Pediatria',
    rating: 4.8,
    distance: '3.1 km',
    available: false,
    price: 'R$ 300',
  },
  {
    id: 'doc-004',
    name: 'Dr. Fernando Alves',
    specialty: 'Ortopedia',
    rating: 4.6,
    distance: '4.0 km',
    available: true,
    price: 'R$ 400',
  },
  {
    id: 'doc-005',
    name: 'Dra. Mariana Rocha',
    specialty: 'Neurologia',
    rating: 4.5,
    distance: '5.3 km',
    available: true,
    price: 'R$ 450',
  },
  {
    id: 'doc-006',
    name: 'Dra. Beatriz Santos',
    specialty: 'Ginecologia',
    rating: 4.8,
    distance: '1.8 km',
    available: true,
    price: 'R$ 320',
  },
  {
    id: 'doc-007',
    name: 'Dr. Carlos Eduardo Lima',
    specialty: 'Cardiologia',
    rating: 4.4,
    distance: '6.2 km',
    available: false,
    price: 'R$ 380',
  },
];

const SPECIALTIES = [
  'Todos',
  'Cardiologia',
  'Dermatologia',
  'Ortopedia',
  'Pediatria',
  'Neurologia',
  'Ginecologia',
];

const SORT_OPTIONS = [
  { label: 'Relevancia', value: 'relevancia' },
  { label: 'Avaliacao', value: 'avaliacao' },
  { label: 'Distancia', value: 'distancia' },
  { label: 'Preco', value: 'preco' },
];

/**
 * Renders a star rating as text characters.
 */
const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '\u2605'.repeat(fullStars) + (halfStar ? '\u2606' : '') + '\u2606'.repeat(emptyStars);
};

/**
 * DoctorSearch screen allows users to search for doctors by name or specialty,
 * filter by specialty tabs, sort results, and toggle between list and map views.
 *
 * Part of the Care Now journey (orange theme).
 */
const DoctorSearch: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(0);
  const [sortBy, setSortBy] = useState('relevancia');
  const [isMapView, setIsMapView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Filters doctors based on search query and selected specialty.
   */
  const getFilteredDoctors = useCallback((): Doctor[] => {
    let filtered = [...MOCK_DOCTORS];

    // Filter by specialty (index 0 = Todos = show all)
    if (selectedSpecialty > 0) {
      const specialty = SPECIALTIES[selectedSpecialty];
      filtered = filtered.filter((doc) => doc.specialty === specialty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query)
      );
    }

    // Sort results
    switch (sortBy) {
      case 'avaliacao':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distancia':
        filtered.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
        );
        break;
      case 'preco':
        filtered.sort(
          (a, b) =>
            parseInt(a.price.replace(/\D/g, ''), 10) -
            parseInt(b.price.replace(/\D/g, ''), 10)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedSpecialty, sortBy]);

  const filteredDoctors = getFilteredDoctors();

  /**
   * Navigates to the doctor profile screen.
   */
  const handleViewProfile = (doctorId: string) => {
    navigation.navigate(ROUTES.CARE_DOCTOR_PROFILE, { doctorId });
  };

  /**
   * Navigates to the filters screen.
   */
  const handleOpenFilters = () => {
    navigation.navigate(ROUTES.CARE_DOCTOR_FILTERS);
  };

  /**
   * Renders a single doctor result card.
   */
  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <Card
      journey="care"
      elevation="sm"
      padding="md"
      accessibilityLabel={`${item.name}, ${item.specialty}, avaliacao ${item.rating}`}
    >
      <View style={styles.doctorRow}>
        <Avatar
          name={item.name}
          journey="care"
          size="56px"
          fallbackType="initials"
        />
        <View style={styles.doctorInfo}>
          <Text fontWeight="medium" fontSize="md">
            {item.name}
          </Text>
          <View style={styles.specialtyRow}>
            <Badge journey="care" size="sm">
              {item.specialty}
            </Badge>
            {item.available ? (
              <Badge variant="status" status="success" size="sm">
                Disponivel
              </Badge>
            ) : (
              <Badge variant="status" status="neutral" size="sm">
                Indisponivel
              </Badge>
            )}
          </View>
          <View style={styles.detailsRow}>
            <Text fontSize="sm" color={colors.journeys.care.primary}>
              {renderStars(item.rating)} {item.rating}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray700}>
              {item.distance}
            </Text>
            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.accent}>
              {item.price}
            </Text>
          </View>
          <View style={styles.actionRow}>
            <Button
              variant="primary"
              size="sm"
              journey="care"
              onPress={() => handleViewProfile(item.id)}
              accessibilityLabel={`Ver perfil de ${item.name}`}
            >
              Ver Perfil
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );

  /**
   * Renders a map placeholder view.
   */
  const renderMapPlaceholder = () => (
    <View style={styles.mapPlaceholder}>
      <Text fontSize="lg" color={colors.neutral.gray500} textAlign="center">
        Mapa em breve
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
        Visualizacao no mapa sera disponibilizada em uma atualizacao futura.
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <JourneyHeader
        title="Buscar Medico"
        showBackButton
        rightActions={
          <TouchableOpacity
            onPress={handleOpenFilters}
            accessibilityLabel="Abrir filtros"
            style={styles.filterButton}
          >
            <Text fontSize="md" color="#FFFFFF" fontWeight="medium">
              Filtros
            </Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target?.value ?? e)}
          placeholder="Buscar por nome ou especialidade..."
          journey="care"
          type="search"
          aria-label="Buscar por nome ou especialidade"
          testID="doctor-search-input"
        />
      </View>

      {/* Specialty filter tabs (horizontal scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {SPECIALTIES.map((specialty, index) => (
          <TouchableOpacity
            key={specialty}
            onPress={() => setSelectedSpecialty(index)}
            style={[
              styles.tab,
              selectedSpecialty === index && styles.tabActive,
            ]}
            accessibilityLabel={`Filtrar por ${specialty}`}
            accessibilityState={{ selected: selectedSpecialty === index }}
          >
            <Text
              fontSize="sm"
              fontWeight={selectedSpecialty === index ? 'medium' : 'regular'}
              color={
                selectedSpecialty === index
                  ? colors.neutral.white
                  : colors.journeys.care.primary
              }
            >
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort and view toggle row */}
      <View style={styles.controlsRow}>
        <View style={styles.sortContainer}>
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(val) => setSortBy(val as string)}
            label="Ordenar"
            journey="care"
            testID="sort-select"
          />
        </View>
        <TouchableOpacity
          onPress={() => setIsMapView(!isMapView)}
          style={styles.viewToggle}
          accessibilityLabel={isMapView ? 'Mudar para lista' : 'Mudar para mapa'}
        >
          <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.primary}>
            {isMapView ? 'Lista' : 'Mapa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results area */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator journey="care" label="Buscando medicos..." />
        </View>
      ) : isMapView ? (
        renderMapPlaceholder()
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
                Nenhum medico encontrado.
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
                Tente ajustar sua busca ou filtros.
              </Text>
            </View>
          }
          testID="doctor-results-list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  searchContainer: {
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.md,
  },
  tabsContainer: {
    maxHeight: 48,
    marginTop: spacingValues.sm,
  },
  tabsContent: {
    paddingHorizontal: spacingValues.md,
    gap: spacingValues.xs,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xl,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.primary,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.sm,
    paddingBottom: spacingValues.xs,
  },
  sortContainer: {
    flex: 1,
    marginRight: spacingValues.sm,
  },
  viewToggle: {
    paddingVertical: spacingValues.xs,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
  },
  listContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  separator: {
    height: spacingValues.sm,
  },
  doctorRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  doctorInfo: {
    flex: 1,
  },
  specialtyRow: {
    flexDirection: 'row',
    gap: spacingValues.xs,
    marginTop: spacingValues['3xs'],
    flexWrap: 'wrap',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
    marginTop: spacingValues.xs,
    alignItems: 'center',
  },
  actionRow: {
    marginTop: spacingValues.sm,
    alignItems: 'flex-start',
  },
  filterButton: {
    paddingVertical: spacingValues['3xs'],
    paddingHorizontal: spacingValues.sm,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacingValues['3xl'],
  },
  emptyContainer: {
    paddingTop: spacingValues['3xl'],
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    margin: spacingValues.md,
    borderRadius: spacingValues.sm,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    padding: spacingValues['3xl'],
    gap: spacingValues.xs,
  },
});

export default DoctorSearch;
