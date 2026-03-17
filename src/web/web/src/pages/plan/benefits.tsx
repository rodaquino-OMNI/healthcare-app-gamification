import { BenefitCard } from 'design-system/plan/BenefitCard';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';

import { usePlan } from '@/hooks';

import { ErrorState } from '../../components/shared/ErrorState';
import { LoadingIndicator } from '../../components/shared/LoadingIndicator';
import { useJourney } from '../../hooks/useJourney';
import PlanLayout from '../../layouts/PlanLayout';

const { plan } = colors.journeys;

type FilterTab = 'all' | 'medical' | 'dental' | 'vision' | 'other';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'medical', label: 'Medico' },
    { key: 'dental', label: 'Odontologico' },
    { key: 'vision', label: 'Oftalmologico' },
    { key: 'other', label: 'Outros' },
];

/**
 * The main component that renders the Benefits page within the Plan journey.
 */
const BenefitsPage: NextPage = () => {
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    useJourney();
    const { benefits, isLoading: loading, error, refreshBenefits } = usePlan();

    const filteredBenefits = activeFilter === 'all' ? benefits : benefits.filter((b) => b.type === activeFilter);

    let content;
    if (loading) {
        content = <LoadingIndicator text="Carregando seus beneficios..." />;
    } else if (error) {
        content = (
            <ErrorState message={`Erro ao carregar seus beneficios: ${error}`} onRetry={() => void refreshBenefits()} />
        );
    } else {
        content = (
            <>
                {/* Filter Tabs */}
                <div
                    style={{
                        display: 'flex',
                        gap: spacing.xs,
                        marginBottom: spacing.xl,
                        flexWrap: 'wrap',
                    }}
                >
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                style={{
                                    padding: `${spacing.xs} ${spacing.md}`,
                                    borderRadius: borderRadius.full,
                                    border: `1px solid ${isActive ? plan.primary : colors.gray[20]}`,
                                    backgroundColor: isActive ? plan.primary : colors.gray[0],
                                    color: isActive ? colors.gray[0] : colors.gray[50],
                                    cursor: 'pointer',
                                    fontSize: typography.fontSize['text-sm'],
                                    fontWeight: typography.fontWeight.medium,
                                    fontFamily: typography.fontFamily.body,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Benefits List */}
                {filteredBenefits.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        {filteredBenefits.map((benefit) => (
                            <BenefitCard key={benefit.id} benefit={benefit} />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: spacing['3xl'],
                            color: colors.gray[50],
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        <p style={{ fontSize: typography.fontSize['text-lg'] }}>
                            Nenhum beneficio encontrado para esta categoria.
                        </p>
                    </div>
                )}
            </>
        );
    }

    return (
        <PlanLayout>
            <div style={{ padding: spacing.xl }}>
                <h1
                    style={{
                        fontSize: typography.fontSize['heading-xl'],
                        fontWeight: typography.fontWeight.semiBold,
                        color: plan.text,
                        marginBottom: spacing.xs,
                        fontFamily: typography.fontFamily.heading,
                    }}
                >
                    Meus Beneficios
                </h1>
                <p
                    style={{
                        fontSize: typography.fontSize['text-md'],
                        color: colors.gray[50],
                        marginBottom: spacing.xl,
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    Consulte os beneficios disponiveis do seu plano
                </p>
                {content}
            </div>
        </PlanLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default BenefitsPage;
