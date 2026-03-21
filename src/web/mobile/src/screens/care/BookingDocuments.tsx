import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ROUTES } from '@constants/routes';

type DocumentStatus = 'pending' | 'uploaded';

interface DocumentItem {
    id: string;
    labelKey: string;
    icon: string;
    required: boolean;
    status: DocumentStatus;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
    {
        id: 'id-document',
        labelKey: 'consultation.documents.idDocument',
        icon: '\u{1F4C4}',
        required: true,
        status: 'pending',
    },
    {
        id: 'insurance-card',
        labelKey: 'consultation.documents.insuranceCard',
        icon: '\u{1F4B3}',
        required: true,
        status: 'pending',
    },
    {
        id: 'medical-referral',
        labelKey: 'consultation.documents.medicalReferral',
        icon: '\u{1F4DD}',
        required: false,
        status: 'pending',
    },
    {
        id: 'exam-results',
        labelKey: 'consultation.documents.examResults',
        icon: '\u{1F9EA}',
        required: false,
        status: 'pending',
    },
];

/**
 * BookingDocuments screen allows the user to upload required documents
 * for their appointment: ID, insurance card, medical referral, and exam results.
 */
export const BookingDocuments: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { doctorId, appointmentType } = route.params || {
        doctorId: 'doc-001',
        appointmentType: 'in-person',
    };

    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

    const handleUpload = useCallback((docId: string) => {
        setDocuments((prev) =>
            prev.map((doc) => (doc.id === docId ? { ...doc, status: 'uploaded' as DocumentStatus } : doc))
        );
    }, []);

    const handleContinue = useCallback(() => {
        navigation.navigate(ROUTES.CARE_BOOKING_INSURANCE, {
            doctorId,
            appointmentType,
        });
    }, [navigation, doctorId, appointmentType]);

    const requiredUploaded = documents.filter((d) => d.required).every((d) => d.status === 'uploaded');

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
                    {t('consultation.documents.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {documents.map((doc) => (
                    <Card key={doc.id} journey="care" elevation="sm">
                        <View style={styles.docRow}>
                            <View style={styles.docInfo}>
                                <Text style={styles.docIcon}>{doc.icon}</Text>
                                <View style={styles.docLabelContainer}>
                                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                        {t(doc.labelKey)}
                                    </Text>
                                    {!doc.required && (
                                        <Text fontSize="sm" color={colors.neutral.gray500}>
                                            ({t('consultation.documents.optional')})
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.docActions}>
                                <Badge
                                    variant="status"
                                    status={doc.status === 'uploaded' ? 'success' : 'warning'}
                                    testID={`status-${doc.id}`}
                                    accessibilityLabel={
                                        doc.status === 'uploaded'
                                            ? t('consultation.documents.uploaded')
                                            : t('consultation.documents.pending')
                                    }
                                >
                                    {doc.status === 'uploaded'
                                        ? t('consultation.documents.uploaded')
                                        : t('consultation.documents.pending')}
                                </Badge>

                                {doc.status === 'pending' && (
                                    <TouchableOpacity
                                        onPress={() => handleUpload(doc.id)}
                                        accessibilityLabel={`${t('consultation.documents.upload')} ${t(doc.labelKey)}`}
                                        accessibilityRole="button"
                                        testID={`upload-${doc.id}`}
                                        style={styles.uploadButton}
                                    >
                                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.primary}>
                                            {t('consultation.documents.upload')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            {/* Continue CTA */}
            <View style={styles.ctaContainer}>
                <Button
                    variant="primary"
                    journey="care"
                    size="lg"
                    onPress={handleContinue}
                    disabled={!requiredUploaded}
                    accessibilityLabel={t('consultation.documents.continue')}
                    testID="continue-button"
                >
                    {t('consultation.documents.continue')}
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
        gap: spacingValues.sm,
    },
    docRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    docInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacingValues.sm,
    },
    docIcon: {
        fontSize: 28,
    },
    docLabelContainer: {
        flex: 1,
    },
    docActions: {
        alignItems: 'flex-end',
        gap: spacingValues.xs,
    },
    uploadButton: {
        paddingHorizontal: spacingValues.sm,
        paddingVertical: spacingValues['3xs'],
        borderRadius: spacingValues.xs,
        borderWidth: 1,
        borderColor: colors.journeys.care.primary,
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

export default BookingDocuments;
