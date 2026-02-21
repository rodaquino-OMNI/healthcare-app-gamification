import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
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
`;

const BackText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  text-align: center;
`;

const HeaderSpacer = styled.View`
  width: ${sizing.component.sm};
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-top: ${spacing.lg};
  padding-bottom: ${spacing.sm};
`;

const SectionTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
`;

const ViewAllButton = styled.TouchableOpacity`
  padding-vertical: ${spacing['3xs']};
  padding-horizontal: ${spacing.xs};
`;

const ViewAllText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const ReminderCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-bottom: ${spacing.sm};
  border-left-width: 4px;
  border-left-color: ${colors.journeys.health.primary};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 3px;
  elevation: 2;
`;

const PillIcon = styled.Text`
  font-size: ${typography.fontSize['heading-xl']};
  margin-right: ${spacing.sm};
`;

const ReminderInfo = styled.View`
  flex: 1;
`;

const DrugName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing['4xs']};
`;

const DosageText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing['4xs']};
`;

const TimeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.journeys.health.primary};
`;

const ActionColumn = styled.View`
  align-items: center;
`;

const TakeButton = styled.TouchableOpacity`
  background-color: ${colors.journeys.health.primary};
  border-radius: ${borderRadius.sm};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.xs};
  margin-bottom: ${spacing['3xs']};
`;

const TakeButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.white};
`;

const SkipButton = styled.TouchableOpacity`
  padding-vertical: ${spacing['3xs']};
`;

const SkipText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[40]};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['3xl']};
`;

const EmptyIcon = styled.Text`
  font-size: 48px;
  margin-bottom: ${spacing.md};
`;

const EmptyTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.xs};
`;

const EmptyDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[40]};
  text-align: center;
`;

// --- Types ---

interface MedicationReminder {
  id: string;
  drugName: string;
  dosage: string;
  time: string;
}

// --- Mock Data ---

const MOCK_REMINDERS: MedicationReminder[] = [
  {
    id: 'med-1',
    drugName: 'Losartana 50mg',
    dosage: '1 comprimido',
    time: '08:00',
  },
  {
    id: 'med-2',
    drugName: 'Metformina 850mg',
    dosage: '1 comprimido',
    time: '12:00',
  },
  {
    id: 'med-3',
    drugName: 'Sinvastatina 20mg',
    dosage: '1 comprimido',
    time: '22:00',
  },
];

// --- Component ---

export const HomeMedicationRemindersScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [reminders, setReminders] = useState(MOCK_REMINDERS);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewAll = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_MEDICATION_LIST as never);
  }, [navigation]);

  const handleTake = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleSkip = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const renderReminder = useCallback(
    ({ item }: { item: MedicationReminder }) => (
      <ReminderCard testID={`reminder-card-${item.id}`}>
        <PillIcon accessibilityElementsHidden>{'\uD83D\uDC8A'}</PillIcon>
        <ReminderInfo>
          <DrugName>{item.drugName}</DrugName>
          <DosageText>{item.dosage}</DosageText>
          <TimeText>{item.time}</TimeText>
        </ReminderInfo>
        <ActionColumn>
          <TakeButton
            onPress={() => handleTake(item.id)}
            accessibilityRole="button"
            accessibilityLabel={t('home.medicationReminders.take', {
              name: item.drugName,
            })}
            testID={`reminder-take-${item.id}`}
          >
            <TakeButtonText>
              {t('home.medicationReminders.takeNow')}
            </TakeButtonText>
          </TakeButton>
          <SkipButton
            onPress={() => handleSkip(item.id)}
            accessibilityRole="button"
            accessibilityLabel={t('home.medicationReminders.skip', {
              name: item.drugName,
            })}
            testID={`reminder-skip-${item.id}`}
          >
            <SkipText>{t('home.medicationReminders.skipDose')}</SkipText>
          </SkipButton>
        </ActionColumn>
      </ReminderCard>
    ),
    [handleTake, handleSkip, t],
  );

  const keyExtractor = useCallback((item: MedicationReminder) => item.id, []);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="med-reminders-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="med-reminders-title"
        >
          {t('home.medicationReminders.title')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      <SectionHeader>
        <SectionTitle>
          {t('home.medicationReminders.upcoming')}
        </SectionTitle>
        <ViewAllButton
          onPress={handleViewAll}
          accessibilityRole="link"
          accessibilityLabel={t('home.medicationReminders.viewAll')}
          testID="med-reminders-view-all"
        >
          <ViewAllText>
            {t('home.medicationReminders.viewAll')}
          </ViewAllText>
        </ViewAllButton>
      </SectionHeader>

      {reminders.length === 0 ? (
        <EmptyContainer testID="med-reminders-empty">
          <EmptyIcon accessibilityElementsHidden>{'\u2705'}</EmptyIcon>
          <EmptyTitle>
            {t('home.medicationReminders.emptyTitle')}
          </EmptyTitle>
          <EmptyDescription>
            {t('home.medicationReminders.emptyDescription')}
          </EmptyDescription>
        </EmptyContainer>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderReminder}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
};

export default HomeMedicationRemindersScreen;
