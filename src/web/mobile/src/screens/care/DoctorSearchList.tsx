import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Avatar } from 'src/web/design-system/src/components/Avatar/Avatar';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { useTheme } from 'styled-components/native';
import type { Theme } from 'src/web/design-system/src/themes/base.theme';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Doctor data interface for search results
 */
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  available: boolean;
  photoUrl?: string;
  price: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

/**
 * Mock doctor data for the search results list.
 */
export const MOCK_DOCTORS: Doctor[] = [
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders a star rating as text characters.
 */
export const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '\u2605'.repeat(fullStars) + (halfStar ? '\u2606' : '') + '\u2606'.repeat(emptyStars);
};

// ---------------------------------------------------------------------------
// DoctorItem
// ---------------------------------------------------------------------------

interface DoctorItemProps {
  item: Doctor;
  onViewProfile: (id: string) => void;
}

/**
 * Renders a single doctor result card with avatar, details, and action button.
 */
export const DoctorItem: React.FC<DoctorItemProps> = ({ item, onViewProfile }) => {
  const { t } = useTranslation();
  return (
    <Card
      journey="care"
      elevation="sm"
      padding="md"
      accessibilityLabel={`${item.name}, ${item.specialty}, ${t('journeys.care.doctorSearch.rating')} ${item.rating}`}
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
                {t('journeys.care.doctorSearch.available')}
              </Badge>
            ) : (
              <Badge variant="status" status="neutral" size="sm">
                {t('journeys.care.doctorSearch.unavailable')}
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
              onPress={() => onViewProfile(item.id)}
              accessibilityLabel={t('journeys.care.doctorSearch.viewProfileOf', { name: item.name })}
            >
              {t('journeys.care.doctorSearch.viewProfile')}
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// MapPlaceholder
// ---------------------------------------------------------------------------

/**
 * Placeholder view for the upcoming map feature.
 */
export const MapPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.mapPlaceholder}>
      <Text fontSize="lg" color={colors.neutral.gray500} textAlign="center">
        {t('journeys.care.doctorSearch.mapComingSoon')}
      </Text>
      <Text fontSize="sm" color={colors.neutral.gray500} textAlign="center">
        {t('journeys.care.doctorSearch.mapComingSoonDesc')}
      </Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) => StyleSheet.create({
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
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    margin: spacingValues.md,
    borderRadius: spacingValues.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: spacingValues['3xl'],
    gap: spacingValues.xs,
  },
  emptyContainer: {
    paddingTop: spacingValues['3xl'],
    alignItems: 'center',
    gap: spacingValues.xs,
  },
});
