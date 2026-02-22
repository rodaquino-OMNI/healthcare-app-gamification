import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
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

type FontSizeOption = 'S' | 'M' | 'L' | 'XL';

interface FontSizeConfig {
  key: FontSizeOption;
  labelKey: string;
  size: number;
}

// --- Constants ---

const FONT_SIZES: FontSizeConfig[] = [
  { key: 'S', labelKey: 'settings.accessibility.fontSizes.small', size: 14 },
  { key: 'M', labelKey: 'settings.accessibility.fontSizes.medium', size: 16 },
  { key: 'L', labelKey: 'settings.accessibility.fontSizes.large', size: 20 },
  { key: 'XL', labelKey: 'settings.accessibility.fontSizes.extraLarge', size: 24 },
];

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

const SectionHeader = styled.View`
  background-color: ${({ theme }) => theme.colors.background.subtle};
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
`;

const SectionHeaderText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
`;

const FontSizeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  gap: ${spacing.xs};
`;

const FontSizeButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.brand.primary : colors.gray[10]};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.brand.primary : colors.gray[20]};
`;

const FontSizeButtonText = styled.Text<{ isSelected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ isSelected }) =>
    isSelected ? colors.neutral.white : colors.neutral.gray900};
`;

const PreviewContainer = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-vertical: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const PreviewLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${spacing.xs};
`;

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
  margin-right: ${spacing.md};
`;

const InfoContainer = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${colors.semantic.successBg};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${colors.semantic.success};
`;

const InfoTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 20px;
`;

/**
 * Accessibility screen -- font size selector, high contrast toggle,
 * reduced motion toggle, and screen reader information.
 */
export const AccessibilityScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<FontSizeOption>('M');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentFontSize = FONT_SIZES.find((fs) => fs.key === selectedSize);

  const trackColor = {
    false: colors.gray[20],
    true: colors.brand.primary,
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Title>{t('settings.accessibility.title')}</Title>

        {/* Font Size Section */}
        <SectionHeader>
          <SectionHeaderText>
            {t('settings.accessibility.fontSize')}
          </SectionHeaderText>
        </SectionHeader>

        <FontSizeRow>
          {FONT_SIZES.map((fs) => {
            const isSelected = selectedSize === fs.key;
            return (
              <FontSizeButton
                key={fs.key}
                isSelected={isSelected}
                onPress={() => setSelectedSize(fs.key)}
                accessibilityRole="radio"
                accessibilityLabel={t(fs.labelKey)}
                accessibilityState={{ checked: isSelected }}
                testID={`font-size-${fs.key.toLowerCase()}`}
              >
                <FontSizeButtonText isSelected={isSelected}>
                  {fs.key}
                </FontSizeButtonText>
              </FontSizeButton>
            );
          })}
        </FontSizeRow>

        <PreviewContainer>
          <PreviewLabel>{t('settings.accessibility.preview')}</PreviewLabel>
          <InfoText
            style={{ fontSize: currentFontSize?.size ?? 16 }}
            testID="font-size-preview"
          >
            {t('settings.accessibility.preview')} - AUSTA SuperApp
          </InfoText>
        </PreviewContainer>

        {/* Display Section */}
        <SectionHeader>
          <SectionHeaderText>Display</SectionHeaderText>
        </SectionHeader>

        <ToggleRow>
          <ToggleLabel>{t('settings.accessibility.highContrast')}</ToggleLabel>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel={t('settings.accessibility.highContrast')}
            testID="accessibility-high-contrast"
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>{t('settings.accessibility.reducedMotion')}</ToggleLabel>
          <Switch
            value={reducedMotion}
            onValueChange={setReducedMotion}
            trackColor={trackColor}
            thumbColor={colors.neutral.white}
            accessibilityLabel={t('settings.accessibility.reducedMotion')}
            testID="accessibility-reduced-motion"
          />
        </ToggleRow>

        {/* Screen Reader Info */}
        <SectionHeader>
          <SectionHeaderText>
            {t('settings.accessibility.screenReaderInfo')}
          </SectionHeaderText>
        </SectionHeader>

        <InfoContainer>
          <InfoTitle>{t('settings.accessibility.screenReaderInfo')}</InfoTitle>
          <InfoText>
            VoiceOver (iOS) / TalkBack (Android) - {t('settings.accessibility.screenReaderInfo')}
          </InfoText>
        </InfoContainer>
      </ScrollView>
    </Container>
  );
};

export default AccessibilityScreen;
