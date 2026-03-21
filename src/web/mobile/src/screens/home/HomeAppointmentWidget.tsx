import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

import type { HomeTabScreenNavigationProp } from '../../navigation/types';

// --- Styled Components ---

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${spacing.md};
    padding-vertical: ${spacing.sm};
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme }) => theme.colors.border.default};
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
    color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
    flex: 1;
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
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
    color: ${({ theme }) => theme.colors.text.default};
`;

const SeeAllButton = styled.TouchableOpacity`
    padding-vertical: ${spacing['3xs']};
    padding-horizontal: ${spacing.xs};
`;

const SeeAllText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.brand.primary};
`;

const AppointmentCard = styled.View`
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-horizontal: ${spacing.md};
    margin-bottom: ${spacing.sm};
    border-left-width: 4px;
    border-left-color: ${colors.journeys.care.primary};
    shadow-color: ${colors.neutral.black};
    shadow-offset: 0px 1px;
    shadow-opacity: 0.06;
    shadow-radius: 3px;
    elevation: 2;
`;

const CardTopRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${spacing.xs};
`;

const DoctorName = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.default};
`;

const TelemedicineBadge = styled.View`
    background-color: ${colors.brand.primary}15;
    padding-horizontal: ${spacing.xs};
    padding-vertical: ${spacing['4xs']};
    border-radius: ${borderRadius.full};
`;

const BadgeText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.brand.primary};
`;

const Specialty = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing['3xs']};
`;

const DateTimeText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.journeys.care.primary};
    margin-bottom: ${spacing.sm};
`;

const JoinButton = styled.TouchableOpacity`
    background-color: ${colors.brand.primary};
    border-radius: ${borderRadius.sm};
    padding-vertical: ${spacing.xs};
    align-items: center;
`;

const JoinButtonText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.onBrand};
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
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${spacing.xs};
`;

const EmptyDescription = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${({ theme }) => theme.colors.text.subtle};
    text-align: center;
`;

// --- Types ---

interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    dateTime: string;
    isTelemedicine: boolean;
}

// --- Mock Data ---

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'appt-1',
        doctorName: 'Dr. Ana Silva',
        specialty: 'Cardiologia',
        dateTime: '22 Fev, 10:00',
        isTelemedicine: true,
    },
    {
        id: 'appt-2',
        doctorName: 'Dr. Carlos Lima',
        specialty: 'Clinica Geral',
        dateTime: '25 Fev, 14:30',
        isTelemedicine: false,
    },
    {
        id: 'appt-3',
        doctorName: 'Dra. Maria Costa',
        specialty: 'Dermatologia',
        dateTime: '01 Mar, 09:00',
        isTelemedicine: true,
    },
];

// --- Component ---

export const HomeAppointmentWidgetScreen: React.FC = () => {
    const navigation = useNavigation<HomeTabScreenNavigationProp>();
    const { t } = useTranslation();

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSeeAll = useCallback(() => {
        navigation.navigate('Care', { screen: 'CareAppointments', params: {} });
    }, [navigation]);

    const handleJoin = useCallback(
        (appointmentId: string) => {
            navigation.navigate('Care', {
                screen: 'CareTelemedicine',
                params: { sessionId: appointmentId },
            });
        },
        [navigation]
    );

    const renderAppointment = useCallback(
        ({ item }: { item: Appointment }) => (
            <AppointmentCard testID={`appointment-card-${item.id}`}>
                <CardTopRow>
                    <DoctorName>{item.doctorName}</DoctorName>
                    {item.isTelemedicine && (
                        <TelemedicineBadge>
                            <BadgeText>{t('home.appointmentWidget.telemedicine')}</BadgeText>
                        </TelemedicineBadge>
                    )}
                </CardTopRow>
                <Specialty>{item.specialty}</Specialty>
                <DateTimeText>{item.dateTime}</DateTimeText>
                {item.isTelemedicine && (
                    <JoinButton
                        onPress={() => handleJoin(item.id)}
                        accessibilityRole="button"
                        accessibilityLabel={t('home.appointmentWidget.joinCall', {
                            doctor: item.doctorName,
                        })}
                        testID={`appointment-join-${item.id}`}
                    >
                        <JoinButtonText>{t('home.appointmentWidget.join')}</JoinButtonText>
                    </JoinButton>
                )}
            </AppointmentCard>
        ),
        [handleJoin, t]
    );

    const keyExtractor = useCallback((item: Appointment) => item.id, []);

    return (
        <Container>
            <Header>
                <BackButton
                    onPress={handleGoBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                    testID="appointment-widget-back"
                >
                    <BackText>{'\u003C'}</BackText>
                </BackButton>
                <HeaderTitle accessibilityRole="header" testID="appointment-widget-title">
                    {t('home.appointmentWidget.title')}
                </HeaderTitle>
                <HeaderSpacer />
            </Header>

            <SectionHeader>
                <SectionTitle>{t('home.appointmentWidget.upcoming')}</SectionTitle>
                <SeeAllButton
                    onPress={handleSeeAll}
                    accessibilityRole="link"
                    accessibilityLabel={t('home.appointmentWidget.seeAll')}
                    testID="appointment-see-all"
                >
                    <SeeAllText>{t('home.appointmentWidget.seeAll')}</SeeAllText>
                </SeeAllButton>
            </SectionHeader>

            {MOCK_APPOINTMENTS.length === 0 ? (
                <EmptyContainer testID="appointment-widget-empty">
                    <EmptyIcon accessibilityElementsHidden>{'\uD83D\uDCC5'}</EmptyIcon>
                    <EmptyTitle>{t('home.appointmentWidget.emptyTitle')}</EmptyTitle>
                    <EmptyDescription>{t('home.appointmentWidget.emptyDescription')}</EmptyDescription>
                </EmptyContainer>
            ) : (
                <FlatList
                    data={MOCK_APPOINTMENTS}
                    renderItem={renderAppointment}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </Container>
    );
};

export default HomeAppointmentWidgetScreen;
