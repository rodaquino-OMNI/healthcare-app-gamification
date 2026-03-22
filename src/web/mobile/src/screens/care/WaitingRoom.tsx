/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Badge } from '@design-system/components/Badge/Badge';
import { Button } from '@design-system/components/Button/Button';
import { Card } from '@design-system/components/Card/Card';
import { ProgressBar } from '@design-system/components/ProgressBar/ProgressBar';
import { Text } from '@design-system/primitives/Text/Text';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';

import { JourneyHeader } from '@components/shared/JourneyHeader';
import { ROUTES } from '@constants/routes';

import type { CareStackParamList } from '../../navigation/types';

/**
 * Represents the status of a single equipment check.
 */
interface EquipmentCheck {
    label: string;
    icon: string;
    passed: boolean;
}

/**
 * Formats remaining seconds into MM:SS display.
 */
const formatCountdown = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/** Initial countdown in seconds (15 minutes). */
const INITIAL_COUNTDOWN = 15 * 60;

/** Mock connection quality percentage. */
const CONNECTION_QUALITY = 85;

/**
 * WaitingRoom screen provides a pre-consultation holding area
 * with equipment checks (camera, microphone, internet),
 * a countdown timer, and tips before joining the teleconsultation.
 */
const WaitingRoom: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<CareStackParamList>>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareWaitingRoom'>>();
    const { appointmentId } = route.params;
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);

    const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
    const [equipmentChecks, setEquipmentChecks] = useState<EquipmentCheck[]>([
        { label: 'Camera', icon: '📷', passed: true },
        { label: 'Microfone', icon: '🎙', passed: true },
        { label: 'Conexao', icon: '📶', passed: true },
    ]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const allChecksPassed = equipmentChecks.every((check) => check.passed);

    const toggleCheck = useCallback((index: number) => {
        setEquipmentChecks((prev) =>
            prev.map((check, i) => (i === index ? { ...check, passed: !check.passed } : check))
        );
    }, []);

    const handleJoinConsultation = useCallback(() => {
        navigation.navigate(ROUTES.CARE_TELEMEDICINE, { appointmentId });
    }, [navigation, appointmentId]);

    return (
        <View style={styles.container}>
            <JourneyHeader title={t('journeys.care.telemedicine.waiting')} showBackButton />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Appointment info */}
                <Card journey="care" elevation="sm">
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.telemedicine.teleconsultation')}
                    </Text>
                    <View style={styles.infoRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.telemedicine.consultation')}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={colors.gray[70]}>
                            #{appointmentId}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Status:
                        </Text>
                        <Badge journey="care" size="sm" status="info">
                            {t('journeys.care.telemedicine.waitingStatus')}
                        </Badge>
                    </View>
                </Card>

                {/* Countdown timer */}
                <View style={styles.countdownSection}>
                    <Text fontSize="sm" color={colors.gray[50]} textAlign="center">
                        {t('journeys.care.telemedicine.startsIn')}
                    </Text>
                    <View style={styles.countdownDisplay}>
                        <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.primary} textAlign="center">
                            {formatCountdown(countdown)}
                        </Text>
                    </View>
                </View>

                {/* Equipment checks */}
                <View style={styles.checksSection}>
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.telemedicine.equipmentCheck')}
                    </Text>

                    {equipmentChecks.map((check, index) => (
                        <Card
                            key={check.label}
                            journey="care"
                            elevation="sm"
                            onPress={() => toggleCheck(index)}
                            interactive
                            accessibilityLabel={`${check.label}: ${check.passed ? 'verificado' : 'nao verificado'}`}
                        >
                            <View style={styles.checkRow}>
                                <Text fontSize="lg">{check.icon}</Text>
                                <Text fontSize="sm" fontWeight="medium" color={colors.gray[70]}>
                                    {check.label}
                                </Text>
                                <Badge journey="care" size="sm" status={check.passed ? 'success' : 'error'}>
                                    {check.passed ? 'OK' : t('journeys.care.telemedicine.failed')}
                                </Badge>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Connection quality */}
                <View style={styles.connectionSection}>
                    <Text fontSize="sm" fontWeight="medium" color={colors.gray[70]}>
                        {t('journeys.care.telemedicine.connectionQuality')}
                    </Text>
                    <View style={styles.progressBarWrapper}>
                        <ProgressBar
                            current={CONNECTION_QUALITY}
                            total={100}
                            journey="care"
                            size="md"
                            ariaLabel="Qualidade da conexao com a internet"
                        />
                    </View>
                    <Text fontSize="xs" color={colors.gray[50]} textAlign="center">
                        {CONNECTION_QUALITY}% - {t('journeys.care.telemedicine.stableConnection')}
                    </Text>
                </View>

                {/* Tips */}
                <Card journey="care" elevation="sm">
                    <Text variant="heading" journey="care" fontSize="md">
                        {t('journeys.care.telemedicine.tips.title')}
                    </Text>
                    <View style={styles.tipItem}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.telemedicine.tips.quietPlace')}
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.telemedicine.tips.checkLighting')}
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.telemedicine.tips.haveDocuments')}
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {t('journeys.care.telemedicine.tips.useHeadphones')}
                        </Text>
                    </View>
                </Card>

                {/* Join button */}
                <View style={styles.bottomAction}>
                    <Button
                        journey="care"
                        variant="primary"
                        onPress={handleJoinConsultation}
                        disabled={!allChecksPassed}
                        accessibilityLabel="Entrar na consulta por teleconsulta"
                    >
                        {t('journeys.care.telemedicine.joinConsultation')}
                    </Button>
                    {!allChecksPassed && (
                        <Text fontSize="xs" color={colors.semantic.error} textAlign="center">
                            {t('journeys.care.telemedicine.resolveEquipmentIssues')}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.journeys.care.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 40,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
        },
        countdownSection: {
            marginTop: 24,
            alignItems: 'center',
        },
        countdownDisplay: {
            marginTop: 8,
            paddingVertical: 16,
            paddingHorizontal: 32,
            backgroundColor: theme.colors.background.default,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.journeys.care.primary,
        },
        checksSection: {
            marginTop: 24,
            gap: 8,
        },
        checkRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        connectionSection: {
            marginTop: 24,
            marginBottom: 16,
        },
        progressBarWrapper: {
            marginTop: 8,
            marginBottom: 4,
        },
        tipItem: {
            marginTop: 8,
            paddingLeft: 8,
        },
        bottomAction: {
            marginTop: 32,
            paddingHorizontal: 8,
            gap: 8,
        },
    });

export default WaitingRoom;
