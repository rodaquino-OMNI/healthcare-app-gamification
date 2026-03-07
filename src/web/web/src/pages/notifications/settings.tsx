import React, { useState } from 'react';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';

interface NotificationToggles {
    healthUpdates: boolean;
    careReminders: boolean;
    planNotifications: boolean;
    systemAlerts: boolean;
    quietHours: boolean;
}

const NotificationSettingsPage: React.FC = () => {
    const [toggles, setToggles] = useState<NotificationToggles>({
        healthUpdates: true,
        careReminders: true,
        planNotifications: true,
        systemAlerts: false,
        quietHours: false,
    });

    const handleToggle = (key: keyof NotificationToggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const categories: { key: keyof NotificationToggles; label: string; desc: string; color: string }[] = [
        {
            key: 'healthUpdates',
            label: 'Atualizacoes de Saude',
            desc: 'Metas, metricas e lembretes de saude',
            color: colors.journeys.health.primary,
        },
        {
            key: 'careReminders',
            label: 'Lembretes de Consulta',
            desc: 'Consultas, exames e telemedicina',
            color: colors.journeys.care.primary,
        },
        {
            key: 'planNotifications',
            label: 'Notificacoes do Plano',
            desc: 'Reembolsos, coberturas e faturas',
            color: colors.journeys.plan.primary,
        },
        {
            key: 'systemAlerts',
            label: 'Alertas do Sistema',
            desc: 'Atualizacoes e manutencoes do app',
            color: colors.neutral.gray500,
        },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Configuracoes de Notificacao</h1>

            <section>
                <p style={styles.sectionLabel}>CATEGORIAS</p>
                {categories.map((cat) => (
                    <div key={cat.key} style={styles.toggleRow}>
                        <div style={styles.toggleInfo}>
                            <p style={styles.toggleLabel}>{cat.label}</p>
                            <p style={styles.toggleDesc}>{cat.desc}</p>
                        </div>
                        <label style={styles.switch}>
                            <input
                                type="checkbox"
                                checked={toggles[cat.key]}
                                onChange={() => handleToggle(cat.key)}
                                style={styles.checkbox}
                            />
                            <span
                                style={{
                                    ...styles.slider,
                                    backgroundColor: toggles[cat.key] ? cat.color : colors.neutral.gray300,
                                }}
                            />
                        </label>
                    </div>
                ))}
            </section>

            <section>
                <p style={styles.sectionLabel}>HORARIO SILENCIOSO</p>
                <div style={styles.toggleRow}>
                    <div style={styles.toggleInfo}>
                        <p style={styles.toggleLabel}>Ativar horario silencioso</p>
                        <p style={styles.toggleDesc}>Silenciar notificacoes durante o periodo noturno</p>
                    </div>
                    <label style={styles.switch}>
                        <input
                            type="checkbox"
                            checked={toggles.quietHours}
                            onChange={() => handleToggle('quietHours')}
                            style={styles.checkbox}
                        />
                        <span
                            style={{
                                ...styles.slider,
                                backgroundColor: toggles.quietHours ? colors.brand.primary : colors.neutral.gray300,
                            }}
                        />
                    </label>
                </div>

                {toggles.quietHours && (
                    <div style={styles.timeSection}>
                        <div style={styles.timeRow}>
                            <span style={styles.timeLabel}>De</span>
                            <span style={styles.timeValue}>22:00</span>
                        </div>
                        <div style={styles.timeRow}>
                            <span style={styles.timeLabel}>Ate</span>
                            <span style={styles.timeValue}>07:00</span>
                        </div>
                    </div>
                )}
            </section>

            <button style={styles.saveBtn}>Salvar Configuracoes</button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: '600px', margin: '0 auto', padding: spacing.xl },
    title: {
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.xl} 0`,
    },
    sectionLabel: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray500,
        letterSpacing: '0.05em',
        margin: `${spacing.xl} 0 ${spacing.sm} 0`,
        fontFamily: typography.fontFamily.body,
    },
    toggleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${spacing.md} 0`,
        borderBottom: `1px solid ${colors.neutral.gray200}`,
    },
    toggleInfo: { flex: 1, marginRight: spacing.md },
    toggleLabel: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.medium,
        color: colors.neutral.gray900,
        margin: 0,
        fontFamily: typography.fontFamily.body,
    },
    toggleDesc: {
        fontSize: typography.fontSize['text-xs'],
        color: colors.neutral.gray500,
        margin: `${spacing['4xs']} 0 0 0`,
        fontFamily: typography.fontFamily.body,
    },
    switch: { position: 'relative', display: 'inline-block', width: '44px', height: '24px', flexShrink: 0 },
    checkbox: { opacity: 0, width: 0, height: 0 },
    slider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: borderRadius.full,
        transition: 'background-color 0.2s',
    },
    timeSection: { paddingLeft: spacing.md },
    timeRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${spacing.md} 0`,
        borderBottom: `1px solid ${colors.neutral.gray200}`,
    },
    timeLabel: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.medium,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.body,
    },
    timeValue: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.brand.primary,
        fontFamily: typography.fontFamily.mono,
    },
    saveBtn: {
        width: '100%',
        marginTop: spacing.xl,
        backgroundColor: colors.brand.primary,
        color: colors.neutral.white,
        border: 'none',
        borderRadius: borderRadius.md,
        padding: `${spacing.md}`,
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.bold,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.body,
    },
};

export default NotificationSettingsPage;
