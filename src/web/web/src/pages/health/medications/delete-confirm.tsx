import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes';

/**
 * Delete confirmation page for a medication.
 * Shows a warning and provides cancel/delete actions.
 */
const MedicationDeleteConfirmPage: React.FC = () => {
    const router = useRouter();
    const { name, id } = router.query;

    const medicationName = (name as string) || 'this medication';

    const handleCancel = () => {
        router.back();
    };

    const handleDelete = () => {
        // In a real app, call API to delete the medication by id
        router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                }}
            >
                {/* Warning Icon */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        border: `3px solid ${colors.semantic.error}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.xl,
                        backgroundColor: colors.neutral.white,
                    }}
                >
                    <span style={{ fontSize: 36, color: colors.semantic.error }}>{'\u26A0'}</span>
                </div>

                <Text fontSize="2xl" fontWeight="bold" color={colors.neutral.gray900}>
                    Delete {medicationName}?
                </Text>

                <Card
                    journey="health"
                    elevation="sm"
                    padding="lg"
                    style={{ marginTop: spacing.lg, width: '100%', maxWidth: 400 }}
                >
                    <Text fontSize="md" color={colors.neutral.gray700} style={{ textAlign: 'center' }}>
                        This will permanently remove all dose history and reminders associated with this medication.
                        This action cannot be undone.
                    </Text>
                </Card>

                {/* Action Buttons */}
                <Box
                    display="flex"
                    justifyContent="center"
                    style={{ marginTop: spacing['2xl'], gap: spacing.md, width: '100%', maxWidth: 400 }}
                >
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleCancel}
                        accessibilityLabel="Cancel deletion"
                    >
                        Cancel
                    </Button>
                    <button
                        onClick={handleDelete}
                        style={{
                            padding: `${spacing.sm} ${spacing.xl}`,
                            borderRadius: 8,
                            backgroundColor: colors.semantic.error,
                            color: colors.neutral.white,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 14,
                        }}
                        aria-label="Confirm delete medication"
                    >
                        Delete
                    </button>
                </Box>
            </div>
        </div>
    );
};

export default MedicationDeleteConfirmPage;
