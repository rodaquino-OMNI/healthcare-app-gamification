import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

type AppointmentTypeValue = 'in-person' | 'telemedicine' | 'home-visit';

interface TypeOption {
    value: AppointmentTypeValue;
    icon: string;
    titleKey: string;
    descKey: string;
    price: string;
    availableSlots: number;
}

const TYPE_OPTIONS: TypeOption[] = [
    {
        value: 'in-person',
        icon: '\u{1F3E5}',
        titleKey: 'consultation.appointmentType.inPerson',
        descKey: 'consultation.appointmentType.inPersonDesc',
        price: 'R$ 250,00',
        availableSlots: 8,
    },
    {
        value: 'telemedicine',
        icon: '\u{1F4F9}',
        titleKey: 'consultation.appointmentType.telemedicine',
        descKey: 'consultation.appointmentType.telemedicineDesc',
        price: 'R$ 180,00',
        availableSlots: 12,
    },
    {
        value: 'home-visit',
        icon: '\u{1F3E0}',
        titleKey: 'consultation.appointmentType.homeVisit',
        descKey: 'consultation.appointmentType.homeVisitDesc',
        price: 'R$ 450,00',
        availableSlots: 3,
    },
];

/**
 * AppointmentType screen lets the user select the type of appointment:
 * In-Person, Telemedicine, or Home Visit.
 * Each option shows estimated price and availability.
 */
export const AppointmentType: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareAppointmentType'>>();
    const { t } = useTranslation();
    const doctorId = route.params?.doctorId ?? 'doc-001';

    const [selected, setSelected] = useState<AppointmentTypeValue | null>(null);

    const handleContinue = useCallback(() => {
        if (!selected) {
            return;
        }
        navigation.navigate(ROUTES.CARE_BOOKING_REASON, {
            doctorId,
            appointmentType: selected,
        });
    }, [navigation, doctorId, selected]);

    return (
        <View style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    testID="back-button"
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <Text fontSize="lg">{'\u2190'}</Text>
                </TouchableOpacity>
                <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
                    {t('consultation.appointmentType.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {TYPE_OPTIONS.map((option) => {
                    const isSelected = selected === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setSelected(option.value)}
                            accessibilityLabel={t(option.titleKey)}
                            accessibilityRole="button"
                            testID={`type-${option.value}`}
                            activeOpacity={0.7}
                        >
                            <Card journey="care" elevation={isSelected ? 'md' : 'sm'}>
                                <View style={[styles.cardInner, isSelected && styles.cardSelected]}>
                                    <Text style={styles.icon}>{option.icon}</Text>
                                    <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                                        {t(option.titleKey)}
                                    </Text>
                                    <Text fontSize="sm" color={colors.neutral.gray600}>
                                        {t(option.descKey)}
                                    </Text>
                                    <View style={styles.detailsRow}>
                                        <View style={styles.detailItem}>
                                            <Text fontSize="sm" color={colors.neutral.gray500}>
                                                {t('consultation.appointmentType.estimatedPrice')}
                                            </Text>
                                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.primary}>
                                                {option.price}
                                            </Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text fontSize="sm" color={colors.neutral.gray500}>
                                                {t('consultation.appointmentType.available')}
                                            </Text>
                                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                                {option.availableSlots}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Continue CTA */}
            <View style={styles.ctaContainer}>
                <Button
                    variant="primary"
                    journey="care"
                    size="lg"
                    onPress={handleContinue}
                    disabled={!selected}
                    accessibilityLabel={t('consultation.appointmentType.continue')}
                    testID="continue-button"
                >
                    {t('consultation.appointmentType.continue')}
                </Button>
            </View>
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
        paddingVertical: spacingValues.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray300,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['6xl'],
        gap: spacingValues.md,
    },
    cardInner: {
        alignItems: 'center',
        paddingVertical: spacingValues.md,
        gap: spacingValues.xs,
        borderRadius: spacingValues.xs,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: colors.journeys.care.primary,
    },
    icon: {
        fontSize: 40,
        marginBottom: spacingValues.xs,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray200,
    },
    detailItem: {
        alignItems: 'center',
        gap: spacingValues['3xs'],
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.journeys.care.background,
        padding: spacingValues.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral.gray300,
    },
});

export default AppointmentType;
