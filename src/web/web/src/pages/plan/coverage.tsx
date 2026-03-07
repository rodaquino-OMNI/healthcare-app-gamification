import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import PlanLayout from '../../layouts/PlanLayout';
import CoverageInfoCard from 'design-system/plan/CoverageInfoCard';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorState from '../../components/shared/ErrorState';
import { useCoverage } from '../../hooks/useCoverage';
import { useAuth } from '../../hooks/useAuth';
import { Box, Text } from 'design-system/primitives';
import { Coverage } from 'shared/types/plan.types';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';

const { plan } = colors.journeys;

/**
 * The main component for the coverage page that displays insurance coverage information.
 */
const CoveragePage: React.FC = () => {
    const { session } = useAuth();
    const planId = session?.accessToken;
    const { data: coverageData, isLoading, isError, refetch } = useCoverage(planId);

    // Track expanded sections
    const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

    const toggleType = (type: string) => {
        setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    if (isLoading) {
        return (
            <PlanLayout>
                <LoadingIndicator text="Carregando informacoes de cobertura..." />
            </PlanLayout>
        );
    }

    if (isError) {
        return (
            <PlanLayout>
                <ErrorState
                    message="Erro ao carregar informacoes de cobertura. Tente novamente."
                    onRetry={() => refetch()}
                />
            </PlanLayout>
        );
    }

    const grouped = coverageData ? groupCoverageByType(coverageData) : {};

    return (
        <PlanLayout>
            <NextSeo
                title="Cobertura do Plano - AUSTA"
                description="Visualize os detalhes da sua cobertura do plano de saude."
            />
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
                                backgroundColor: '#ffffff',
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

/**
 * Next.js server-side function to handle authentication and redirect if needed.
 */
export async function getServerSideProps(context: { req: { cookies: Record<string, string> } }): Promise<object> {
    const { req } = context;
    const session = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

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
