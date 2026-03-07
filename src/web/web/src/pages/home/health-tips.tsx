import React from 'react';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';

interface HealthTip {
    id: string;
    emoji: string;
    title: string;
    bgColor: string;
}

interface FeaturedTip {
    id: string;
    emoji: string;
    title: string;
    description: string;
}

const TIPS: HealthTip[] = [
    {
        id: 'tip-1',
        emoji: '\uD83E\uDD57',
        title: 'Alimentacao balanceada melhora sua energia diaria',
        bgColor: colors.journeys.health.primary,
    },
    {
        id: 'tip-2',
        emoji: '\uD83C\uDFC3',
        title: '30 minutos de exercicio por dia fazem a diferenca',
        bgColor: colors.journeys.care.primary,
    },
    {
        id: 'tip-3',
        emoji: '\uD83D\uDE34',
        title: 'Dormir 7-8 horas fortalece seu sistema imunologico',
        bgColor: colors.journeys.plan.primary,
    },
    {
        id: 'tip-4',
        emoji: '\uD83E\uDDD8',
        title: 'Meditacao reduz estresse e ansiedade',
        bgColor: colors.brand.tertiary,
    },
    {
        id: 'tip-5',
        emoji: '\uD83D\uDCA7',
        title: 'Beba ao menos 2 litros de agua por dia',
        bgColor: colors.brand.primary,
    },
];

const FEATURED: FeaturedTip[] = [
    {
        id: 'feat-1',
        emoji: '\u2764\uFE0F',
        title: 'Saude Cardiovascular',
        description: 'Dicas para manter seu coracao saudavel com exercicios regulares e alimentacao equilibrada.',
    },
    {
        id: 'feat-2',
        emoji: '\uD83E\uDDE0',
        title: 'Saude Mental',
        description: 'Praticas diarias para cuidar do seu bem-estar emocional e reduzir o estresse.',
    },
];

const HealthTipsPage: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dicas de Saude</h1>

            <p style={styles.sectionLabel}>DICAS DIARIAS</p>
            <div style={styles.carouselRow}>
                {TIPS.map((tip) => (
                    <div key={tip.id} style={{ ...styles.tipCard, backgroundColor: tip.bgColor }}>
                        <span style={styles.tipEmoji}>{tip.emoji}</span>
                        <p style={styles.tipTitle}>{tip.title}</p>
                        <span style={styles.readMore}>Leia Mais</span>
                    </div>
                ))}
            </div>

            <h2 style={styles.featuredTitle}>Destaques</h2>
            {FEATURED.map((feat) => (
                <div key={feat.id} style={styles.featuredCard}>
                    <span style={styles.featuredIcon}>{feat.emoji}</span>
                    <div style={styles.featuredInfo}>
                        <p style={styles.featuredName}>{feat.title}</p>
                        <p style={styles.featuredDesc}>{feat.description}</p>
                    </div>
                </div>
            ))}
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
        margin: `0 0 ${spacing.xl} 0`,
    },
    sectionLabel: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray500,
        letterSpacing: '0.05em',
        margin: `0 0 ${spacing.sm} 0`,
        fontFamily: typography.fontFamily.body,
    },
    carouselRow: {
        display: 'flex',
        gap: spacing.md,
        overflowX: 'auto',
        paddingBottom: spacing.md,
        marginBottom: spacing.xl,
    },
    tipCard: {
        minWidth: '180px',
        maxWidth: '200px',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '200px',
        flexShrink: 0,
    },
    tipEmoji: { fontSize: '36px' },
    tipTitle: {
        fontSize: typography.fontSize['text-sm'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.white,
        margin: `${spacing.sm} 0 0 0`,
    },
    readMore: {
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.white,
        opacity: 0.8,
        marginTop: spacing.sm,
    },
    featuredTitle: {
        fontSize: typography.fontSize['heading-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        fontFamily: typography.fontFamily.heading,
        margin: `0 0 ${spacing.md} 0`,
    },
    featuredCard: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.neutral.gray100,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    featuredIcon: { fontSize: typography.fontSize['heading-xl'], marginRight: spacing.md },
    featuredInfo: { flex: 1 },
    featuredName: {
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.semiBold,
        color: colors.neutral.gray900,
        margin: `0 0 ${spacing['4xs']} 0`,
        fontFamily: typography.fontFamily.body,
    },
    featuredDesc: {
        fontSize: typography.fontSize['text-sm'],
        color: colors.neutral.gray600,
        margin: 0,
        fontFamily: typography.fontFamily.body,
    },
};

export default HealthTipsPage;
