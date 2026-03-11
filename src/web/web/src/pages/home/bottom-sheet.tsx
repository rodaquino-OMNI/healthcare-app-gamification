import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

interface QuickAction {
    id: string;
    icon: string;
    label: string;
    href: string;
    bgColor: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'add-metric',
        icon: '\uD83D\uDCCA',
        label: 'Adicionar Metrica de Saude',
        href: '/health/add-metric',
        bgColor: `${colors.journeys.health.primary}20`,
    },
    {
        id: 'book',
        icon: '\uD83D\uDCC5',
        label: 'Agendar Consulta',
        href: '/care/booking',
        bgColor: `${colors.journeys.care.primary}20`,
    },
    {
        id: 'symptoms',
        icon: '\uD83E\uDE7A',
        label: 'Verificar Sintomas',
        href: '/care/symptom-checker',
        bgColor: `${colors.semantic.warning}20`,
    },
    {
        id: 'medication',
        icon: '\uD83D\uDC8A',
        label: 'Registrar Medicamento',
        href: '/health/medications',
        bgColor: `${colors.journeys.plan.primary}20`,
    },
];

const BottomSheetPage: React.FC = () => {
    const { isAuthenticated: _isAuthenticated } = useAuth();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Acoes Rapidas</h1>
            <p style={styles.subtitle}>Acesse rapidamente as funcionalidades mais utilizadas.</p>

            <div style={styles.actionsContainer}>
                {QUICK_ACTIONS.map((action) => (
                    <a key={action.id} href={action.href} style={styles.actionRow}>
                        <div style={{ ...styles.iconCircle, backgroundColor: action.bgColor }}>
                            <span style={styles.icon}>{action.icon}</span>
                        </div>
                        <span style={styles.actionLabel}>{action.label}</span>
                        <span style={styles.chevron}>{'\u203A'}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '800px', margin: '0 auto', padding: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: 0,
    },
    subtitle: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        fontFamily: typography.fontFamily.body,
        margin: `${spacing.xs} 0 ${spacing.xl} 0`,
    },
    actionsContainer: {
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.md,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        overflow: 'hidden',
    },
    actionRow: {
        display: 'flex',
        alignItems: 'center',
        padding: `${spacing.md} ${spacing.lg}`,
        borderBottom: `1px solid ${colors.neutral.gray200}`,
        textDecoration: 'none',
        cursor: 'pointer',
    },
    iconCircle: {
        width: '40px',
        height: '40px',
        borderRadius: borderRadius.full,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    icon: { fontSize: typography.fontSize['text-lg'] },
    actionLabel: {
        flex: 1,
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.medium,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.body,
    },
    chevron: { fontSize: typography.fontSize['text-lg'], color: colors.neutral.gray400 },
};

export default BottomSheetPage;
