import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useRef, useEffect } from 'react';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/** Photo upload page for adding visual evidence to the symptom check. */
const PhotoUploadPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, isLoading, error } = useSymptomChecker();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    // Revoke all blob URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Effect intentionally runs only on mount; previews are captured via closure in the cleanup function to revoke blob URLs on unmount

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (!files) {
            return;
        }
        const newPreviews: string[] = [];
        Array.from(files).forEach((file) => {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            // Validate blob: protocol (defense-in-depth for CWE-79)
            if (!objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
                return;
            }
            newPreviews.push(objectUrl);
        });
        setPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    };

    const removePhoto = (index: number): void => {
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleContinue = (): void => {
        void router.push({
            pathname: '/care/symptom-checker/medical-history',
            query: router.query,
        });
    };

    const handleSkip = (): void => {
        void router.push({
            pathname: '/care/symptom-checker/medical-history',
            query: router.query,
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Photo Upload
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Optionally upload up to 4 photos of the affected area to help with the assessment.
            </Text>

            <Card journey="care" elevation="sm" padding="lg">
                <div
                    data-testid="photo-upload-dropzone"
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            fileInputRef.current?.click();
                        }
                    }}
                    style={{
                        border: `2px dashed ${colors.journeys.care.primary}`,
                        borderRadius: '8px',
                        padding: spacing['3xl'],
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: colors.journeys.care.background,
                    }}
                >
                    <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.primary}>
                        Click to upload photos
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        JPG, PNG up to 10MB each (max 4 photos)
                    </Text>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    data-testid="photo-upload-input"
                />
            </Card>

            {previews.length > 0 && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: spacing.md,
                        marginTop: spacing.lg,
                    }}
                >
                    {previews.map((src, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={src}
                                alt={`Upload preview ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.neutral.gray300}`,
                                }}
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                data-testid={`photo-remove-${index}`}
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: colors.semantic.error,
                                    color: colors.neutral.white,
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    lineHeight: '1',
                                }}
                                aria-label={`Remove photo ${index + 1}`}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="tertiary"
                    journey="care"
                    onPress={handleSkip}
                    accessibilityLabel="Skip photo upload"
                    data-testid="photo-upload-skip-btn"
                >
                    Skip
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    disabled={previews.length === 0}
                    accessibilityLabel="Continue with photos"
                    data-testid="photo-upload-continue-btn"
                >
                    Continue ({previews.length}/4)
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default PhotoUploadPage;
