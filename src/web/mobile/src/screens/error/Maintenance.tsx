import React, { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing['2xl']};
`;

const IconCircle = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: ${colors.semantic.infoBg};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const IconText = styled.Text`
  font-size: 48px;
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
  margin-bottom: ${spacing.xs};
`;

const Description = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing.xl};
  padding-horizontal: ${spacing.md};
`;

const ScheduleCard = styled.View`
  width: 100%;
  max-width: 280px;
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  align-items: center;
  margin-bottom: ${spacing['2xl']};
`;

const ScheduleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.subtle};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${spacing['3xs']};
`;

const ScheduleTime = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const NotifyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 280px;
  background-color: ${({ theme }) => theme.colors.background.default};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  margin-bottom: ${spacing.xl};
`;

const NotifyLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
`;

const ToggleButton = styled.TouchableOpacity<{ active: boolean }>`
  width: 52px;
  height: 28px;
  border-radius: 14px;
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
  justify-content: center;
  padding-horizontal: 2px;
`;

const ToggleKnob = styled.View<{ active: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background.default};
  align-self: ${(props) => (props.active ? 'flex-end' : 'flex-start')};
`;

const ProgressRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${spacing.md};
`;

const ProgressDot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[20]};
  margin-horizontal: ${spacing['4xs']};
`;

const ProgressLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-left: ${spacing.xs};
`;

// --- Component ---

/**
 * Maintenance -- Displayed during scheduled maintenance windows.
 * Shows a wrench icon, maintenance description, expected return time,
 * and a "Notify me when ready" toggle.
 */
export const Maintenance: React.FC = () => {
  const { t } = useTranslation();
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  const handleToggleNotify = useCallback(() => {
    setNotifyEnabled((prev) => !prev);
  }, []);

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer>
          <IconCircle>
            <IconText testID="maintenance-icon">{'\u{1F527}'}</IconText>
          </IconCircle>

          <Title testID="maintenance-title">
            {t('error.maintenance.title')}
          </Title>

          <Description testID="maintenance-description">
            {t('error.maintenance.description')}
          </Description>

          <ScheduleCard>
            <ScheduleLabel testID="maintenance-schedule-label">
              {t('error.maintenance.expectedBack')}
            </ScheduleLabel>
            <ScheduleTime testID="maintenance-schedule-time">
              10:00 AM
            </ScheduleTime>
          </ScheduleCard>

          <NotifyRow>
            <NotifyLabel testID="maintenance-notify-label">
              {t('error.maintenance.notifyMe')}
            </NotifyLabel>
            <ToggleButton
              active={notifyEnabled}
              onPress={handleToggleNotify}
              accessibilityRole="switch"
              accessibilityState={{ checked: notifyEnabled }}
              accessibilityLabel={t('error.maintenance.notifyMe')}
              testID="maintenance-notify-toggle"
            >
              <ToggleKnob active={notifyEnabled} />
            </ToggleButton>
          </NotifyRow>

          <ProgressRow>
            <ProgressDot active />
            <ProgressDot active />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressLabel testID="maintenance-progress">
              {t('error.maintenance.inProgress')}
            </ProgressLabel>
          </ProgressRow>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default Maintenance;
