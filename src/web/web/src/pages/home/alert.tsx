import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { borderRadius } from 'design-system/tokens/borderRadius';
import { shadows } from 'design-system/tokens/shadows';

import { MainLayout, useAuth } from '@/components/index';

/**
 * Severity levels for health alerts with associated styling.
 */
type AlertSeverity = 'critical' | 'warning' | 'info';

interface HealthAlert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    timestamp: string;
    actionLabel?: string;
    actionHref?: string;
    dismissed: boolean;
}

/**
 * Returns the color token for a given alert severity.
 */
const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
        case 'critical':
            return colors.semantic.error;
        case 'warning':
            return colors.semantic.warning;
        case 'info':
            return colors.semantic.info;
    }
};

/**
 * Returns the background color token for a given alert severity.
 */
const getSeverityBgColor = (severity: AlertSeverity): string => {
    switch (severity) {
        case 'critical':
            return colors.semantic.errorBg;
        case 'warning':
            return colors.semantic.warningBg;
        case 'info':
            return `${colors.semantic.info}10`;
    }
};

/**
 * Returns the label text for a given alert severity.
 */
const getSeverityLabel = (severity: AlertSeverity): string => {
    switch (severity) {
        case 'critical':
            return 'Critico';
        case 'warning':
            return 'Atencao';
        case 'info':
            return 'Informacao';
    }
};

/**
 * Sample alerts data. In production, these would come from an API/hook.
 */
const INITIAL_ALERTS: HealthAlert[] = [
    {
        id: 'alert-1',
        title: 'Frequencia cardiaca elevada',
        message: 'Sua frequencia cardiaca ficou acima de 100 bpm por mais de 30 minutos hoje.',
        severity: 'critical',
        timestamp: '2026-02-21T10:30:00',
        actionLabel: 'Ver detalhes',
        actionHref: '/health/heart-rate',
        dismissed: false,
    },
    {
        id: 'alert-2',
        title: 'Meta de passos nao atingida',
        message: 'Voce atingiu apenas 60% da sua meta de passos nos ultimos 3 dias.',
        severity: 'warning',
        timestamp: '2026-02-21T08:00:00',
        actionLabel: 'Ajustar meta',
        actionHref: '/health/goals',
        dismissed: false,
    },
    {
        id: 'alert-3',
        title: 'Consulta amanha',
        message: 'Lembrete: Voce tem uma consulta agendada para amanha as 14:00.',
        severity: 'info',
        timestamp: '2026-02-20T18:00:00',
        actionLabel: 'Ver consulta',
        actionHref: '/care/appointments',
        dismissed: false,
    },
    {
        id: 'alert-4',
        title: 'Pressao arterial estavel',
        message: 'Sua pressao arterial se manteve dentro dos parametros normais esta semana.',
        severity: 'info',
        timestamp: '2026-02-20T12:00:00',
        dismissed: false,
    },
];

/**
 * Formats an ISO timestamp into a relative or absolute date string.
 */
const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Ha ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ontem';
    return `Ha ${diffDays} dias`;
};

/**
 * Health Alerts page showing a list of health-related alerts
 * with severity badges, dismiss functionality, and action buttons.
 */
const AlertPage: React.FC = () => {
    const router = useRouter();
    const [alerts, setAlerts] = useState<HealthAlert[]>(INITIAL_ALERTS);

    const activeAlerts = alerts.filter((a) => !a.dismissed);

    const handleDismiss = (alertId: string) => {
        setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)));
    };

    const handleDismissAll = () => {
        setAlerts((prev) => prev.map((a) => ({ ...a, dismissed: true })));
    };

    return (
        <MainLayout>
            {/* Page Header */}
            <div style={pageStyles.header}>
                <div>
                    <h1 style={pageStyles.pageTitle}>Alertas de Saude</h1>
                    <p style={pageStyles.pageSubtitle}>Acompanhe notificacoes e alertas sobre sua saude.</p>
                </div>
                {activeAlerts.length > 0 && (
                    <button style={pageStyles.dismissAllButton} onClick={handleDismissAll}>
                        Dispensar todos
                    </button>
                )}
            </div>

            {/* Alert List */}
            {activeAlerts.length === 0 ? (
                <div style={pageStyles.emptyState}>
                    <span style={pageStyles.emptyIcon}>{'🔔'}</span>
                    <h3 style={pageStyles.emptyTitle}>Nenhum alerta</h3>
                    <p style={pageStyles.emptyMessage}>
                        Voce nao tem alertas de saude no momento. Continue cuidando da sua saude!
                    </p>
                </div>
            ) : (
                <div style={pageStyles.alertList}>
                    {activeAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            style={{
                                ...pageStyles.alertCard,
                                borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                                backgroundColor: getSeverityBgColor(alert.severity),
                            }}
                        >
                            <div style={pageStyles.alertHeader}>
                                <div style={pageStyles.alertTitleRow}>
                                    <span
                                        style={{
                                            ...pageStyles.severityBadge,
                                            color: getSeverityColor(alert.severity),
                                            backgroundColor: `${getSeverityColor(alert.severity)}20`,
                                        }}
                                    >
                                        {getSeverityLabel(alert.severity)}
                                    </span>
                                    <span style={pageStyles.alertTimestamp}>{formatTimestamp(alert.timestamp)}</span>
                                </div>
                                <h3 style={pageStyles.alertTitle}>{alert.title}</h3>
                                <p style={pageStyles.alertMessage}>{alert.message}</p>
                            </div>
                            <div style={pageStyles.alertActions}>
                                {alert.actionLabel && alert.actionHref && (
                                    <button
                                        style={pageStyles.actionButton}
                                        onClick={() => router.push(alert.actionHref!)}
                                    >
                                        {alert.actionLabel}
                                    </button>
                                )}
                                <button style={pageStyles.dismissButton} onClick={() => handleDismiss(alert.id)}>
                                    Dispensar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
};

const pageStyles: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing['2xl'],
        padding: `${spacing.xl} 0`,
    },
    pageTitle: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        margin: 0,
        fontFamily: typography.fontFamily.heading,
    },
    pageSubtitle: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        margin: `${spacing.xs} 0 0 0`,
        fontFamily: typography.fontFamily.body,
    },
    dismissAllButton: {
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: 'transparent',
        color: colors.neutral.gray600,
        border: `1px solid ${colors.neutral.gray300}`,
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
    alertList: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
    },
    alertCard: {
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        boxShadow: shadows.sm,
    },
    alertHeader: {
        marginBottom: spacing.sm,
    },
    alertTitleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    severityBadge: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.semiBold,
        padding: `${spacing['4xs']} ${spacing.xs}`,
        borderRadius: borderRadius.full,
        textTransform: 'uppercase' as const,
        letterSpacing: typography.letterSpacing.wide,
        fontFamily: typography.fontFamily.body,
    },
    alertTimestamp: {
        fontSize: typography.fontSize['text-xs'],
        color: colors.neutral.gray500,
        fontFamily: typography.fontFamily.body,
    },
    alertTitle: {
        fontSize: typography.fontSize['heading-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        margin: `0 0 ${spacing['3xs']} 0`,
        fontFamily: typography.fontFamily.heading,
    },
    alertMessage: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray700,
        margin: 0,
        lineHeight: typography.lineHeight.base,
        fontFamily: typography.fontFamily.body,
    },
    alertActions: {
        display: 'flex',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    actionButton: {
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: colors.brand.primary,
        color: colors.neutral.white,
        border: 'none',
        borderRadius: borderRadius.sm,
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
    dismissButton: {
        padding: `${spacing.xs} ${spacing.md}`,
        backgroundColor: 'transparent',
        color: colors.neutral.gray600,
        border: `1px solid ${colors.neutral.gray300}`,
        borderRadius: borderRadius.sm,
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['5xl'],
        textAlign: 'center' as const,
    },
    emptyIcon: {
        fontSize: '56px',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.fontSize['heading-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        margin: `0 0 ${spacing.xs} 0`,
        fontFamily: typography.fontFamily.heading,
    },
    emptyMessage: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        margin: 0,
        maxWidth: '400px',
        lineHeight: typography.lineHeight.base,
        fontFamily: typography.fontFamily.body,
    },
};

export default AlertPage;
