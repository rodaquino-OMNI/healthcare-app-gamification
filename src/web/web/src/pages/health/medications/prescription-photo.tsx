import React, { useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

/**
 * Tips for uploading a good prescription photo
 */
const UPLOAD_TIPS = [
    'Ensure good lighting when scanning or photographing your prescription.',
    'Place the prescription on a flat surface before capturing.',
    'Make sure all text on the prescription is clearly visible.',
    'Keep the image focused and avoid blurriness.',
    'Avoid shadows covering any part of the prescription.',
];

/**
 * Prescription photo upload page for web.
 * Uses file input instead of camera, mirrors mobile MedicationPrescriptionPhoto.
 */
const PrescriptionPhotoPage: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            window.alert(`File "${file.name}" selected. OCR processing coming soon.`);
        }
    }, []);

    const handleSkipManual = useCallback(() => {
        router.push(WEB_HEALTH_ROUTES.MEDICATION_ADD);
    }, [router]);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" style={{ alignItems: 'center', marginBottom: spacing.xl }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                    }}
                >
                    Back
                </button>
            </Box>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Upload Prescription
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Upload a photo of your prescription to automatically extract medication details.
            </Text>

            {/* Upload Area */}
            <div
                onClick={handleUploadClick}
                style={{
                    height: '280px',
                    borderRadius: '16px',
                    backgroundColor: colors.gray[10],
                    border: `2px dashed ${colors.gray[20]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    cursor: 'pointer',
                    marginBottom: spacing.xl,
                    transition: 'border-color 0.15s ease',
                }}
                role="button"
                tabIndex={0}
                aria-label="Click to upload prescription photo"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleUploadClick();
                    }
                }}
            >
                <Text fontSize="2xl" color={colors.gray[40]}>
                    Upload Icon
                </Text>
                <Text fontSize="lg" color={colors.gray[50]}>
                    Click to upload or drag and drop
                </Text>
                <Text fontSize="sm" color={colors.gray[40]}>
                    Supported formats: JPG, PNG, PDF (max 10MB)
                </Text>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                aria-hidden="true"
            />

            {/* Action Buttons */}
            <Box style={{ marginBottom: spacing.xl }}>
                <Button journey="health" onPress={handleUploadClick} accessibilityLabel="Upload prescription photo">
                    Upload Photo
                </Button>
            </Box>

            {/* Tips */}
            <Card journey="health" elevation="sm" padding="md">
                <Text fontWeight="semiBold" fontSize="lg" color={colors.journeys.health.text}>
                    Tips for a Good Photo
                </Text>
                <ul
                    style={{
                        margin: `${spacing.sm} 0 0 0`,
                        paddingLeft: spacing.xl,
                        listStyleType: 'disc',
                    }}
                >
                    {UPLOAD_TIPS.map((tip, index) => (
                        <li
                            key={`tip-${index}`}
                            style={{
                                marginBottom: spacing.xs,
                                color: colors.gray[60],
                                fontSize: '14px',
                                lineHeight: '1.5',
                            }}
                        >
                            {tip}
                        </li>
                    ))}
                </ul>
            </Card>

            {/* Skip to Manual Entry */}
            <Box
                style={{
                    textAlign: 'center',
                    marginTop: spacing['2xl'],
                    paddingBottom: spacing.xl,
                }}
            >
                <button
                    onClick={handleSkipManual}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.journeys.health.primary,
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 500,
                        padding: spacing.sm,
                    }}
                >
                    Skip - Enter Manually
                </button>
            </Box>
        </div>
    );
};

export default PrescriptionPhotoPage;
