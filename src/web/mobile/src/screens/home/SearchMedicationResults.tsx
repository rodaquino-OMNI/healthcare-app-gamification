import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Types ---

interface MedicationResult {
  id: string;
  brandName: string;
  genericName: string;
  dosage: string;
  hasInteractions: boolean;
  interactionCount: number;
}

// --- Mock Data ---

const MOCK_MEDICATIONS: MedicationResult[] = [
  {
    id: 'm1',
    brandName: 'Tylenol',
    genericName: 'Paracetamol 500mg',
    dosage: '1 comprimido a cada 6 horas',
    hasInteractions: false,
    interactionCount: 0,
  },
  {
    id: 'm2',
    brandName: 'Advil',
    genericName: 'Ibuprofeno 400mg',
    dosage: '1 comprimido a cada 8 horas',
    hasInteractions: true,
    interactionCount: 2,
  },
  {
    id: 'm3',
    brandName: 'Cozaar',
    genericName: 'Losartana Potassica 50mg',
    dosage: '1 comprimido ao dia',
    hasInteractions: true,
    interactionCount: 3,
  },
  {
    id: 'm4',
    brandName: 'Glifage',
    genericName: 'Metformina 850mg',
    dosage: '1 comprimido 2x ao dia',
    hasInteractions: false,
    interactionCount: 0,
  },
  {
    id: 'm5',
    brandName: 'Aradois',
    genericName: 'Losartana Potassica 100mg',
    dosage: '1 comprimido ao dia',
    hasInteractions: true,
    interactionCount: 1,
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

const MedicationCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-top: ${spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const IconContainer = styled.View`
  width: ${sizing.component.lg};
  height: ${sizing.component.lg};
  border-radius: ${borderRadius.md};
  background-color: ${colors.journeys.health.background};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const IconText = styled.Text`
  font-size: 24px;
`;

const MedicationInfo = styled.View`
  flex: 1;
`;

const BrandName = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing['4xs']};
`;

const GenericName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${spacing['3xs']};
`;

const DosageText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-bottom: ${spacing.xs};
`;

const InteractionBadge = styled.View<{ hasInteraction: boolean }>`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xs};
  padding-vertical: ${spacing['4xs']};
  border-radius: ${borderRadius.xs};
  background-color: ${(props) =>
    props.hasInteraction ? colors.semantic.warningBg : colors.semantic.successBg};
`;

const InteractionIcon = styled.Text`
  font-size: 12px;
  margin-right: ${spacing['4xs']};
`;

const InteractionText = styled.Text<{ hasInteraction: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.hasInteraction ? colors.semantic.warning : colors.semantic.success};
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
 * SearchMedicationResults -- Displays medication search results as a FlatList.
 * Each card shows pill icon, brand/generic names, dosage, and interaction badge.
 */
export const SearchMedicationResults: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMedicationPress = useCallback(
    (medicationId: string) => {
      navigation.navigate(ROUTES.HEALTH_MEDICATION_DETAIL, { medicationId });
    },
    [navigation],
  );

  const renderMedicationItem = useCallback(
    ({ item }: { item: MedicationResult }) => (
      <MedicationCard
        onPress={() => handleMedicationPress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.brandName}, ${item.genericName}, ${item.dosage}`}
        testID={`medication-card-${item.id}`}
      >
        <IconContainer>
          <IconText>{'\u{1F48A}'}</IconText>
        </IconContainer>
        <MedicationInfo>
          <BrandName testID={`medication-brand-${item.id}`}>
            {item.brandName}
          </BrandName>
          <GenericName testID={`medication-generic-${item.id}`}>
            {item.genericName}
          </GenericName>
          <DosageText testID={`medication-dosage-${item.id}`}>
            {item.dosage}
          </DosageText>
          <InteractionBadge hasInteraction={item.hasInteractions}>
            <InteractionIcon>
              {item.hasInteractions ? '\u26A0\uFE0F' : '\u2705'}
            </InteractionIcon>
            <InteractionText
              hasInteraction={item.hasInteractions}
              testID={`medication-interaction-${item.id}`}
            >
              {item.hasInteractions
                ? t('search.medicationResults.interactions', {
                    count: item.interactionCount,
                  })
                : t('search.medicationResults.noInteractions')}
            </InteractionText>
          </InteractionBadge>
        </MedicationInfo>
      </MedicationCard>
    ),
    [handleMedicationPress, t],
  );

  const keyExtractor = useCallback((item: MedicationResult) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyText testID="medication-results-empty">
          {t('search.medicationResults.empty')}
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
          testID="medication-results-back"
        >
          <BackText>{'\u2190'}</BackText>
        </BackButton>
        <HeaderTitle testID="medication-results-title">
          {t('search.medicationResults.title')}
        </HeaderTitle>
        <ResultCount testID="medication-results-count">
          {MOCK_MEDICATIONS.length} {t('search.medicationResults.found')}
        </ResultCount>
      </Header>

      <FlatList
        data={MOCK_MEDICATIONS}
        renderItem={renderMedicationItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacingValues['3xl'],
        }}
        testID="medication-results-list"
      />
    </Container>
  );
};

export default SearchMedicationResults;
