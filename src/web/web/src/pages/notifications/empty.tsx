import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';

import { useNotifications } from '@/hooks/useNotifications';

const NotificationEmptyPage: React.FC = () => {
    const { isLoading: _isLoading } = useNotifications();

    return (
        <div style={styles.container}>
            <div style={styles.center}>
                <div style={styles.iconCircle}>
                    <span style={styles.icon}>{'\uD83D\uDD14'}</span>
                </div>
                <h1 style={styles.title}>Nenhuma notificacao</h1>
                <p style={styles.description}>
                    Voce ainda nao recebeu nenhuma notificacao. Quando houver atualizacoes importantes, elas aparecerão
                    aqui.
                </p>
                <a href="/" style={styles.homeBtn}>
                    Ir para Home
                </a>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: spacing.xl,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: { textAlign: 'center' },
    iconCircle: {
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        backgroundColor: colors.neutral.gray100,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    icon: { fontSize: '42px' },
    title: {
        fontSize: typography.fontSize['heading-lg'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.sm} 0`,
    },
    description: {
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        fontFamily: typography.fontFamily.body,
        lineHeight: '24px',
        margin: `0 0 ${spacing['2xl']} 0`,
    },
    homeBtn: {
        display: 'inline-block',
        backgroundColor: colors.brand.primary,
        color: colors.neutral.white,
        borderRadius: borderRadius.md,
        padding: `${spacing.sm} ${spacing['2xl']}`,
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.bold,
        textDecoration: 'none',
        fontFamily: typography.fontFamily.body,
    },
};

export const getServerSideProps = () => ({ props: {} });

export default NotificationEmptyPage;
