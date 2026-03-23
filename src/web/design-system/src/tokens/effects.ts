/**
 * Effects tokens for the AUSTA SuperApp design system.
 * Elevation (box-shadow), blur, and focus ring styles.
 * Based on Figma Effects frame specifications.
 */

export const effects = {
    /** Box shadows for elevation levels */
    boxShadow: {
        /** No shadow */
        none: 'none',
        /** Cards, subtle lift — Figma Shadow/sm */
        sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        /** Dropdowns, popovers — Figma Shadow/md */
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
        /** Modals, dialogs — Figma Shadow/lg */
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
        /** Full-screen overlays — Figma Shadow/xl */
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },

    /** Semantic elevation aliases */
    elevation: {
        /** Cards, list items */
        card: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        /** Dropdown menus, select popups */
        dropdown: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
        /** Modal dialogs, bottom sheets */
        modal: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
        /** Toast notifications */
        toast: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
        /** Sticky headers, navigation bars */
        sticky: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
    },

    /** Focus ring styles for accessibility */
    focusRing: {
        /** Default focus ring (brand color) */
        default: '0 0 0 2px #ffffff, 0 0 0 4px #05AEDB',
        /** Error focus ring */
        error: '0 0 0 2px #ffffff, 0 0 0 4px #e11d48',
        /** Inner focus ring for compact elements */
        inset: 'inset 0 0 0 2px #05AEDB',
    },

    /** Blur values */
    blur: {
        /** Subtle blur for frosted glass effect */
        sm: '4px',
        /** Standard blur */
        md: '8px',
        /** Heavy blur for overlay backgrounds */
        lg: '16px',
        /** Extra heavy blur */
        xl: '24px',
    },

    /** Border radius tokens */
    borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
    },
} as const;
