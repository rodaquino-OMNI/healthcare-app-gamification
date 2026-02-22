import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../context/ThemeContext';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { darkTheme } from '../../../../design-system/src/themes';

// --- Types ---

interface ThemeOption {
  mode: ThemeMode;
  labelKey: string;
  icon: string;
}

// --- Constants ---

const THEMES: ThemeOption[] = [
  { mode: 'light', labelKey: 'settings.themeSelect.light', icon: 'SUN' },
  { mode: 'dark', labelKey: 'settings.themeSelect.dark', icon: 'MOON' },
  { mode: 'system', labelKey: 'settings.themeSelect.system', icon: 'AUTO' },
];

const PREVIEW_COLORS = {
  light: {
    bg: '#ffffff',
    card: '#f8fafc',
    text: '#334155',
    subtext: '#94a3b8',
    border: '#e2e8f0',
  },
  dark: {
    bg: darkTheme.colors.background.default,
    card: darkTheme.colors.background.muted,
    text: darkTheme.colors.text.default,
    subtext: darkTheme.colors.text.subtle,
    border: darkTheme.colors.border.default,
  },
};

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
  padding-bottom: ${spacing.lg};
`;

const ThemeCard = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.sm};
  padding: ${spacing.md};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.background.subtle : theme.colors.background.default};
  border-radius: ${borderRadius.lg};
  border-width: 2px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.brand.primary : theme.colors.border.default};
`;

const IconContainer = styled.View`
  width: ${sizing.component.md};
  height: ${sizing.component.md};
  border-radius: ${borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const IconText = styled.Text`
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const ThemeLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`;

const RadioOuter = styled.View<{ isSelected: boolean }>`
  width: ${sizing.icon.md};
  height: ${sizing.icon.md};
  border-radius: ${borderRadius.full};
  border-width: 2px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.brand.primary : theme.colors.border.default};
  align-items: center;
  justify-content: center;
`;

const RadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: ${borderRadius.full};
  background-color: ${({ theme }) => theme.colors.brand.primary};
`;

const SectionHeader = styled.View`
  background-color: ${({ theme }) => theme.colors.background.subtle};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  margin-top: ${spacing.xl};
`;

const SectionHeaderText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.subtle};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
`;

const PreviewContainer = styled.View<{ bgColor: string }>`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${({ bgColor }) => bgColor};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const PreviewCardInner = styled.View<{ cardColor: string; borderColor: string }>`
  padding: ${spacing.md};
  background-color: ${({ cardColor }) => cardColor};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
`;

const PreviewTitle = styled.Text<{ textColor: string }>`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ textColor }) => textColor};
  margin-bottom: ${spacing['2xs']};
`;

const PreviewSubtext = styled.Text<{ textColor: string }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ textColor }) => textColor};
`;

const PreviewButton = styled.View`
  margin-top: ${spacing.sm};
  height: ${sizing.component.sm};
  background-color: ${({ theme }) => theme.colors.brand.primary};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
`;

const PreviewButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

/**
 * ThemeSelect screen -- allows user to pick Light, Dark, or System theme.
 * Shows a preview card that demonstrates the selected theme appearance.
 */
export const ThemeSelectScreen: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode } = useAppTheme();

  const previewTheme =
    themeMode === 'system' ? 'light' : themeMode;
  const preview = PREVIEW_COLORS[previewTheme];

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Title>{t('settings.themeSelect.title')}</Title>

        {THEMES.map((option) => {
          const isSelected = themeMode === option.mode;
          return (
            <ThemeCard
              key={option.mode}
              isSelected={isSelected}
              onPress={() => setThemeMode(option.mode)}
              accessibilityRole="radio"
              accessibilityLabel={t(option.labelKey)}
              accessibilityState={{ checked: isSelected }}
              testID={`theme-option-${option.mode}`}
            >
              <IconContainer>
                <IconText>{option.icon}</IconText>
              </IconContainer>
              <ThemeLabel>{t(option.labelKey)}</ThemeLabel>
              <RadioOuter isSelected={isSelected}>
                {isSelected && <RadioInner />}
              </RadioOuter>
            </ThemeCard>
          );
        })}

        <SectionHeader>
          <SectionHeaderText>{t('settings.themeSelect.preview')}</SectionHeaderText>
        </SectionHeader>

        <PreviewContainer bgColor={preview.bg}>
          <PreviewCardInner
            cardColor={preview.card}
            borderColor={preview.border}
          >
            <PreviewTitle textColor={preview.text}>
              AUSTA SuperApp
            </PreviewTitle>
            <PreviewSubtext textColor={preview.subtext}>
              {t('settings.themeSelect.preview')} - {t(
                `settings.themeSelect.${themeMode}`,
              )}
            </PreviewSubtext>
            <PreviewButton>
              <PreviewButtonText>OK</PreviewButtonText>
            </PreviewButton>
          </PreviewCardInner>
        </PreviewContainer>
      </ScrollView>
    </Container>
  );
};

export default ThemeSelectScreen;
