import React from 'react';
import { ScrollView, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
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

const CardsContainer = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.lg};
`;

const ChannelCard = styled.View`
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${colors.gray[10]};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.lg};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const ChannelHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const ChannelIconContainer = styled.View<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.md};
  background-color: ${(props) => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const ChannelIconText = styled.Text`
  font-size: 22px;
  color: ${colors.neutral.white};
`;

const ChannelTitleContainer = styled.View`
  flex: 1;
`;

const ChannelTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
`;

const OnlineBadge = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const OnlineDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colors.semantic.success};
  margin-right: ${spacing.xs};
`;

const OnlineText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.semantic.success};
  font-weight: ${typography.fontWeight.medium};
`;

const ChannelDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.sm};
`;

const ChannelInfo = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
`;

const ChannelSubInfo = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.md};
`;

const ActionButton = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.sm};
  align-items: center;
  justify-content: center;
  height: ${sizing.component.sm};
`;

const ActionButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const OperatingHoursSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.lg};
  padding-bottom: ${spacing.xl};
`;

const OperatingHoursTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[50]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const OperatingHoursRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${spacing.xs};
`;

const DayText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.neutral.gray900};
`;

const HoursText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
`;

// --- Component ---

export const ContactSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleStartChat = () => {
    navigation.navigate(ROUTES.HELP_CHAT as never);
  };

  const handleCall = async () => {
    const phoneUrl = `tel:${t('help.contact.phoneNumber')}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Erro', 'Nao foi possivel abrir o telefone.');
      }
    } catch {
      Alert.alert('Erro', 'Nao foi possivel realizar a chamada.');
    }
  };

  const handleSendEmail = async () => {
    const emailUrl = `mailto:${t('help.contact.emailAddress')}`;
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Erro', 'Nao foi possivel abrir o email.');
      }
    } catch {
      Alert.alert('Erro', 'Nao foi possivel abrir o cliente de email.');
    }
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Header>
          <Title accessibilityRole="header" testID="contact-support-title">
            {t('help.contact.title')}
          </Title>
        </Header>

        <CardsContainer>
          {/* Live Chat Card */}
          <ChannelCard>
            <ChannelHeader>
              <ChannelIconContainer bgColor={colors.brand.primary}>
                <ChannelIconText>{'\u{1F4AC}'}</ChannelIconText>
              </ChannelIconContainer>
              <ChannelTitleContainer>
                <ChannelTitle>{t('help.contact.chat')}</ChannelTitle>
                <OnlineBadge>
                  <OnlineDot />
                  <OnlineText>{t('help.contact.chatOnline')}</OnlineText>
                </OnlineBadge>
              </ChannelTitleContainer>
            </ChannelHeader>
            <ChannelDescription>
              {t('help.contact.chatDescription')}
            </ChannelDescription>
            <ActionButton
              bgColor={colors.brand.primary}
              onPress={handleStartChat}
              accessibilityRole="button"
              accessibilityLabel={t('help.contact.startChat')}
              testID="contact-start-chat"
            >
              <ActionButtonText>{t('help.contact.startChat')}</ActionButtonText>
            </ActionButton>
          </ChannelCard>

          {/* Phone Card */}
          <ChannelCard>
            <ChannelHeader>
              <ChannelIconContainer bgColor={colors.journeys.care.primary}>
                <ChannelIconText>{'\u260E'}</ChannelIconText>
              </ChannelIconContainer>
              <ChannelTitleContainer>
                <ChannelTitle>{t('help.contact.phone')}</ChannelTitle>
              </ChannelTitleContainer>
            </ChannelHeader>
            <ChannelInfo>{t('help.contact.phoneNumber')}</ChannelInfo>
            <ChannelSubInfo>{t('help.contact.phoneHours')}</ChannelSubInfo>
            <ActionButton
              bgColor={colors.journeys.care.primary}
              onPress={handleCall}
              accessibilityRole="button"
              accessibilityLabel={t('help.contact.call')}
              testID="contact-call"
            >
              <ActionButtonText>{t('help.contact.call')}</ActionButtonText>
            </ActionButton>
          </ChannelCard>

          {/* Email Card */}
          <ChannelCard>
            <ChannelHeader>
              <ChannelIconContainer bgColor={colors.journeys.plan.primary}>
                <ChannelIconText>{'\u2709'}</ChannelIconText>
              </ChannelIconContainer>
              <ChannelTitleContainer>
                <ChannelTitle>{t('help.contact.email')}</ChannelTitle>
              </ChannelTitleContainer>
            </ChannelHeader>
            <ChannelInfo>{t('help.contact.emailAddress')}</ChannelInfo>
            <ChannelSubInfo>{t('help.contact.emailResponse')}</ChannelSubInfo>
            <ActionButton
              bgColor={colors.journeys.plan.primary}
              onPress={handleSendEmail}
              accessibilityRole="button"
              accessibilityLabel={t('help.contact.sendEmail')}
              testID="contact-send-email"
            >
              <ActionButtonText>{t('help.contact.sendEmail')}</ActionButtonText>
            </ActionButton>
          </ChannelCard>
        </CardsContainer>

        <OperatingHoursSection>
          <OperatingHoursTitle>
            {t('help.contact.operatingHours')}
          </OperatingHoursTitle>
          <OperatingHoursRow>
            <DayText>Segunda - Sexta</DayText>
            <HoursText>08:00 - 20:00</HoursText>
          </OperatingHoursRow>
          <OperatingHoursRow>
            <DayText>Sabado</DayText>
            <HoursText>09:00 - 14:00</HoursText>
          </OperatingHoursRow>
          <OperatingHoursRow>
            <DayText>Domingo / Feriados</DayText>
            <HoursText>Fechado</HoursText>
          </OperatingHoursRow>
        </OperatingHoursSection>
      </ScrollView>
    </Container>
  );
};

export default ContactSupportScreen;
