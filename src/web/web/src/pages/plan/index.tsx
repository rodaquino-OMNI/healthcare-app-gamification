import React from 'react';
import { useRouter } from 'next/router';
import { PlanLayout } from '@/layouts/PlanLayout';
import { InsuranceCard } from 'design-system/plan/InsuranceCard/InsuranceCard';
import { ClaimCard } from 'design-system/plan/ClaimCard/ClaimCard';
import { Text } from 'design-system/primitives';
import { WEB_PLAN_ROUTES } from 'shared/constants/routes';
import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import { useAuth } from '@/hooks/useAuth';
import { Claim } from 'shared/types/plan.types';

const { plan } = colors.journeys;

const MOCK_RECENT_CLAIMS: Claim[] = [
    {
        id: 'c1',
        planId: 'plan-001',
        type: 'medical',
        amount: 250.0,
        status: 'approved',
        submittedAt: '2026-02-10',
        documents: [],
    },
    {
        id: 'c2',
        planId: 'plan-001',
        type: 'dental',
        amount: 180.0,
        status: 'pending',
        submittedAt: '2026-02-15',
        documents: [],
    },
    {
        id: 'c3',
        planId: 'plan-001',
        type: 'vision',
        amount: 420.0,
        status: 'denied',
        submittedAt: '2026-01-22',
        documents: [],
    },
];

/**
 * The main dashboard component for the 'My Plan & Benefits' journey.
 */
const PlanDashboard: React.FC = () => {
    const router = useRouter();
    const { session } = useAuth();

    const stats = [
        { label: 'Total de Solicitacoes', value: '12', color: plan.primary },
        { label: 'Beneficios Ativos', value: '8', color: colors.semantic.success },
        { label: 'Cobertura', value: '85%', color: plan.accent },
    ];

    return (
        <PlanLayout>
            <div style={{ padding: spacing.xl }}>
                {/* Page Title */}
                <Text fontSize="2xl" fontWeight="medium">
                    Meu Plano & Beneficios
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
                    Gerencie seu plano, cobertura e solicitacoes
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
                                backgroundColor: '#ffffff',
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
                        Seu Cartao Digital
                    </h2>
                    <InsuranceCard
                        plan={{
                            id: 'plan-001',
                            userId: session?.accessToken || '',
                            planNumber: 'AUSTA-2026-001',
                            type: 'PPO',
                            validityStart: '2026-01-01',
                            validityEnd: '2026-12-31',
                            coverageDetails: {},
                            coverages: [],
                            benefits: [],
                            claims: [],
                        }}
                        user={{
                            id: session?.accessToken || '',
                            name: 'Usuario AUSTA',
                            cpf: '***.***.***-**',
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
                            Solicitacoes Recentes
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
                            Ver todas
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {MOCK_RECENT_CLAIMS.map((claim) => (
                            <ClaimCard
                                key={claim.id}
                                claim={claim}
                                onViewDetails={() => router.push(`/plan/claims/${claim.id}`)}
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
                        Acoes Rapidas
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: spacing.md,
                        }}
                    >
                        {[
                            { label: 'Ver Cobertura', href: WEB_PLAN_ROUTES.COVERAGE, icon: '\u{1F6E1}' },
                            { label: 'Nova Solicitacao', href: '/plan/claims/submit', icon: '\u{1F4DD}' },
                            { label: 'Simulador de Custos', href: WEB_PLAN_ROUTES.COST_SIMULATOR, icon: '\u{1F4B0}' },
                        ].map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.sm,
                                    backgroundColor: '#ffffff',
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
                                {action.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </PlanLayout>
    );
};

export default PlanDashboard;
