import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
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

type LanguageCode = 'pt-BR' | 'en-US' | 'es';

interface LanguageOption {
  code: LanguageCode;
  labelKey: string;
  locale: string;
}

// --- Constants ---

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', labelKey: 'settings.languageSelect.portuguese', locale: 'pt-BR' },
  { code: 'en-US', labelKey: 'settings.languageSelect.english', locale: 'en-US' },
  { code: 'es', labelKey: 'settings.languageSelect.spanish', locale: 'es' },
];

const LOCALE_FORMATS: Record<LanguageCode, { date: string; time: string }> = {
  'pt-BR': { date: '21/02/2026', time: '14:30' },
  'en-US': { date: '02/21/2026', time: '2:30 PM' },
  es: { date: '21/02/2026', time: '14:30' },
};

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.lg};
`;

const OptionRow = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${({ isSelected }) =>
    isSelected ? colors.gray[5] : colors.neutral.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const RadioOuter = styled.View<{ isSelected: boolean }>`
  width: ${sizing.icon.md};
  height: ${sizing.icon.md};
  border-radius: ${borderRadius.full};
  border-width: 2px;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.brand.primary : colors.gray[30]};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const RadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.brand.primary};
`;

const OptionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const SectionHeader = styled.View`
  background-color: ${colors.gray[10]};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  margin-top: ${spacing.xl};
`;

const SectionHeaderText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[50]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
`;

const PreviewCard = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${colors.gray[5]};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${colors.gray[20]};
`;

const PreviewRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${spacing.xs};
`;

const PreviewLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[50]};
`;

const PreviewValue = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.neutral.gray900};
`;

const SaveButton = styled.TouchableOpacity`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing['2xl']};
  height: ${sizing.component.lg};
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
`;

const SaveButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

/**
 * LanguageSelect screen -- allows user to pick app language.
 * Displays radio options for Portuguese, English, and Spanish,
 * with a preview section showing locale-formatted date/time.
 */
export const LanguageSelectScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    (i18n.language as LanguageCode) || 'pt-BR',
  );

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    Alert.alert(
      t('settings.languageSelect.title'),
      t('settings.languageSelect.save'),
    );
    navigation.goBack();
  };

  const preview = LOCALE_FORMATS[selectedLanguage];

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Title>{t('settings.languageSelect.title')}</Title>

        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <OptionRow
              key={lang.code}
              isSelected={isSelected}
              onPress={() => setSelectedLanguage(lang.code)}
              accessibilityRole="radio"
              accessibilityLabel={t(lang.labelKey)}
              accessibilityState={{ checked: isSelected }}
              testID={`language-option-${lang.code}`}
            >
              <RadioOuter isSelected={isSelected}>
                {isSelected && <RadioInner />}
              </RadioOuter>
              <OptionLabel>{t(lang.labelKey)}</OptionLabel>
            </OptionRow>
          );
        })}

        <SectionHeader>
          <SectionHeaderText>{t('settings.languageSelect.preview')}</SectionHeaderText>
        </SectionHeader>

        <PreviewCard>
          <PreviewRow>
            <PreviewLabel>{t('settings.languageSelect.preview')}: Date</PreviewLabel>
            <PreviewValue>{preview.date}</PreviewValue>
          </PreviewRow>
          <PreviewRow>
            <PreviewLabel>{t('settings.languageSelect.preview')}: Time</PreviewLabel>
            <PreviewValue>{preview.time}</PreviewValue>
          </PreviewRow>
        </PreviewCard>

        <SaveButton
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={t('settings.languageSelect.save')}
          testID="language-save-button"
        >
          <SaveButtonText>{t('settings.languageSelect.save')}</SaveButtonText>
        </SaveButton>
      </ScrollView>
    </Container>
  );
};

export default LanguageSelectScreen;
