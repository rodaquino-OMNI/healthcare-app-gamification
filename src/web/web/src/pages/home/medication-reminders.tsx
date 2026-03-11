import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

interface MedicationReminder {
    id: string;
    drugName: string;
    dosage: string;
    time: string;
}

const INITIAL_REMINDERS: MedicationReminder[] = [
    { id: 'med-1', drugName: 'Losartana 50mg', dosage: '1 comprimido', time: '08:00' },
    { id: 'med-2', drugName: 'Metformina 850mg', dosage: '1 comprimido', time: '12:00' },
    { id: 'med-3', drugName: 'Sinvastatina 20mg', dosage: '1 comprimido', time: '22:00' },
];

const MedicationRemindersPage: React.FC = () => {
    const { isAuthenticated: _isAuthenticated } = useAuth();
    const [reminders, setReminders] = useState(INITIAL_REMINDERS);

    const handleTake = (id: string): void => {
        setReminders((prev) => prev.filter((r) => r.id !== id));
    };

    const handleSkip = (id: string): void => {
        setReminders((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Lembretes de Medicamento</h1>
                <a href="/health/medications" style={styles.viewAll}>
                    Ver Todos
                </a>
            </div>

            {reminders.length === 0 ? (
                <div style={styles.empty}>
                    <span style={styles.emptyIcon}>{'\u2705'}</span>
                    <p style={styles.emptyTitle}>Todos os medicamentos foram tomados!</p>
                    <p style={styles.emptyDesc}>Nenhum lembrete pendente no momento.</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {reminders.map((med) => (
                        <div key={med.id} style={styles.card}>
                            <span style={styles.pillIcon}>{'\uD83D\uDC8A'}</span>
                            <div style={styles.info}>
                                <p style={styles.drugName}>{med.drugName}</p>
                                <p style={styles.dosage}>{med.dosage}</p>
                                <p style={styles.time}>{med.time}</p>
                            </div>
                            <div style={styles.actions}>
                                <button style={styles.takeBtn} onClick={() => handleTake(med.id)}>
                                    Tomar
                                </button>
                                <button style={styles.skipBtn} onClick={() => handleSkip(med.id)}>
                                    Pular
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '800px', margin: '0 auto', padding: spacing.xl },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: 0,
    },
    viewAll: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.brand.primary,
        textDecoration: 'none',
    },
    list: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
    card: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderLeft: `4px solid ${colors.journeys.health.primary}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    pillIcon: { fontSize: typography.fontSize['heading-xl'], marginRight: spacing.md },
    info: { flex: 1 },
    drugName: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        margin: 0,
        fontFamily: typography.fontFamily.body,
    },
    dosage: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        margin: `${spacing['4xs']} 0`,
        fontFamily: typography.fontFamily.body,
    },
    time: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.journeys.health.primary,
        margin: 0,
        fontFamily: typography.fontFamily.body,
    },
    actions: { display: 'flex', flexDirection: 'column', gap: spacing['3xs'], alignItems: 'center' },
    takeBtn: {
        backgroundColor: colors.journeys.health.primary,
        color: colors.neutral.white,
        border: 'none',
        borderRadius: borderRadius.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.bold,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
    skipBtn: {
        backgroundColor: 'transparent',
        color: colors.neutral.gray500,
        border: 'none',
        fontSize: typography.fontSize['text-xs'],
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
    empty: { textAlign: 'center', padding: spacing['3xl'] },
    emptyIcon: { fontSize: '48px', display: 'block', marginBottom: spacing.md },
    emptyTitle: {
        fontSize: typography.fontSize['text-lg'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray600,
        margin: `0 0 ${spacing.xs} 0`,
        fontFamily: typography.fontFamily.heading,
    },
    emptyDesc: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray500,
        margin: 0,
        fontFamily: typography.fontFamily.body,
    },
};

export default MedicationRemindersPage;
