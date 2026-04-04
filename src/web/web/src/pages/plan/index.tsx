import { ClaimCard } from 'design-system/plan/ClaimCard/ClaimCard';
import { InsuranceCard } from 'design-system/plan/InsuranceCard/InsuranceCard';
import { Text } from 'design-system/primitives';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_PLAN_ROUTES } from 'shared/constants/routes';

import { useAuth, useClaims, usePlan } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import PlanLayout from '@/layouts/PlanLayout';

const { plan } = colors.journeys;

/**
 * The main dashboard component for the 'My Plan & Benefits' journey.
 */
const PlanDashboard: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { session } = useAuth();
    const { claims } = useClaims();
    const { plan: planData, digitalCard } = usePlan();

    const recentClaims = claims.slice(0, 3);

    const stats = [
        { label: t('journeys.plan.stats.totalClaims'), value: String(claims.length), color: plan.primary },
        { label: t('journeys.plan.stats.activeBenefits'), value: '8', color: colors.semantic.success },
        { label: t('journeys.plan.stats.coverage'), value: '85%', color: plan.accent },
    ];

    return (
        <PlanLayout>
            <div style={{ padding: spacing.xl }}>
                {/* Page Title */}
                <Text fontSize="2xl" fontWeight="medium">
                    {t('journeys.plan.title')}
                </Text>
                <p
                    style={{
                        fontSize: typography.fontSize['text-md'],
                        color: colors.gray[50],
                        marginTop: spacing['2xs'],
                        marginBottom: spacing.xl,
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    {t('journeys.plan.subtitle')}
                </p>

                {/* Stats Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: spacing.md,
                        marginBottom: spacing.xl,
                    }}
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                backgroundColor: colors.gray[0],
                                borderRadius: borderRadius.md,
                                padding: spacing.lg,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                borderLeft: `4px solid ${stat.color}`,
                            }}
                        >
                            <p
                                style={{
                                    fontSize: typography.fontSize['text-sm'],
                                    color: colors.gray[50],
                                    margin: 0,
                                    fontFamily: typography.fontFamily.body,
                                }}
                            >
                                {stat.label}
                            </p>
                            <p
                                style={{
                                    fontSize: typography.fontSize['heading-2xl'],
                                    fontWeight: typography.fontWeight.bold,
                                    color: plan.text,
                                    margin: `${spacing.xs} 0 0 0`,
                                    fontFamily: typography.fontFamily.heading,
                                }}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Insurance Card Section */}
                <div style={{ marginBottom: spacing.xl }}>
                    <h2
                        style={{
                            fontSize: typography.fontSize['heading-lg'],
                            fontWeight: typography.fontWeight.semiBold,
                            color: plan.text,
                            marginBottom: spacing.md,
                            fontFamily: typography.fontFamily.heading,
                        }}
                    >
                        {t('journeys.plan.digitalCard.title')}
                    </h2>
                    <InsuranceCard
                        plan={{
                            id: digitalCard?.plan.id ?? planData?.id ?? 'plan-001',
                            name: digitalCard?.plan.planNumber ?? planData?.planNumber ?? 'AUSTA Health PPO',
                            planNumber: digitalCard?.plan.planNumber ?? planData?.planNumber ?? 'AUSTA-2026-001',
                            type: digitalCard?.plan.type ?? planData?.type ?? 'PPO',
                            validityStart: digitalCard?.plan.validityStart ?? planData?.validityStart ?? '2026-01-01',
                            validityEnd: digitalCard?.plan.validityEnd ?? planData?.validityEnd ?? '2026-12-31',
                        }}
                        user={{
                            id: session?.accessToken || '',
                            name: 'Usuario AUSTA',
                            cpf: '***.***.***-**',
                        }}
                        onShare={() => {
                            if (navigator.share) {
                                void navigator.share({ title: 'Cartao Digital AUSTA', url: window.location.href });
                            }
                        }}
                    />
                </div>

                {/* Recent Claims */}
                <div style={{ marginBottom: spacing.xl }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: typography.fontSize['heading-lg'],
                                fontWeight: typography.fontWeight.semiBold,
                                color: plan.text,
                                margin: 0,
                                fontFamily: typography.fontFamily.heading,
                            }}
                        >
                            {t('journeys.plan.recentClaims')}
                        </h2>
                        <a
                            href={WEB_PLAN_ROUTES.CLAIMS}
                            style={{
                                fontSize: typography.fontSize['text-sm'],
                                color: plan.primary,
                                textDecoration: 'none',
                                fontFamily: typography.fontFamily.body,
                            }}
                        >
                            {t('journeys.plan.viewAll')}
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {recentClaims.map((claim) => (
                            <ClaimCard
                                key={claim.id}
                                claim={claim}
                                onViewDetails={() => void router.push(`/plan/claims/${claim.id}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2
                        style={{
                            fontSize: typography.fontSize['heading-lg'],
                            fontWeight: typography.fontWeight.semiBold,
                            color: plan.text,
                            marginBottom: spacing.md,
                            fontFamily: typography.fontFamily.heading,
                        }}
                    >
                        {t('journeys.plan.quickActions.title')}
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: spacing.md,
                        }}
                    >
                        {[
                            {
                                labelKey: 'journeys.plan.quickActions.viewCoverage',
                                href: WEB_PLAN_ROUTES.COVERAGE,
                                icon: '\u{1F6E1}',
                            },
                            {
                                labelKey: 'journeys.plan.quickActions.newClaim',
                                href: '/plan/claims/submit',
                                icon: '\u{1F4DD}',
                            },
                            {
                                labelKey: 'journeys.plan.quickActions.costSimulator',
                                href: WEB_PLAN_ROUTES.COST_SIMULATOR,
                                icon: '\u{1F4B0}',
                            },
                        ].map((action) => (
                            <a
                                key={action.labelKey}
                                href={action.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    backgroundColor: colors.gray[0],
                                    borderRadius: borderRadius.md,
                                    padding: spacing.md,
                                    textDecoration: 'none',
                                    color: plan.text,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                    fontFamily: typography.fontFamily.body,
                                    fontSize: typography.fontSize['text-md'],
                                    fontWeight: typography.fontWeight.medium,
                                    transition: 'box-shadow 0.2s',
                                }}
                            >
                                <span style={{ fontSize: '24px' }}>{action.icon}</span>
                                {t(action.labelKey)}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </PlanLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default PlanDashboard;
