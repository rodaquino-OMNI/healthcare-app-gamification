import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing, sizingValues } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Types ---

interface DoctorResult {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: string;
  avatar: string;
}

// --- Mock Data ---

const MOCK_DOCTORS: DoctorResult[] = [
  {
    id: 'd1',
    name: 'Dra. Ana Silva',
    specialty: 'Cardiologista',
    rating: 4.8,
    reviewCount: 127,
    location: 'Hospital Central, Ala B',
    avatar: '\u{1F469}\u200D\u2695\uFE0F',
  },
  {
    id: 'd2',
    name: 'Dr. Carlos Mendes',
    specialty: 'Clinico Geral',
    rating: 4.6,
    reviewCount: 89,
    location: 'Clinica Vida, Centro',
    avatar: '\u{1F468}\u200D\u2695\uFE0F',
  },
  {
    id: 'd3',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    rating: 4.9,
    reviewCount: 203,
    location: 'Centro Medico Sul',
    avatar: '\u{1F469}\u200D\u2695\uFE0F',
  },
  {
    id: 'd4',
    name: 'Dr. Paulo Oliveira',
    specialty: 'Pediatra',
    rating: 4.7,
    reviewCount: 156,
    location: 'Hospital Infantil',
    avatar: '\u{1F468}\u200D\u2695\uFE0F',
  },
  {
    id: 'd5',
    name: 'Dra. Lucia Ferreira',
    specialty: 'Neurologista',
    rating: 4.5,
    reviewCount: 74,
    location: 'Clinica Neuro, Norte',
    avatar: '\u{1F469}\u200D\u2695\uFE0F',
  },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[20]};
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
  color: ${colors.gray[60]};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
`;

const ResultCount = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[40]};
`;

const DoctorCard = styled.TouchableOpacity`
  flex-direction: row;
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-top: ${spacing.sm};
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.gray[20]};
`;

const AvatarCircle = styled.View`
  width: ${sizing.component.lg};
  height: ${sizing.component.lg};
  border-radius: ${String(sizingValues.component.lg / 2)}px;
  background-color: ${colors.journeys.care.background};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const AvatarText = styled.Text`
  font-size: 24px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing['4xs']};
`;

const Specialty = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing['3xs']};
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing['3xs']};
`;

const StarText = styled.Text`
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.semantic.warning};
  margin-right: ${spacing['3xs']};
`;

const RatingText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
`;

const LocationText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.sm};
`;

const BookButton = styled.TouchableOpacity`
  align-self: flex-start;
  background-color: ${colors.journeys.care.primary};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.xs};
  border-radius: ${borderRadius.sm};
`;

const BookButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
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
  color: ${colors.gray[50]};
  text-align: center;
  margin-top: ${spacing.md};
`;

// --- Helpers ---

const renderStars = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '\u2605';
  if (half) stars += '\u00BD';
  return stars;
};

// --- Component ---

/**
 * SearchDoctorResults -- Displays doctor search results as a scrollable FlatList.
 * Each card shows avatar, name, specialty, rating, location, and a Book CTA.
 */
export const SearchDoctorResults: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBookDoctor = useCallback(
    (doctorId: string) => {
      navigation.navigate(ROUTES.CARE_DOCTOR_PROFILE, { doctorId });
    },
    [navigation],
  );

  const handleDoctorPress = useCallback(
    (doctorId: string) => {
      navigation.navigate(ROUTES.CARE_DOCTOR_PROFILE, { doctorId });
    },
    [navigation],
  );

  const renderDoctorItem = useCallback(
    ({ item }: { item: DoctorResult }) => (
      <DoctorCard
        onPress={() => handleDoctorPress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.specialty}, ${t('search.doctorResults.rating')} ${item.rating}`}
        testID={`doctor-card-${item.id}`}
      >
        <AvatarCircle>
          <AvatarText>{item.avatar}</AvatarText>
        </AvatarCircle>
        <DoctorInfo>
          <DoctorName testID={`doctor-name-${item.id}`}>{item.name}</DoctorName>
          <Specialty testID={`doctor-specialty-${item.id}`}>{item.specialty}</Specialty>
          <RatingRow>
            <StarText>{renderStars(item.rating)}</StarText>
            <RatingText testID={`doctor-rating-${item.id}`}>
              {item.rating} ({item.reviewCount} {t('search.doctorResults.reviews')})
            </RatingText>
          </RatingRow>
          <LocationText testID={`doctor-location-${item.id}`}>
            {item.location}
          </LocationText>
          <BookButton
            onPress={() => handleBookDoctor(item.id)}
            accessibilityRole="button"
            accessibilityLabel={t('search.doctorResults.bookWith', { name: item.name })}
            testID={`doctor-book-${item.id}`}
          >
            <BookButtonText>{t('search.doctorResults.book')}</BookButtonText>
          </BookButton>
        </DoctorInfo>
      </DoctorCard>
    ),
    [handleDoctorPress, handleBookDoctor, t],
  );

  const keyExtractor = useCallback((item: DoctorResult) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyText testID="doctor-results-empty">
          {t('search.doctorResults.empty')}
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
          testID="doctor-results-back"
        >
          <BackText>{'\u2190'}</BackText>
        </BackButton>
        <HeaderTitle testID="doctor-results-title">
          {t('search.doctorResults.title')}
        </HeaderTitle>
        <ResultCount testID="doctor-results-count">
          {MOCK_DOCTORS.length} {t('search.doctorResults.found')}
        </ResultCount>
      </Header>

      <FlatList
        data={MOCK_DOCTORS}
        renderItem={renderDoctorItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacingValues['3xl'],
        }}
        testID="doctor-results-list"
      />
    </Container>
  );
};

export default SearchDoctorResults;
