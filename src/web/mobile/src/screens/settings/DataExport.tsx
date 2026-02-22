import React, { useState } from 'react';
import {
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
`;

const PageTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.sm};
`;

const InfoBox = styled.View`
  padding: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.xl};
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 20px;
`;

const SectionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const CheckboxBox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.xs};
  border-width: 2px;
  border-color: ${(props) =>
    props.checked ? colors.brand.primary : colors.gray[40]};
  background-color: ${(props) =>
    props.checked ? colors.brand.primary : 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const CheckmarkText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.onBrand};
  line-height: 20px;
`;

const CheckboxLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`;

const FormatSection = styled.View`
  margin-top: ${spacing.xl};
  margin-bottom: ${spacing.xl};
`;

const FormatRow = styled.View`
  flex-direction: row;
  gap: ${spacing.sm};
`;

const FormatOption = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${spacing.sm};
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[20]};
  border-radius: ${borderRadius.md};
  background-color: ${(props) =>
    props.isSelected ? colors.gray[10] : colors.neutral.white};
`;

const RadioCircle = styled.View<{ isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[40]};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.xs};
`;

const RadioDot = styled.View`
  width: 9px;
  height: 9px;
  border-radius: 5px;
  background-color: ${colors.brand.primary};
`;

const FormatLabel = styled.Text<{ isSelected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${(props) =>
    props.isSelected ? typography.fontWeight.semiBold : typography.fontWeight.regular};
  color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.neutral.gray900};
`;

const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? colors.gray[30] : colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const StatusSection = styled.View`
  margin-top: ${spacing['2xl']};
  padding: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
`;

const StatusTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatusDate = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const StatusBadge = styled.View<{ status: string }>`
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing['3xs']};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) => {
    switch (props.status) {
      case 'ready': return colors.semantic.success;
      case 'processing': return colors.semantic.warning;
      default: return colors.gray[40];
    }
  }};
`;

const StatusBadgeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

// --- Types ---

type ExportFormat = 'json' | 'pdf';

interface CategoryState {
  profile: boolean;
  health: boolean;
  appointments: boolean;
  medications: boolean;
  claims: boolean;
}

const CATEGORIES: { key: keyof CategoryState; labelKey: string }[] = [
  { key: 'profile', labelKey: 'settings.dataExport.categories.profile' },
  { key: 'health', labelKey: 'settings.dataExport.categories.health' },
  { key: 'appointments', labelKey: 'settings.dataExport.categories.appointments' },
  { key: 'medications', labelKey: 'settings.dataExport.categories.medications' },
  { key: 'claims', labelKey: 'settings.dataExport.categories.claims' },
];

/**
 * DataExport screen -- LGPD data export request with category
 * selection, format choice, and previous export status.
 */
export const DataExportScreen: React.FC = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<CategoryState>({
    profile: true,
    health: true,
    appointments: true,
    medications: true,
    claims: true,
  });

  const [format, setFormat] = useState<ExportFormat>('json');

  const selectedCount = Object.values(categories).filter(Boolean).length;

  const toggleCategory = (key: keyof CategoryState) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestExport = () => {
    if (selectedCount === 0) {
      Alert.alert(t('settings.dataExport.noSelection'));
      return;
    }
    Alert.alert(
      t('settings.dataExport.request'),
      t('settings.dataExport.requestConfirm'),
    );
  };

  // Mock last export status
  const lastExportDate = '15/02/2026';
  const lastExportStatus = 'ready';

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <PageTitle>{t('settings.dataExport.title')}</PageTitle>

          <InfoBox>
            <InfoText>{t('settings.dataExport.info')}</InfoText>
          </InfoBox>

          <SectionLabel>{t('settings.dataExport.categoriesLabel')}</SectionLabel>

          {CATEGORIES.map((cat) => (
            <CheckboxRow
              key={cat.key}
              onPress={() => toggleCategory(cat.key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: categories[cat.key] }}
              accessibilityLabel={t(cat.labelKey)}
              testID={`data-export-cat-${cat.key}`}
            >
              <CheckboxBox checked={categories[cat.key]}>
                {categories[cat.key] && <CheckmarkText>{'✓'}</CheckmarkText>}
              </CheckboxBox>
              <CheckboxLabel>{t(cat.labelKey)}</CheckboxLabel>
            </CheckboxRow>
          ))}

          <FormatSection>
            <SectionLabel>{t('settings.dataExport.formatLabel')}</SectionLabel>
            <FormatRow>
              <FormatOption
                isSelected={format === 'json'}
                onPress={() => setFormat('json')}
                accessibilityRole="radio"
                accessibilityState={{ selected: format === 'json' }}
                accessibilityLabel={t('settings.dataExport.format.json')}
                testID="data-export-format-json"
              >
                <RadioCircle isSelected={format === 'json'}>
                  {format === 'json' && <RadioDot />}
                </RadioCircle>
                <FormatLabel isSelected={format === 'json'}>
                  {t('settings.dataExport.format.json')}
                </FormatLabel>
              </FormatOption>

              <FormatOption
                isSelected={format === 'pdf'}
                onPress={() => setFormat('pdf')}
                accessibilityRole="radio"
                accessibilityState={{ selected: format === 'pdf' }}
                accessibilityLabel={t('settings.dataExport.format.pdf')}
                testID="data-export-format-pdf"
              >
                <RadioCircle isSelected={format === 'pdf'}>
                  {format === 'pdf' && <RadioDot />}
                </RadioCircle>
                <FormatLabel isSelected={format === 'pdf'}>
                  {t('settings.dataExport.format.pdf')}
                </FormatLabel>
              </FormatOption>
            </FormatRow>
          </FormatSection>

          <PrimaryButton
            onPress={handleRequestExport}
            disabled={selectedCount === 0}
            accessibilityRole="button"
            accessibilityLabel={t('settings.dataExport.request')}
            testID="data-export-request"
          >
            <PrimaryButtonText>{t('settings.dataExport.request')}</PrimaryButtonText>
          </PrimaryButton>

          <StatusSection>
            <StatusTitle>{t('settings.dataExport.lastExport')}</StatusTitle>
            <StatusRow>
              <StatusDate>{lastExportDate}</StatusDate>
              <StatusBadge status={lastExportStatus}>
                <StatusBadgeText>
                  {t(`settings.dataExport.status.${lastExportStatus}`)}
                </StatusBadgeText>
              </StatusBadge>
            </StatusRow>
          </StatusSection>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default DataExportScreen;
