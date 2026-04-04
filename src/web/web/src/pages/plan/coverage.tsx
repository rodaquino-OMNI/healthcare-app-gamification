import { CoverageInfoCard } from 'design-system/plan/CoverageInfoCard';
import { Box, Text } from 'design-system/primitives';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import Head from 'next/head';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coverage } from 'shared/types/plan.types';

import { useAuth, useCoverage } from '@/hooks';

import { ErrorState } from '../../components/shared/ErrorState';
import { LoadingIndicator } from '../../components/shared/LoadingIndicator';
import PlanLayout from '../../layouts/PlanLayout';

const { plan } = colors.journeys;

/**
 * The main component for the coverage page that displays insurance coverage information.
 */
const CoveragePage: React.FC = () => {
    const { t } = useTranslation();
    const { session } = useAuth();
    const planId = session?.accessToken ?? '';
    const { data: coverageData, isLoading, isError, refetch } = useCoverage(planId);

    // Track expanded sections
    const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

    const toggleType = (type: string): void => {
        setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    if (isLoading) {
        return (
            <PlanLayout>
                <LoadingIndicator text={t('common.loading')} />
            </PlanLayout>
        );
    }

    if (isError) {
        return (
            <PlanLayout>
                <ErrorState
                    message="Erro ao carregar informacoes de cobertura. Tente novamente."
                    onRetry={() => void refetch()}
                />
            </PlanLayout>
        );
    }

    const grouped = coverageData ? groupCoverageByType(coverageData) : {};

    return (
        <PlanLayout>
            <Head>
                <title>Cobertura do Plano - AUSTA</title>
                <meta name="description" content="Visualize os detalhes da sua cobertura do plano de saude." />
            </Head>
            <Box padding="md">
                <Text as="h1" fontSize="2xl" fontWeight="medium" marginBottom="md">
                    Informacoes de Cobertura
                </Text>
                <Text>Visualize os detalhes da sua cobertura do plano de saude.</Text>

                {Object.entries(grouped).map(([type, coverages]) => {
                    const isExpanded = expandedTypes[type] !== false; // default expanded
                    return (
                        <div
                            key={type}
                            style={{
                                marginTop: spacing.lg,
                                backgroundColor: colors.gray[0],
                                borderRadius: borderRadius.md,
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <button
                                onClick={() => toggleType(type)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: `${spacing.md} ${spacing.lg}`,
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <div
                                    style={{
                                        width: '4px',
                                        height: '24px',
                                        backgroundColor: plan.primary,
                                        borderRadius: '2px',
                                        marginRight: spacing.sm,
                                    }}
                                />
                                <span
                                    style={{
                                        flex: 1,
                                        fontSize: typography.fontSize['heading-md'],
                                        fontWeight: typography.fontWeight.semiBold,
                                        color: plan.text,
                                        fontFamily: typography.fontFamily.heading,
                                    }}
                                >
                                    {type}
                                </span>
                                <span
                                    style={{
                                        fontSize: typography.fontSize['text-xs'],
                                        color: colors.gray[50],
                                    }}
                                >
                                    {isExpanded ? '\u25B2' : '\u25BC'}
                                </span>
                            </button>

                            {isExpanded && (
                                <div style={{ padding: `0 ${spacing.lg} ${spacing.md}` }}>
                                    {coverages.map((coverage) => (
                                        <CoverageInfoCard key={coverage.id} coverage={coverage} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </Box>
        </PlanLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

/**
 * Helper function to group coverage items by their type for better organization.
 */
function groupCoverageByType(coverages: Coverage[]): Record<string, Coverage[]> {
    const groupedCoverages: Record<string, Coverage[]> = {};

    coverages.forEach((coverage) => {
        if (!groupedCoverages[coverage.type]) {
            groupedCoverages[coverage.type] = [];
        }
        groupedCoverages[coverage.type].push(coverage);
    });

    return groupedCoverages;
}

export default CoveragePage;
