import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import PlanLayout from '../../layouts/PlanLayout';
import BenefitCard from 'design-system/plan/BenefitCard';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorState from '../../components/shared/ErrorState';
import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import { Benefit } from 'shared/types/plan.types';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';

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
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    const { session } = useAuth();
    const { journey } = useJourney();

    useEffect(() => {
        const loadBenefits = async () => {
            setLoading(true);
            setError(null);

            try {
                if (session?.accessToken) {
                    const fetchedBenefits = await fetchBenefits(session.accessToken);
                    setBenefits(fetchedBenefits);
                } else {
                    setError('User not authenticated');
                }
            } catch (err: unknown) {
                setError((err instanceof Error ? err.message : null) || 'Failed to load benefits');
            } finally {
                setLoading(false);
            }
        };

        loadBenefits();
    }, [session]);

    const filteredBenefits = activeFilter === 'all' ? benefits : benefits.filter((b) => b.type === activeFilter);

    let content;
    if (loading) {
        content = <LoadingIndicator text="Carregando seus beneficios..." />;
    } else if (error) {
        content = (
            <ErrorState
                message={`Erro ao carregar seus beneficios: ${error}`}
                onRetry={() => {
                    setLoading(true);
                    setError(null);
                    fetchBenefits(session?.accessToken || '');
                }}
            />
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
                                    backgroundColor: isActive ? plan.primary : '#ffffff',
                                    color: isActive ? '#ffffff' : colors.gray[50],
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

/**
 * Fetches the benefits associated with the user's active insurance plan.
 */
async function fetchBenefits(userId: string): Promise<Benefit[]> {
    const apiUrl = `/api/plan/benefits?userId=${userId}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch benefits: ${response.status}`);
        }

        const data = await response.json();
        return data as Benefit[];
    } catch (error: unknown) {
        console.error('There was an error fetching the benefits:', error);
        throw new Error(`Failed to fetch benefits: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export default BenefitsPage;
