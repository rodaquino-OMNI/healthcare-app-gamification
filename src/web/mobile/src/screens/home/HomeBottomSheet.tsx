import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import type { HomeTabScreenNavigationProp } from '../../navigation/types';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled Components ---

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

const SheetContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-top-left-radius: ${borderRadius.xl};
  border-top-right-radius: ${borderRadius.xl};
  padding-top: ${spacing.sm};
  padding-bottom: ${spacing['3xl']};
  padding-horizontal: ${spacing.xl};
`;

const DragHandle = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${colors.gray[20]};
  border-radius: ${borderRadius.full};
  align-self: center;
  margin-bottom: ${spacing.lg};
`;

const SheetTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.lg};
`;

const ActionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const ActionIconCircle = styled.View<{ bgColor: string }>`
  width: ${sizing.component.md};
  height: ${sizing.component.md};
  border-radius: ${borderRadius.full};
  background-color: ${(props) => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const ActionIcon = styled.Text`
  font-size: ${typography.fontSize['text-lg']};
`;

const ActionLabel = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
`;

const ChevronText = styled.Text`
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

// --- Types ---

interface HomeBottomSheetProps {
  onClose: () => void;
}

interface QuickAction {
  id: string;
  icon: string;
  labelKey: string;
  bgColor: string;
  route: string;
}

// --- Mock Data ---

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'add-metric',
    icon: '\uD83D\uDCCA',
    labelKey: 'home.bottomSheet.addMetric',
    bgColor: `${colors.journeys.health.primary}20`,
    route: ROUTES.HEALTH_ADD_METRIC,
  },
  {
    id: 'book-appointment',
    icon: '\uD83D\uDCC5',
    labelKey: 'home.bottomSheet.bookAppointment',
    bgColor: `${colors.journeys.care.primary}20`,
    route: ROUTES.CARE_APPOINTMENT_BOOKING,
  },
  {
    id: 'check-symptoms',
    icon: '\uD83E\uDE7A',
    labelKey: 'home.bottomSheet.checkSymptoms',
    bgColor: `${colors.semantic.warning}20`,
    route: ROUTES.CARE_SYMPTOM_CHECKER,
  },
  {
    id: 'log-medication',
    icon: '\uD83D\uDC8A',
    labelKey: 'home.bottomSheet.logMedication',
    bgColor: `${colors.journeys.plan.primary}20`,
    route: ROUTES.HEALTH_MEDICATION_LIST,
  },
];

// --- Component ---

export const HomeBottomSheet: React.FC<HomeBottomSheetProps> = ({ onClose }) => {
  const navigation = useNavigation<HomeTabScreenNavigationProp>();
  const { t } = useTranslation();

  const handleActionPress = useCallback(
    (route: string) => {
      onClose();
      switch (route) {
        case ROUTES.HEALTH_ADD_METRIC:
          navigation.navigate('Health', { screen: 'HealthAddMetric' });
          break;
        case ROUTES.HEALTH_MEDICATION_LIST:
          navigation.navigate('Health', { screen: 'HealthMedicationList' });
          break;
        case ROUTES.CARE_APPOINTMENT_BOOKING:
          navigation.navigate('Care', { screen: 'CareAppointmentBooking' });
          break;
        case ROUTES.CARE_SYMPTOM_CHECKER:
          navigation.navigate('Care', { screen: 'CareSymptomChecker', params: {} } as any);
          break;
        default:
          break;
      }
    },
    [navigation, onClose],
  );

  return (
    <Overlay
      activeOpacity={1}
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel={t('home.bottomSheet.closeOverlay')}
      testID="bottom-sheet-overlay"
    >
      <SheetContainer
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => {}}
      >
        <DragHandle />
        <SheetTitle
          accessibilityRole="header"
          testID="bottom-sheet-title"
        >
          {t('home.bottomSheet.title')}
        </SheetTitle>

        {QUICK_ACTIONS.map((action) => (
          <ActionRow
            key={action.id}
            onPress={() => handleActionPress(action.route)}
            accessibilityRole="button"
            accessibilityLabel={t(action.labelKey)}
            testID={`bottom-sheet-action-${action.id}`}
          >
            <ActionIconCircle bgColor={action.bgColor}>
              <ActionIcon accessibilityElementsHidden>
                {action.icon}
              </ActionIcon>
            </ActionIconCircle>
            <ActionLabel>{t(action.labelKey)}</ActionLabel>
            <ChevronText accessibilityElementsHidden>
              {'\u203A'}
            </ChevronText>
          </ActionRow>
        ))}
      </SheetContainer>
    </Overlay>
  );
};

export default HomeBottomSheet;
