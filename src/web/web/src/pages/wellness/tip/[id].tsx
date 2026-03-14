import { Button } from 'design-system/components/Button/Button';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useWellness } from '@/hooks/useWellness';

const PLACEHOLDER_USER_ID = 'me';

const TipDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const tipId = typeof id === 'string' ? id : '';
    const { tip, loadTip } = useWellness();

    useEffect(() => {
        if (tipId) {
            void loadTip(PLACEHOLDER_USER_ID, tipId);
        }
    }, [tipId, loadTip]);

    const handleShare = (): void => {
        window.alert('Share feature coming soon.');
    };

    if (!tip) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness/insights')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to insights"
            >
                Back
            </button>

            <div style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
                <Text fontSize="xs" color={colors.journeys.health.primary} fontWeight="semiBold">
                    {tip.type}
                </Text>
            </div>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                {tip.title}
            </Text>

            <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[50]}>
                    Wellness Tip
                </Text>
                {tip.metric && (
                    <Text fontSize="sm" color={colors.gray[40]}>
                        {tip.metric}
                    </Text>
                )}
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing['2xl'] }}>
                <Text fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
                    {tip.description}
                </Text>
            </div>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleShare} accessibilityLabel="Share tip">
                    Share Tip
                </Button>
            </Box>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default TipDetailPage;
