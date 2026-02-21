import React, { useState } from 'react';
import { ScrollView } from 'react-native';
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

type ThemeMode = 'light' | 'dark' | 'system';

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
    bg: colors.neutral.white,
    card: colors.gray[5],
    text: colors.neutral.gray900,
    subtext: colors.gray[50],
    border: colors.gray[20],
  },
  dark: {
    bg: colors.neutral.gray900,
    card: colors.gray[70],
    text: colors.neutral.white,
    subtext: colors.gray[30],
    border: colors.gray[60],
  },
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

const ThemeCard = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.sm};
  padding: ${spacing.md};
  background-color: ${({ isSelected }) =>
    isSelected ? colors.gray[5] : colors.neutral.white};
  border-radius: ${borderRadius.lg};
  border-width: 2px;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.brand.primary : colors.gray[20]};
`;

const IconContainer = styled.View`
  width: ${sizing.component.md};
  height: ${sizing.component.md};
  border-radius: ${borderRadius.md};
  background-color: ${colors.gray[10]};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const IconText = styled.Text`
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[60]};
`;

const ThemeLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  flex: 1;
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
`;

const RadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.brand.primary};
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

const PreviewContainer = styled.View<{ bgColor: string }>`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${({ bgColor }) => bgColor};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${colors.gray[20]};
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
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
`;

const PreviewButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

/**
 * ThemeSelect screen -- allows user to pick Light, Dark, or System theme.
 * Shows a preview card that demonstrates the selected theme appearance.
 */
export const ThemeSelectScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('light');

  const previewTheme =
    selectedTheme === 'system' ? 'light' : selectedTheme;
  const preview = PREVIEW_COLORS[previewTheme];

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Title>{t('settings.themeSelect.title')}</Title>

        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.mode;
          return (
            <ThemeCard
              key={theme.mode}
              isSelected={isSelected}
              onPress={() => setSelectedTheme(theme.mode)}
              accessibilityRole="radio"
              accessibilityLabel={t(theme.labelKey)}
              accessibilityState={{ checked: isSelected }}
              testID={`theme-option-${theme.mode}`}
            >
              <IconContainer>
                <IconText>{theme.icon}</IconText>
              </IconContainer>
              <ThemeLabel>{t(theme.labelKey)}</ThemeLabel>
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
                `settings.themeSelect.${selectedTheme}`,
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
