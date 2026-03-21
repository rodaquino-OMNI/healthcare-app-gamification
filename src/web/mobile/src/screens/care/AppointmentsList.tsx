import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    type: 'in-person' | 'telemedicine';
}

type FilterTab = 'upcoming' | 'past' | 'cancelled';

const MOCK_UPCOMING: Appointment[] = [
    {
        id: 'apt-1',
        doctorName: 'Dra. Ana Carolina Silva',
        specialty: 'Cardiologia',
        date: '2026-03-05',
        time: '09:00',
        status: 'confirmed',
        type: 'in-person',
    },
    {
        id: 'apt-2',
        doctorName: 'Dr. Ricardo Mendes',
        specialty: 'Dermatologia',
        date: '2026-03-08',
        time: '14:00',
        status: 'pending',
        type: 'telemedicine',
    },
    {
        id: 'apt-3',
        doctorName: 'Dra. Juliana Costa',
        specialty: 'Pediatria',
        date: '2026-03-10',
        time: '10:30',
        status: 'confirmed',
        type: 'in-person',
    },
    {
        id: 'apt-4',
        doctorName: 'Dr. Fernando Alves',
        specialty: 'Ortopedia',
        date: '2026-03-12',
        time: '11:00',
        status: 'pending',
        type: 'telemedicine',
    },
    {
        id: 'apt-5',
        doctorName: 'Dra. Mariana Rocha',
        specialty: 'Neurologia',
        date: '2026-03-15',
        time: '15:00',
        status: 'confirmed',
        type: 'in-person',
    },
];

const MOCK_PAST: Appointment[] = [
    {
        id: 'apt-6',
        doctorName: 'Dr. Carlos Lima',
        specialty: 'Clinica Geral',
        date: '2026-02-10',
        time: '08:00',
        status: 'confirmed',
        type: 'in-person',
    },
    {
        id: 'apt-7',
        doctorName: 'Dra. Beatriz Santos',
        specialty: 'Ginecologia',
        date: '2026-02-05',
        time: '16:00',
        status: 'confirmed',
        type: 'telemedicine',
    },
    {
        id: 'apt-8',
        doctorName: 'Dr. Paulo Ferreira',
        specialty: 'Oftalmologia',
        date: '2026-01-20',
        time: '09:30',
        status: 'confirmed',
        type: 'in-person',
    },
];

const MOCK_CANCELLED: Appointment[] = [
    {
        id: 'apt-9',
        doctorName: 'Dra. Lucia Ribeiro',
        specialty: 'Endocrinologia',
        date: '2026-02-15',
        time: '14:30',
        status: 'cancelled',
        type: 'in-person',
    },
    {
        id: 'apt-10',
        doctorName: 'Dr. Marcos Oliveira',
        specialty: 'Urologia',
        date: '2026-02-12',
        time: '10:00',
        status: 'cancelled',
        type: 'telemedicine',
    },
];

const STATUS_MAP: Record<string, { labelKey: string; badge: 'success' | 'warning' | 'error' }> = {
    confirmed: { labelKey: 'consultation.appointmentsList.confirmed', badge: 'success' },
    pending: { labelKey: 'consultation.appointmentsList.pending', badge: 'warning' },
    cancelled: { labelKey: 'consultation.appointmentsList.cancelled', badge: 'error' },
};

const formatDateBR = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};

export const AppointmentsList: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

    const tabs: { key: FilterTab; labelKey: string }[] = [
        { key: 'upcoming', labelKey: 'consultation.appointmentsList.upcoming' },
        { key: 'past', labelKey: 'consultation.appointmentsList.past' },
        { key: 'cancelled', labelKey: 'consultation.appointmentsList.cancelled' },
    ];

    const filteredData = useMemo(() => {
        if (activeTab === 'upcoming') {
            return MOCK_UPCOMING;
        }
        if (activeTab === 'past') {
            return MOCK_PAST;
        }
        return MOCK_CANCELLED;
    }, [activeTab]);

    const handleAppointmentPress = useCallback(
        (id: string) => {
            navigation.navigate(ROUTES.CARE_APPOINTMENTS, { id });
        },
        [navigation]
    );

    const handleNewAppointment = useCallback(() => {
        navigation.navigate(ROUTES.CARE_DOCTOR_SEARCH);
    }, [navigation]);

    const renderItem = useCallback(
        ({ item }: { item: Appointment }) => {
            const statusInfo = STATUS_MAP[item.status];
            const typeKey =
                item.type === 'telemedicine'
                    ? 'consultation.appointmentsList.telemedicine'
                    : 'consultation.appointmentsList.inPerson';

            return (
                <TouchableOpacity
                    onPress={() => handleAppointmentPress(item.id)}
                    accessibilityLabel={`${item.doctorName}, ${formatDateBR(item.date)} ${item.time}`}
                    accessibilityRole="button"
                    testID={`appointment-card-${item.id}`}
                >
                    <Card journey="care" elevation="sm">
                        <View style={styles.cardHeader}>
                            <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                                {item.doctorName}
                            </Text>
                            <Badge journey="care" size="sm">
                                {item.specialty}
                            </Badge>
                        </View>
                        <View style={styles.cardDateTime}>
                            <Text fontSize="sm" color={colors.neutral.gray700}>
                                {formatDateBR(item.date)} - {item.time}
                            </Text>
                        </View>
                        <View style={styles.cardBadges}>
                            <Badge variant="status" status={statusInfo.badge} size="sm">
                                {t(statusInfo.labelKey)}
                            </Badge>
                            <Badge journey="care" size="sm">
                                {t(typeKey)}
                            </Badge>
                        </View>
                    </Card>
                </TouchableOpacity>
            );
        },
        [handleAppointmentPress, t]
    );

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
                    {t('consultation.appointmentsList.empty')}
                </Text>
            </View>
        ),
        [t]
    );

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    testID="back-button"
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <Text fontSize="lg">{'<-'}</Text>
                </TouchableOpacity>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
                    {t('consultation.appointmentsList.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabsRow}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            style={[styles.tab, isActive && styles.tabActive]}
                            accessibilityLabel={t(tab.labelKey)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                            testID={`tab-${tab.key}`}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={isActive ? 'bold' : 'regular'}
                                color={isActive ? colors.neutral.white : colors.journeys.care.primary}
                            >
                                {t(tab.labelKey)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                testID="appointments-list"
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={handleNewAppointment}
                accessibilityLabel={t('consultation.appointmentsList.newAppointment')}
                accessibilityRole="button"
                testID="fab-new-appointment"
            >
                <Text fontSize="xl" fontWeight="bold" color={colors.neutral.white}>
                    +
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues.lg,
        paddingBottom: spacingValues.sm,
    },
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacingValues.md,
        gap: spacingValues.xs,
        marginBottom: spacingValues.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: spacingValues.xs,
        borderRadius: spacingValues.xl,
        borderWidth: 1,
        borderColor: colors.journeys.care.primary,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: colors.journeys.care.primary,
    },
    listContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues['3xs'],
    },
    cardDateTime: {
        marginBottom: spacingValues.xs,
    },
    cardBadges: {
        flexDirection: 'row',
        gap: spacingValues.xs,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacingValues['5xl'],
    },
    fab: {
        position: 'absolute',
        right: spacingValues.md,
        bottom: spacingValues.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.journeys.care.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: colors.neutral.gray700,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

export default AppointmentsList;
