import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Data categories that can be shared with a partner.
 */
type ShareableData = 'period_dates' | 'fertile_window' | 'mood' | 'symptoms';

/**
 * Partner connection state.
 */
interface PartnerInfo {
    name: string;
    connectedSince: string;
    isConnected: boolean;
}

/**
 * Sharing checkbox configuration.
 */
interface SharingOption {
    type: ShareableData;
    enabled: boolean;
}

const INITIAL_SHARING: SharingOption[] = [
    { type: 'period_dates', enabled: true },
    { type: 'fertile_window', enabled: true },
    { type: 'mood', enabled: false },
    { type: 'symptoms', enabled: false },
];

const MOCK_PARTNER: PartnerInfo = {
    name: 'Carlos Silva',
    connectedSince: '2025-11-15',
    isConnected: true,
};

const MOCK_INVITE_CODE = 'AUSTA-CYC-7X3K';

/**
 * PartnerSharing allows users to share cycle information with a partner.
 * Supports enabling/disabling sharing, managing what data is shared,
 * inviting via code, and revoking access.
 */
export const PartnerSharing: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [sharingEnabled, setSharingEnabled] = useState(MOCK_PARTNER.isConnected);
    const [sharingOptions, setSharingOptions] = useState<SharingOption[]>(INITIAL_SHARING);
    const [partner] = useState<PartnerInfo>(MOCK_PARTNER);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSharingToggle = useCallback(() => {
        setSharingEnabled((prev) => !prev);
    }, []);

    const handleOptionToggle = useCallback((type: ShareableData) => {
        setSharingOptions((prev) => prev.map((opt) => (opt.type === type ? { ...opt, enabled: !opt.enabled } : opt)));
    }, []);

    const handleInvitePartner = useCallback(() => {
        Alert.alert(
            t('journeys.health.cycle.partnerSharing.inviteTitle'),
            t('journeys.health.cycle.partnerSharing.inviteMessage', { code: MOCK_INVITE_CODE })
        );
    }, [t]);

    const handleCopyCode = useCallback(() => {
        Alert.alert(t('journeys.health.cycle.partnerSharing.codeCopied'), MOCK_INVITE_CODE);
    }, [t]);

    const handleRevokeAccess = useCallback(() => {
        Alert.alert(
            t('journeys.health.cycle.partnerSharing.revokeTitle'),
            t('journeys.health.cycle.partnerSharing.revokeConfirm'),
            [
                {
                    text: t('common.buttons.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('journeys.health.cycle.partnerSharing.revoke'),
                    style: 'destructive',
                    onPress: () => setSharingEnabled(false),
                },
            ]
        );
    }, [t]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.partnerSharing.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="partner-sharing-scroll"
            >
                {/* Enable Sharing */}
                <View style={styles.sectionContainer}>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabel}>
                                <Text fontSize="md" fontWeight="semiBold">
                                    {t('journeys.health.cycle.partnerSharing.enableSharing')}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {t('journeys.health.cycle.partnerSharing.enableDescription')}
                                </Text>
                            </View>
                            <Switch
                                value={sharingEnabled}
                                onValueChange={handleSharingToggle}
                                trackColor={{
                                    false: colors.gray[20],
                                    true: colors.journeys.health.primary,
                                }}
                                thumbColor={colors.gray[0]}
                                accessibilityLabel={t('journeys.health.cycle.partnerSharing.enableSharing')}
                                testID="sharing-toggle"
                            />
                        </View>
                    </Card>
                </View>

                {sharingEnabled && (
                    <>
                        {/* Connected Partner */}
                        {partner.isConnected && (
                            <View style={styles.sectionContainer}>
                                <Text fontSize="lg" fontWeight="semiBold" journey="health">
                                    {t('journeys.health.cycle.partnerSharing.connectedPartner')}
                                </Text>
                                <Card journey="health" elevation="sm" padding="md">
                                    <View style={styles.partnerRow}>
                                        <View style={styles.partnerAvatar}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="bold"
                                                color={colors.journeys.health.primary}
                                            >
                                                {partner.name.charAt(0)}
                                            </Text>
                                        </View>
                                        <View style={styles.partnerInfo}>
                                            <Text fontSize="md" fontWeight="semiBold">
                                                {partner.name}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {t('journeys.health.cycle.partnerSharing.connectedSince', {
                                                    date: partner.connectedSince,
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        )}

                        {/* Invite Partner */}
                        {!partner.isConnected && (
                            <View style={styles.sectionContainer}>
                                <Text fontSize="lg" fontWeight="semiBold" journey="health">
                                    {t('journeys.health.cycle.partnerSharing.invitePartner')}
                                </Text>
                                <Card journey="health" elevation="sm" padding="md">
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.partnerSharing.inviteDescription')}
                                    </Text>
                                    <View style={styles.codeContainer}>
                                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                                            {MOCK_INVITE_CODE}
                                        </Text>
                                        <Touchable
                                            onPress={handleCopyCode}
                                            accessibilityLabel={t('journeys.health.cycle.partnerSharing.copyCode')}
                                            accessibilityRole="button"
                                            testID="copy-code-button"
                                        >
                                            <Text fontSize="sm" color={colors.journeys.health.secondary}>
                                                {t('journeys.health.cycle.partnerSharing.copy')}
                                            </Text>
                                        </Touchable>
                                    </View>
                                    <Button
                                        journey="health"
                                        onPress={handleInvitePartner}
                                        accessibilityLabel={t('journeys.health.cycle.partnerSharing.sendInvite')}
                                        testID="send-invite-button"
                                    >
                                        {t('journeys.health.cycle.partnerSharing.sendInvite')}
                                    </Button>
                                </Card>
                            </View>
                        )}

                        {/* What to Share */}
                        <View style={styles.sectionContainer}>
                            <Text fontSize="lg" fontWeight="semiBold" journey="health">
                                {t('journeys.health.cycle.partnerSharing.whatToShare')}
                            </Text>
                            {sharingOptions.map((option) => (
                                <Card key={option.type} journey="health" elevation="sm" padding="md">
                                    <View style={styles.toggleRow}>
                                        <Text fontSize="md" fontWeight="medium" style={styles.optionLabel}>
                                            {t(`journeys.health.cycle.partnerSharing.data.${option.type}`)}
                                        </Text>
                                        <Switch
                                            value={option.enabled}
                                            onValueChange={() => handleOptionToggle(option.type)}
                                            trackColor={{
                                                false: colors.gray[20],
                                                true: colors.journeys.health.primary,
                                            }}
                                            thumbColor={colors.gray[0]}
                                            accessibilityLabel={t(
                                                `journeys.health.cycle.partnerSharing.data.${option.type}`
                                            )}
                                            testID={`share-toggle-${option.type}`}
                                        />
                                    </View>
                                </Card>
                            ))}
                        </View>

                        {/* Revoke Access */}
                        {partner.isConnected && (
                            <View style={styles.actionsContainer}>
                                <Button
                                    variant="secondary"
                                    journey="health"
                                    onPress={handleRevokeAccess}
                                    accessibilityLabel={t('journeys.health.cycle.partnerSharing.revokeAccess')}
                                    testID="revoke-access-button"
                                >
                                    {t('journeys.health.cycle.partnerSharing.revokeAccess')}
                                </Button>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleLabel: {
        flex: 1,
        marginRight: spacingValues.sm,
        gap: spacingValues['4xs'],
    },
    optionLabel: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    partnerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.md,
    },
    partnerInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.md,
        paddingHorizontal: spacingValues.sm,
        backgroundColor: colors.gray[5],
        borderRadius: 8,
        marginVertical: spacingValues.sm,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
});

export default PartnerSharing;
