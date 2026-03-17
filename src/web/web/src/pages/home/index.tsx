import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { shadows } from 'design-system/tokens/shadows';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';

import {
    MainLayout,
    MetricsWidget,
    AppointmentsWidget,
    ClaimsWidget,
    RecentActivityWidget,
    AchievementsWidget,
} from '@/components';
import { useAuth, useHealthMetrics, useAppointments, useClaims, useGamification, useJourney } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router 13.0+

/**
 * Journey configuration for the three core journeys displayed on the dashboard.
 */
const JOURNEYS = [
    {
        id: 'health',
        title: 'Minha Saude',
        description: 'Acompanhe suas metricas de saude, metas e integracoes.',
        color: colors.journeys.health.primary,
        background: colors.journeys.health.background,
        href: '/health',
    },
    {
        id: 'care',
        title: 'Cuidado Agora',
        description: 'Encontre profissionais, agende consultas e telemedicina.',
        color: colors.journeys.care.primary,
        background: colors.journeys.care.background,
        href: '/care',
    },
    {
        id: 'plan',
        title: 'Meu Plano',
        description: 'Veja cobertura, envie sinistros e simule custos.',
        color: colors.journeys.plan.primary,
        background: colors.journeys.plan.background,
        href: '/plan',
    },
] as const;

/**
 * Quick action items displayed at the bottom of the dashboard.
 */
const QUICK_ACTIONS = [
    { label: 'Adicionar Metrica', href: '/home/metrics', icon: '📊' },
    { label: 'Agendar Consulta', href: '/care/appointments', icon: '📅' },
    { label: 'Ver Alertas', href: '/home/alert', icon: '🔔' },
    { label: 'Meu Perfil', href: '/profile', icon: '👤' },
] as const;

/**
 * Renders the home page dashboard with journey cards, health metrics,
 * appointments, claims, recent activity, and achievements widgets.
 */
const Home: React.FC = () => {
    const router = useRouter();
    useAuth();
    useHealthMetrics('user-123', []);
    useAppointments();
    useClaims();
    const { gameProfile } = useGamification('user-123');
    useJourney();

    return (
        <MainLayout>
            {/* Welcome Header */}
            <div style={pageStyles.welcomeSection}>
                <div>
                    <h1 style={pageStyles.welcomeTitle}>Bem-vindo de volta!</h1>
                    <p style={pageStyles.welcomeSubtitle}>Acompanhe sua saude e bem-estar em um so lugar.</p>
                </div>
                {gameProfile && (
                    <div style={pageStyles.levelBadge}>
                        <span style={pageStyles.levelText}>Level {gameProfile.level ?? 1}</span>
                        <span style={pageStyles.xpText}>{gameProfile.xp ?? 0} XP</span>
                    </div>
                )}
            </div>

            {/* Journey Cards */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Suas Jornadas</h2>
                <div style={pageStyles.journeyGrid}>
                    {JOURNEYS.map((j) => (
                        <div
                            key={j.id}
                            style={{
                                ...pageStyles.journeyCard,
                                borderLeft: `4px solid ${j.color}`,
                                backgroundColor: j.background,
                            }}
                            onClick={() => void router.push(j.href)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void router.push(j.href);
                                }
                            }}
                        >
                            <h3 style={{ ...pageStyles.journeyTitle, color: j.color }}>{j.title}</h3>
                            <p style={pageStyles.journeyDescription}>{j.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Health Metrics Summary */}
            <section style={pageStyles.section}>
                <div style={pageStyles.sectionHeader}>
                    <h2 style={pageStyles.sectionTitle}>Metricas de Saude</h2>
                    <a
                        href="/home/metrics"
                        style={pageStyles.viewAllLink}
                        onClick={(e) => {
                            e.preventDefault();
                            void router.push('/home/metrics');
                        }}
                    >
                        Ver todas
                    </a>
                </div>
                <MetricsWidget />
            </section>

            {/* Appointments */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Proximas Consultas</h2>
                <AppointmentsWidget />
            </section>

            {/* Claims */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Sinistros Recentes</h2>
                <ClaimsWidget />
            </section>

            {/* Quick Actions */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Acoes Rapidas</h2>
                <div style={pageStyles.quickActionsGrid}>
                    {QUICK_ACTIONS.map((action) => (
                        <div
                            key={action.label}
                            style={pageStyles.quickActionCard}
                            onClick={() => void router.push(action.href)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void router.push(action.href);
                                }
                            }}
                        >
                            <span style={pageStyles.quickActionIcon}>{action.icon}</span>
                            <span style={pageStyles.quickActionLabel}>{action.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Activity */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Atividade Recente</h2>
                <RecentActivityWidget />
            </section>

            {/* Achievements */}
            <section style={pageStyles.section}>
                <h2 style={pageStyles.sectionTitle}>Conquistas</h2>
                <AchievementsWidget />
            </section>
        </MainLayout>
    );
};

/**
 * Page-level styles using design system tokens.
 * All colors, spacing, typography, and border radius values reference tokens.
 */
const pageStyles: Record<string, React.CSSProperties> = {
    welcomeSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${spacing.xl} 0`,
        marginBottom: spacing.md,
    },
    welcomeTitle: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        margin: 0,
        fontFamily: typography.fontFamily.heading,
    },
    welcomeSubtitle: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        margin: `${spacing.xs} 0 0 0`,
        fontFamily: typography.fontFamily.body,
    },
    levelBadge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.journeys.community.background,
        borderRadius: borderRadius.md,
        padding: `${spacing.xs} ${spacing.sm}`,
    },
    levelText: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.bold,
        color: colors.journeys.community.primary,
    },
    xpText: {
        fontSize: typography.fontSize['text-xs'],
        color: colors.journeys.community.secondary,
        marginTop: spacing['4xs'],
    },
    section: {
        marginBottom: spacing['2xl'],
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize['heading-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        margin: `0 0 ${spacing.sm} 0`,
        fontFamily: typography.fontFamily.heading,
    },
    viewAllLink: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.brand.primary,
        textDecoration: 'none',
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
    },
    journeyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: spacing.md,
    },
    journeyCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        boxShadow: shadows.sm,
    },
    journeyTitle: {
        fontSize: typography.fontSize['heading-sm'],
        fontWeight: typography.fontWeight.semiBold,
        margin: `0 0 ${spacing.xs} 0`,
        fontFamily: typography.fontFamily.heading,
    },
    journeyDescription: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        margin: 0,
        lineHeight: typography.lineHeight.base,
        fontFamily: typography.fontFamily.body,
    },
    quickActionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: spacing.sm,
    },
    quickActionCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        backgroundColor: colors.neutral.gray100,
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        gap: spacing.xs,
    },
    quickActionIcon: {
        fontSize: typography.fontSize['heading-xl'],
    },
    quickActionLabel: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.medium,
        color: colors.neutral.gray700,
        textAlign: 'center' as const,
        fontFamily: typography.fontFamily.body,
    },
};

export const getServerSideProps = () => ({ props: {} });

export default Home;
