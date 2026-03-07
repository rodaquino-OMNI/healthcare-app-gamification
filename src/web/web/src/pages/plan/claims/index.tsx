import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { ClaimCard } from 'src/web/design-system/src/plan/ClaimCard';
import { useClaims } from 'src/web/web/src/hooks/useClaims';
import { useJourney } from 'src/web/web/src/hooks/useJourney';
import { ClaimStatus } from 'src/web/shared/types/plan.types';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

const { plan } = colors.journeys;

type FilterTab = 'all' | ClaimStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'approved', label: 'Aprovados' },
    { key: 'denied', label: 'Negados' },
];

/**
 * Claims component: Displays a filtered list of claims for the user.
 */
const Claims: NextPage = () => {
    const { claims, loading, error } = useClaims();
    const { journey, t } = useJourney();
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    const filteredClaims = useMemo(() => {
        if (!claims) return [];
        if (activeFilter === 'all') return claims;
        return claims.filter((c) => c.status === activeFilter);
    }, [claims, activeFilter]);

    const handleViewClaimDetails = (claimId: string) => {
        router.push(`/plan/claims/${claimId}`);
    };

    const handleAddClaim = () => {
        router.push('/plan/claims/submit');
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: spacing['3xl'],
                    color: colors.gray[50],
                    fontFamily: typography.fontFamily.body,
                }}
            >
                {t('loading')}...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: spacing['3xl'],
                    color: colors.semantic.error,
                    fontFamily: typography.fontFamily.body,
                }}
            >
                {t('error.claims')}
            </div>
        );
    }

    return (
        <div style={{ padding: spacing.xl }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.xl,
                }}
            >
                <h1
                    style={{
                        fontSize: typography.fontSize['heading-xl'],
                        fontWeight: typography.fontWeight.semiBold,
                        color: plan.text,
                        margin: 0,
                        fontFamily: typography.fontFamily.heading,
                    }}
                >
                    {t('plan.claims.title')}
                </h1>
                <button
                    onClick={handleAddClaim}
                    style={{
                        padding: `${spacing.xs} ${spacing.lg}`,
                        backgroundColor: plan.primary,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: borderRadius.md,
                        cursor: 'pointer',
                        fontSize: typography.fontSize['text-sm'],
                        fontWeight: typography.fontWeight.semiBold,
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    {t('plan.claims.addClaim')}
                </button>
            </div>

            {/* Filter Tabs */}
            <div
                style={{
                    display: 'flex',
                    gap: spacing.xs,
                    marginBottom: spacing.xl,
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

            {/* Claims List */}
            {filteredClaims.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {filteredClaims.map((claim) => (
                        <ClaimCard
                            key={claim.id}
                            claim={claim}
                            onViewDetails={() => handleViewClaimDetails(claim.id)}
                        />
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
                    <p
                        style={{
                            fontSize: typography.fontSize['text-lg'],
                            marginBottom: spacing.md,
                        }}
                    >
                        {t('plan.claims.noClaims')}
                    </p>
                    <button
                        onClick={handleAddClaim}
                        style={{
                            padding: `${spacing.xs} ${spacing.lg}`,
                            backgroundColor: plan.primary,
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: borderRadius.md,
                            cursor: 'pointer',
                            fontSize: typography.fontSize['text-sm'],
                            fontWeight: typography.fontWeight.semiBold,
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        Enviar Primeira Solicitacao
                    </button>
                </div>
            )}
        </div>
    );
};

export default Claims;
