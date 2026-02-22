import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['3xl']};
`;

const WelcomeIcon = styled.Text`
  font-size: 72px;
  margin-bottom: ${spacing.xl};
`;

const WelcomeTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const WelcomeSubtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing['2xl']};
`;

const ChecklistSection = styled.View`
  width: 100%;
  margin-bottom: ${spacing.xl};
`;

const ChecklistTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.md};
`;

const ChecklistItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing.xs};
`;

const CheckCircle = styled.View<{ completed: boolean }>`
  width: ${sizing.component.xs};
  height: ${sizing.component.xs};
  border-radius: ${borderRadius.full};
  border-width: 2px;
  border-color: ${(props) =>
    props.completed ? colors.semantic.success : colors.gray[30]};
  background-color: ${(props) =>
    props.completed ? colors.semantic.success : 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const CheckMark = styled.Text`
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const ChecklistLabel = styled.Text<{ completed: boolean }>`
  flex: 1;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) =>
    props.completed ? colors.gray[40] : colors.neutral.gray900};
  text-decoration-line: ${(props) =>
    props.completed ? 'line-through' : 'none'};
`;

const ChevronText = styled.Text`
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CTASection = styled.View`
  width: 100%;
  margin-top: ${spacing.lg};
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.md};
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SecondaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.md};
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const SecondaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

// --- Types ---

interface ChecklistEntry {
  id: string;
  labelKey: string;
  completed: boolean;
  route: string;
}

// --- Mock Data ---

const SETUP_CHECKLIST: ChecklistEntry[] = [
  {
    id: 'profile',
    labelKey: 'home.empty.checklistProfile',
    completed: true,
    route: ROUTES.PROFILE,
  },
  {
    id: 'goals',
    labelKey: 'home.empty.checklistGoals',
    completed: false,
    route: ROUTES.HEALTH_HEALTH_GOALS,
  },
  {
    id: 'device',
    labelKey: 'home.empty.checklistDevice',
    completed: false,
    route: ROUTES.HEALTH_DEVICE_CONNECTION,
  },
  {
    id: 'appointment',
    labelKey: 'home.empty.checklistAppointment',
    completed: false,
    route: ROUTES.CARE_APPOINTMENT_BOOKING,
  },
  {
    id: 'medication',
    labelKey: 'home.empty.checklistMedication',
    completed: false,
    route: ROUTES.HEALTH_MEDICATION_ADD,
  },
];

// --- Component ---

export const HomeEmptyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleChecklistPress = useCallback(
    (route: string) => {
      navigation.navigate(route as never);
    },
    [navigation],
  );

  const handleExplore = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_DASHBOARD as never);
  }, [navigation]);

  const handleBookAppointment = useCallback(() => {
    navigation.navigate(ROUTES.CARE_APPOINTMENT_BOOKING as never);
  }, [navigation]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentContainer>
          <WelcomeIcon
            accessibilityElementsHidden
            testID="home-empty-icon"
          >
            {'\uD83C\uDF1F'}
          </WelcomeIcon>

          <WelcomeTitle testID="home-empty-title">
            {t('home.empty.title')}
          </WelcomeTitle>

          <WelcomeSubtitle testID="home-empty-subtitle">
            {t('home.empty.subtitle')}
          </WelcomeSubtitle>

          <ChecklistSection>
            <ChecklistTitle testID="home-empty-checklist-title">
              {t('home.empty.checklistTitle')}
            </ChecklistTitle>

            {SETUP_CHECKLIST.map((item) => (
              <ChecklistItem
                key={item.id}
                onPress={() => handleChecklistPress(item.route)}
                accessibilityRole="button"
                accessibilityLabel={t(item.labelKey)}
                accessibilityState={{ checked: item.completed }}
                testID={`home-empty-checklist-${item.id}`}
              >
                <CheckCircle completed={item.completed}>
                  {item.completed && <CheckMark>{'\u2713'}</CheckMark>}
                </CheckCircle>
                <ChecklistLabel completed={item.completed}>
                  {t(item.labelKey)}
                </ChecklistLabel>
                {!item.completed && (
                  <ChevronText accessibilityElementsHidden>
                    {'\u203A'}
                  </ChevronText>
                )}
              </ChecklistItem>
            ))}
          </ChecklistSection>

          <CTASection>
            <PrimaryButton
              onPress={handleExplore}
              accessibilityRole="button"
              accessibilityLabel={t('home.empty.explore')}
              testID="home-empty-explore"
            >
              <PrimaryButtonText>
                {t('home.empty.explore')}
              </PrimaryButtonText>
            </PrimaryButton>

            <SecondaryButton
              onPress={handleBookAppointment}
              accessibilityRole="button"
              accessibilityLabel={t('home.empty.bookFirst')}
              testID="home-empty-book"
            >
              <SecondaryButtonText>
                {t('home.empty.bookFirst')}
              </SecondaryButtonText>
            </SecondaryButton>
          </CTASection>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default HomeEmptyScreen;
