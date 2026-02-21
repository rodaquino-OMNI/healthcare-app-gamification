import React, { useState, useCallback } from 'react';
import { ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Constants ---

const TOTAL_STEPS = 7;
const CURRENT_STEP = 4;

const RELATIONSHIPS = [
  'spouse',
  'parent',
  'sibling',
  'child',
  'friend',
  'other',
] as const;

type Relationship = typeof RELATIONSHIPS[number];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.md};
`;

const BackButton = styled.TouchableOpacity`
  padding: ${spacing.xs};
  margin-right: ${spacing.sm};
`;

const BackIcon = styled.Text`
  font-size: 24px;
  color: ${colors.neutral.gray900};
`;

const HeaderTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-bottom: ${spacing['4xl']};
`;

const StepSection = styled.View`
  margin-bottom: ${spacing['2xl']};
`;

const StepIndicator = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
`;

const StepBarContainer = styled.View`
  flex-direction: row;
  margin-top: ${spacing.sm};
  gap: ${spacing['3xs']};
`;

const StepDot = styled.View<{ active: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: ${borderRadius.full};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
`;

const Label = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
  margin-top: ${spacing.lg};
`;

const StyledInput = styled.TextInput`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  background-color: ${colors.gray[5]};
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  height: ${sizing.component.lg};
`;

const SectionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.sm};
  margin-top: ${spacing.lg};
`;

const ChipsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing.sm};
`;

const Chip = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.neutral.white};
  border-width: 1px;
  border-color: ${(props) =>
    props.selected ? colors.brand.primary : colors.gray[30]};
  border-radius: ${borderRadius.full};
  padding-horizontal: ${spacing.lg};
  padding-vertical: ${spacing.sm};
`;

const ChipText = styled.Text<{ selected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.selected ? colors.neutral.white : colors.neutral.gray900};
`;

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.xl};
  padding-vertical: ${spacing.md};
  border-top-width: 1px;
  border-top-color: ${colors.gray[10]};
`;

const ToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
`;

const BottomSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-bottom: ${spacing['3xl']};
  padding-top: ${spacing.md};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const SaveButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

// --- Component ---

/**
 * ProfileEmergencyContact screen allows users to add an
 * emergency contact during profile onboarding. Includes
 * name, phone, relationship selection, and primary toggle.
 */
export const ProfileEmergencyContact: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [isPrimary, setIsPrimary] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = useCallback(() => {
    // TODO: Save emergency contact data to context/store
    navigation.navigate(ROUTES.PROFILE_CONFIRMATION);
  }, [navigation]);

  const selectRelationship = useCallback((rel: Relationship) => {
    setRelationship(rel);
  }, []);

  return (
    <Container>
      {/* Header */}
      <HeaderRow>
        <BackButton
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.buttons.back')}
          testID="emergency-contact-back"
        >
          <BackIcon>{'\u2190'}</BackIcon>
        </BackButton>
        <HeaderTitle>{t('profile.emergencyContact.title')}</HeaderTitle>
      </HeaderRow>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        testID="emergency-contact-scroll"
      >
        <ContentWrapper>
          {/* Step Indicator */}
          <StepSection>
            <StepIndicator>
              {t('profile.emergencyContact.step', {
                current: CURRENT_STEP,
                total: TOTAL_STEPS,
              })}
            </StepIndicator>
            <StepBarContainer>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <StepDot key={i} active={i < CURRENT_STEP} />
              ))}
            </StepBarContainer>
          </StepSection>

          {/* Contact Name */}
          <Label>{t('profile.emergencyContact.nameLabel')}</Label>
          <StyledInput
            value={contactName}
            onChangeText={setContactName}
            placeholder={t('profile.emergencyContact.namePlaceholder')}
            placeholderTextColor={colors.gray[40]}
            autoCapitalize="words"
            testID="emergency-contact-name-input"
            accessibilityLabel={t('profile.emergencyContact.nameLabel')}
          />

          {/* Phone Number */}
          <Label>{t('profile.emergencyContact.phoneLabel')}</Label>
          <StyledInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={t('profile.emergencyContact.phonePlaceholder')}
            placeholderTextColor={colors.gray[40]}
            keyboardType="phone-pad"
            testID="emergency-contact-phone-input"
            accessibilityLabel={t('profile.emergencyContact.phoneLabel')}
          />

          {/* Relationship */}
          <SectionLabel>
            {t('profile.emergencyContact.relationshipLabel')}
          </SectionLabel>
          <ChipsContainer>
            {RELATIONSHIPS.map((rel) => {
              const isSelected = relationship === rel;
              return (
                <Chip
                  key={rel}
                  selected={isSelected}
                  onPress={() => selectRelationship(rel)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={t(`profile.emergencyContact.relationships.${rel}`)}
                  testID={`emergency-contact-rel-${rel}`}
                >
                  <ChipText selected={isSelected}>
                    {t(`profile.emergencyContact.relationships.${rel}`)}
                  </ChipText>
                </Chip>
              );
            })}
          </ChipsContainer>

          {/* Primary Toggle */}
          <ToggleRow>
            <ToggleLabel>
              {t('profile.emergencyContact.primaryLabel')}
            </ToggleLabel>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{
                false: colors.gray[30],
                true: colors.brand.primary,
              }}
              testID="emergency-contact-primary-toggle"
              accessibilityLabel={t('profile.emergencyContact.primaryLabel')}
              accessibilityRole="switch"
            />
          </ToggleRow>
        </ContentWrapper>
      </ScrollView>

      {/* Save Button */}
      <BottomSection>
        <SaveButton
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={t('common.buttons.save')}
          testID="emergency-contact-save"
        >
          <SaveButtonText>
            {t('common.buttons.save')}
          </SaveButtonText>
        </SaveButton>
      </BottomSection>
    </Container>
  );
};

export default ProfileEmergencyContact;
