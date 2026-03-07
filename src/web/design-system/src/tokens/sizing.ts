/**
 * Sizing tokens for the AUSTA SuperApp design system.
 * Sourced from Figma DTCG core.json (size and size-icon sections).
 *
 * Two categories:
 *   component — general UI component sizes (buttons, inputs, avatars, etc.)
 *   icon      — icon sizes for consistent iconography
 */

/**
 * Raw numeric sizing values in pixels.
 * Sourced from Figma core.json.
 */
export const sizingValues = {
    component: {
        '2xs': 16, // size.2xs
        xs: 24, // size.xs
        sm: 32, // size.sm
        md: 40, // size.md
        lg: 48, // size.lg
        xl: 64, // size.xl
    },
    icon: {
        '2xs': 12, // size-icon.2xs
        xs: 16, // size-icon.xs
        sm: 20, // size-icon.sm
        md: 24, // size-icon.md
        lg: 32, // size-icon.lg
    },
} as const;

/**
 * Sizing values with pixel units.
 * Sourced from Figma DTCG core.json (size and size-icon sections).
 *
 * Usage:
 *   import { sizing } from '@austa/design-system/tokens';
 *   const buttonHeight = sizing.component.md; // '40px'
 *   const iconSize = sizing.icon.sm;          // '20px'
 */
export const sizing = {
    component: {
        '2xs': '16px', // size.2xs — extra-extra-small component (e.g. chip, badge)
        xs: '24px', // size.xs  — extra-small component (e.g. small button)
        sm: '32px', // size.sm  — small component (e.g. compact button)
        md: '40px', // size.md  — medium component (e.g. default button, input)
        lg: '48px', // size.lg  — large component (e.g. large button, avatar)
        xl: '64px', // size.xl  — extra-large component (e.g. hero avatar)
    },
    icon: {
        '2xs': '12px', // size-icon.2xs — tiny icon (e.g. inline indicator)
        xs: '16px', // size-icon.xs  — small icon (e.g. button icon)
        sm: '20px', // size-icon.sm  — standard small icon
        md: '24px', // size-icon.md  — default icon size
        lg: '32px', // size-icon.lg  — large decorative icon
    },
} as const;
