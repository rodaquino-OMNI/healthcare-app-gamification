import { baseTheme } from './base.theme';
import { colors } from '../tokens/colors';
import { borderRadius } from '../tokens/borderRadius';

/**
 * Plan Journey Theme
 *
 * This theme extends the base theme with specific styling for the My Plan & Benefits journey.
 * It uses a blue color palette to visually distinguish the Plan journey from other journeys,
 * creating a consistent visual identity throughout the user experience.
 */
export const planTheme = {
    ...baseTheme,

    // Journey identification
    name: 'Plan Theme',
    journeyKey: 'plan',

    // Override some colors with Plan-specific values
    colors: {
        ...baseTheme.colors,
        primary: colors.journeys.plan.primary,
        secondary: colors.journeys.plan.secondary,
        accent: colors.journeys.plan.accent,
        background: {
            ...baseTheme.colors.background,
            default: colors.journeys.plan.background,
        },
        text: {
            ...baseTheme.colors.text,
            default: colors.journeys.plan.text,
        },
        border: {
            ...baseTheme.colors.border,
            default: colors.journeys.plan.secondary,
            accent: colors.journeys.plan.primary,
        },
        focus: colors.journeys.plan.primary,
    },

    // Override some shadows with Plan-specific values
    shadows: {
        ...baseTheme.shadows,
        focus: `0 0 0 2px ${colors.journeys.plan.primary}`,
    },

    // Component-specific styling for the Plan journey
    components: {
        button: {
            primary: {
                background: colors.journeys.plan.primary,
                color: colors.neutral.white,
                hoverBackground: colors.journeys.plan.secondary,
                activeBackground: colors.journeys.plan.accent,
            },
            secondary: {
                background: 'transparent',
                color: colors.journeys.plan.primary,
                border: `1px solid ${colors.journeys.plan.primary}`,
                hoverBackground: colors.journeys.plan.background,
                activeBackground: colors.journeys.plan.background,
            },
        },

        card: {
            background: colors.neutral.white,
            border: `1px solid ${colors.neutral.gray300}`,
            borderLeft: `4px solid ${colors.journeys.plan.primary}`,
            borderRadius: borderRadius.md,
            shadow: baseTheme.shadows.sm,
        },

        input: {
            border: `1px solid ${colors.neutral.gray400}`,
            focusBorder: `1px solid ${colors.journeys.plan.primary}`,
            background: colors.neutral.white,
            placeholderColor: colors.neutral.gray500,
        },

        progressBar: {
            background: colors.neutral.gray200,
            fill: colors.journeys.plan.primary,
            borderRadius: borderRadius.xs,
        },

        // Plan journey specific components
        claimCard: {
            background: colors.neutral.white,
            border: `1px solid ${colors.neutral.gray300}`,
            borderLeft: `4px solid ${colors.journeys.plan.primary}`,
            borderRadius: borderRadius.md,
            shadow: baseTheme.shadows.sm,
            statusColors: {
                pending: colors.semantic.warning,
                approved: colors.semantic.success,
                denied: colors.semantic.error,
                processing: colors.journeys.plan.primary,
            },
        },

        insuranceCard: {
            background: colors.journeys.plan.primary,
            color: colors.neutral.white,
            borderRadius: borderRadius.lg,
            shadow: baseTheme.shadows.md,
        },

        coverageInfoCard: {
            background: colors.neutral.white,
            border: `1px solid ${colors.neutral.gray300}`,
            borderTop: `4px solid ${colors.journeys.plan.primary}`,
            borderRadius: borderRadius.md,
            shadow: baseTheme.shadows.sm,
            iconColor: colors.journeys.plan.primary,
        },
    },
};
