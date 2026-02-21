import React, { useState } from 'react';
import { ScrollView, Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Header = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.xl};
  padding-bottom: ${spacing.md};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
`;

const FormSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.md};
`;

const FieldLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
  margin-top: ${spacing.lg};
`;

const CategorySelector = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryChip = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.full};
  border-width: 1px;
  border-color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[20]};
  background-color: ${(props) =>
    props.isSelected ? colors.brand.primary + '10' : colors.neutral.white};
`;

const CategoryChipText = styled.Text<{ isSelected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[50]};
`;

const TextArea = styled.TextInput`
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  min-height: 100px;
  text-align-vertical: top;
`;

const StepsArea = styled.TextInput`
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  min-height: 80px;
  text-align-vertical: top;
`;

const AttachButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.md};
  padding-horizontal: ${spacing.md};
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  border-style: dashed;
  justify-content: center;
  margin-top: ${spacing.sm};
`;

const AttachButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.brand.primary};
  font-weight: ${typography.fontWeight.medium};
`;

const DeviceInfoSection = styled.View`
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-top: ${spacing.sm};
`;

const DeviceInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 2px;
`;

const DeviceInfoLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
`;

const DeviceInfoValue = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
`;

const SubmitButton = styled.TouchableOpacity<{ disabled: boolean }>`
  background-color: ${(props) =>
    props.disabled ? colors.gray[20] : colors.brand.primary};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.md};
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.xl};
  height: ${sizing.component.md};
`;

const SubmitButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

// --- Types ---

type CategoryType = 'bug' | 'crash' | 'performance' | 'visual' | 'other';

// --- Component ---

export const ReportProblemScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');

  const categories: { key: CategoryType; label: string }[] = [
    { key: 'bug', label: t('help.report.categoryOptions.bug') },
    { key: 'crash', label: t('help.report.categoryOptions.crash') },
    { key: 'performance', label: t('help.report.categoryOptions.performance') },
    { key: 'visual', label: t('help.report.categoryOptions.visual') },
    { key: 'other', label: t('help.report.categoryOptions.other') },
  ];

  const deviceModel = Platform.OS === 'ios' ? 'iPhone 15, iOS 17.0' : 'Android 14';
  const appVersion = 'AUSTA SuperApp v1.0.0';

  const isFormValid = selectedCategory !== null && description.trim().length > 0;

  const handleAttachScreenshot = () => {
    Alert.alert(
      t('help.report.attachScreenshot'),
      'Funcionalidade de captura de tela sera implementada em breve.',
      [{ text: 'OK' }],
    );
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    Alert.alert(
      t('help.report.submit'),
      'Relatorio enviado com sucesso! Obrigado pelo seu feedback.',
      [{ text: 'OK' }],
    );
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        keyboardShouldPersistTaps="handled"
      >
        <Header>
          <Title accessibilityRole="header" testID="report-problem-title">
            {t('help.report.title')}
          </Title>
        </Header>

        <FormSection>
          {/* Category */}
          <FieldLabel>{t('help.report.category')}</FieldLabel>
          <CategorySelector>
            {categories.map((cat) => (
              <CategoryChip
                key={cat.key}
                isSelected={selectedCategory === cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                accessibilityRole="button"
                accessibilityLabel={cat.label}
                accessibilityState={{ selected: selectedCategory === cat.key }}
                testID={`report-category-${cat.key}`}
              >
                <CategoryChipText isSelected={selectedCategory === cat.key}>
                  {cat.label}
                </CategoryChipText>
              </CategoryChip>
            ))}
          </CategorySelector>

          {/* Description */}
          <FieldLabel>{t('help.report.description')}</FieldLabel>
          <TextArea
            value={description}
            onChangeText={setDescription}
            placeholder={t('help.report.description')}
            placeholderTextColor={colors.gray[40]}
            multiline
            numberOfLines={4}
            accessibilityLabel={t('help.report.description')}
            testID="report-description"
          />

          {/* Steps to Reproduce */}
          <FieldLabel>{t('help.report.stepsToReproduce')}</FieldLabel>
          <StepsArea
            value={steps}
            onChangeText={setSteps}
            placeholder={t('help.report.stepsToReproduce')}
            placeholderTextColor={colors.gray[40]}
            multiline
            numberOfLines={4}
            accessibilityLabel={t('help.report.stepsToReproduce')}
            testID="report-steps"
          />

          {/* Attach Screenshot */}
          <FieldLabel>{t('help.report.attachScreenshot')}</FieldLabel>
          <AttachButton
            onPress={handleAttachScreenshot}
            accessibilityRole="button"
            accessibilityLabel={t('help.report.attachScreenshot')}
            testID="report-attach-screenshot"
          >
            <AttachButtonText>
              {'\u{1F4F7}'} {t('help.report.attachScreenshot')}
            </AttachButtonText>
          </AttachButton>

          {/* Device Info */}
          <FieldLabel>{t('help.report.deviceInfo')}</FieldLabel>
          <DeviceInfoSection>
            <DeviceInfoRow>
              <DeviceInfoLabel>Dispositivo</DeviceInfoLabel>
              <DeviceInfoValue testID="report-device-model">
                {deviceModel}
              </DeviceInfoValue>
            </DeviceInfoRow>
            <DeviceInfoRow>
              <DeviceInfoLabel>App</DeviceInfoLabel>
              <DeviceInfoValue testID="report-app-version">
                {appVersion}
              </DeviceInfoValue>
            </DeviceInfoRow>
          </DeviceInfoSection>

          {/* Submit */}
          <SubmitButton
            disabled={!isFormValid}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel={t('help.report.submit')}
            accessibilityState={{ disabled: !isFormValid }}
            testID="report-submit"
          >
            <SubmitButtonText>{t('help.report.submit')}</SubmitButtonText>
          </SubmitButton>
        </FormSection>
      </ScrollView>
    </Container>
  );
};

export default ReportProblemScreen;
