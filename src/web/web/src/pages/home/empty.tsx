import React from 'react';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';

interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
    href: string;
}

const CHECKLIST: ChecklistItem[] = [
    { id: 'profile', label: 'Complete seu perfil', completed: true, href: '/profile' },
    { id: 'goals', label: 'Adicione metas de saude', completed: false, href: '/health/goals' },
    { id: 'device', label: 'Conecte um dispositivo', completed: false, href: '/health/devices' },
    { id: 'appointment', label: 'Agende sua primeira consulta', completed: false, href: '/care/booking' },
    { id: 'medication', label: 'Adicione um medicamento', completed: false, href: '/health/medications/add' },
];

const HomeEmptyPage: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.center}>
                <span style={styles.welcomeIcon}>{'\uD83C\uDF1F'}</span>
                <h1 style={styles.title}>Bem-vindo ao AUSTA!</h1>
                <p style={styles.subtitle}>
                    Seu super app de saude. Configure sua conta para comecar a aproveitar todos os recursos.
                </p>

                <div style={styles.checklist}>
                    <h2 style={styles.checklistTitle}>Primeiros Passos</h2>
                    {CHECKLIST.map((item) => (
                        <a key={item.id} href={item.href} style={styles.checkItem}>
                            <span
                                style={{
                                    ...styles.checkCircle,
                                    borderColor: item.completed ? colors.semantic.success : colors.neutral.gray300,
                                    backgroundColor: item.completed ? colors.semantic.success : 'transparent',
                                }}
                            >
                                {item.completed && <span style={styles.checkMark}>{'\u2713'}</span>}
                            </span>
                            <span
                                style={{
                                    ...styles.checkLabel,
                                    color: item.completed ? colors.neutral.gray400 : colors.neutral.gray900,
                                    textDecoration: item.completed ? 'line-through' : 'none',
                                }}
                            >
                                {item.label}
                            </span>
                            {!item.completed && <span style={styles.chevron}>{'\u203A'}</span>}
                        </a>
                    ))}
                </div>

                <div style={styles.ctaSection}>
                    <a href="/health" style={styles.primaryBtn}>
                        Explorar Saude
                    </a>
                    <a href="/care/booking" style={styles.secondaryBtn}>
                        Agendar Consulta
                    </a>
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '600px', margin: '0 auto', padding: spacing.xl },
    center: { textAlign: 'center' },
    welcomeIcon: { fontSize: '72px', display: 'block', marginBottom: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.sm} 0`,
    },
    subtitle: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        fontFamily: typography.fontFamily.body,
        lineHeight: '24px',
        margin: `0 0 ${spacing['2xl']} 0`,
    },
    checklist: { textAlign: 'left', marginBottom: spacing.xl },
    checklistTitle: {
        fontSize: typography.fontSize['heading-sm'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.md} 0`,
    },
    checkItem: {
        display: 'flex',
        alignItems: 'center',
        padding: `${spacing.md}`,
        backgroundColor: colors.neutral.gray100,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
        textDecoration: 'none',
        cursor: 'pointer',
    },
    checkCircle: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        flexShrink: 0,
    },
    checkMark: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.white,
    },
    checkLabel: {
        flex: 1,
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily.body,
    },
    chevron: { fontSize: typography.fontSize['text-md'], color: colors.neutral.gray400 },
    ctaSection: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
    primaryBtn: {
        display: 'block',
        backgroundColor: colors.brand.primary,
        color: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: `${spacing.md}`,
        textAlign: 'center',
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.bold,
        textDecoration: 'none',
        fontFamily: typography.fontFamily.body,
    },
    secondaryBtn: {
        display: 'block',
        backgroundColor: colors.neutral.gray100,
        color: colors.brand.primary,
        borderRadius: borderRadius.md,
        padding: `${spacing.md}`,
        textAlign: 'center',
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.semiBold,
        textDecoration: 'none',
        fontFamily: typography.fontFamily.body,
    },
};

export default HomeEmptyPage;
