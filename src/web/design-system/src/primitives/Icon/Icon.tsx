import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

/**
 * Props for the Icon component
 */
export interface IconProps {
  /** The name of the icon to display (e.g., 'heart', 'calendar'). */
  name: string;
  /** The size of the icon — either a sizing.icon token key or a custom CSS value. */
  size?: keyof typeof sizing.icon | string | number;
  /** The color of the icon, using a color token from the design system. */
  color?: string;
  /** Whether the icon should be hidden from screen readers. Accepts boolean or string "true"/"false". */
  'aria-hidden'?: boolean | string;
  /** Accessible label for the icon (required when aria-hidden is false) */
  'aria-label'?: string;
}

/**
 * Resolves icon size from sizing.icon tokens or passes through custom values
 */
const resolveIconSize = (size: keyof typeof sizing.icon | string | number): string => {
  if (typeof size === 'number') return `${size}px`;
  if (size in sizing.icon) return sizing.icon[size as keyof typeof sizing.icon];
  return String(size);
};

/**
 * Styled container for the SVG icon
 */
const IconContainer = styled.span<{ size?: string | number, color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => resolveIconSize(props.size || 'md')};
  height: ${props => resolveIconSize(props.size || 'md')};
  color: ${props => props.color || colors.neutral.gray700};
  font-size: ${props => resolveIconSize(props.size || 'md')};
  line-height: 0;
`;

/**
 * Icon paths mapping
 * Maps icon names to their SVG path data
 */
const iconPaths: Record<string, { path: string, viewBox?: string }> = {
  // Health-related icons
  'heart': {
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    viewBox: '0 0 24 24'
  },
  'heart-outline': {
    path: 'M12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05zM16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z',
    viewBox: '0 0 24 24'
  },
  'pulse': {
    path: 'M20 11h-2.83l-1.59 1.59L14 11l-4 4-3-3-4 4v2h18v-7z',
    viewBox: '0 0 24 24'
  },
  'weight': {
    path: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16.5c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
    viewBox: '0 0 24 24'
  },
  'sleep': {
    path: 'M9.27 4.49C7.67 4.83 6.18 5.6 4.99 6.69c-1.8 1.89-2.91 4.31-2.91 7.1 0 5.23 4.58 9.85 9.81 9.85 1.03 0 2.05-.2 3.01-.59.91-.37.94-1.7.03-2.07-.92-.38-2.14-.29-3.04.09-2.1.87-4.5.5-6.2-1.13-2.14-2.04-2.71-5.02-1.75-7.65.8-2.16 2.48-3.82 4.69-4.46.77-.22 1.67-.36 2.09-1.06.42-.7-.16-1.81-1.45-1.28z',
    viewBox: '0 0 24 24'
  },
  'steps': {
    path: 'M13.5 5.5c1.09 0 2-.91 2-2 0-1.09-.91-2-2-2s-2 .91-2 2c0 1.09.91 2 2 2zM9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2 .61-3c1.28 1.31 2.16 2.88 2.16 5.5H17V8.74C15.9 6.42 13.64 4.5 11 4.5c-.34 0-.68.02-1.01.07C11.36 3.56 12.1 3 13 3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2c0 .43.14.84.37 1.18-.47.1-.91.28-1.31.52l2.47 2.47L11 9.7 9.5 7.82 5.95 4.27c-.78.78-1.42 1.45-1.42 3.7v1.51c-.1-.9-1.25-1.14-1.75-.18-.31.6-.31 1.31 0 1.91l.03.06L4.97 15.3c.02.77.58 1.45 1.35 1.52l1.03.11.55 2.45z',
    viewBox: '0 0 24 24'
  },
  'glucose': {
    path: 'M14.5 13.5h2v-3h2v-2h-2v-3h-2v3h-2v2h2v3zm-6 2c1.56 0 3-.6 4-1.5 1 .9 2.44 1.5 4 1.5s3-.6 4-1.5v3.38c-.94.48-1.94.76-3 .76-1.67 0-3.1-.7-4-1.84-.9 1.13-2.33 1.84-4 1.84-1.06 0-2.06-.29-3-.76V15.5c1 .9 2.44 1.5 4 1.5zm0-2c-1.73 0-3-1-3-2.75S6.77 8 8.5 8s3 1 3 2.75S10.23 13.5 8.5 13.5zm9 0c-1.73 0-3-1-3-2.75S15.77 8 17.5 8s3 1 3 2.75-1.27 2.75-3 2.75z',
    viewBox: '0 0 24 24'
  },
  
  // Care-related icons
  'calendar': {
    path: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z',
    viewBox: '0 0 24 24'
  },
  'doctor': {
    path: 'M10.5 13H8v-3h2.5V7.5h3V10H16v3h-2.5v2.5h-3V13zM12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z',
    viewBox: '0 0 24 24'
  },
  'pill': {
    path: 'M4.22 11.29l7.07-7.07c.78-.78 2.05-.78 2.83 0l4.24 4.24c.78.78.78 2.05 0 2.83l-7.07 7.07c-.78.78-2.05.78-2.83 0l-4.24-4.24c-.79-.78-.79-2.05 0-2.83zm7.07-5.66l-5.66 5.66 4.24 4.24 5.66-5.66-4.24-4.24z',
    viewBox: '0 0 24 24'
  },
  'video': {
    path: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
    viewBox: '0 0 24 24'
  },
  'clinic': {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    viewBox: '0 0 24 24'
  },
  
  // Plan-related icons
  'document': {
    path: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    viewBox: '0 0 24 24'
  },
  'card': {
    path: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
    viewBox: '0 0 24 24'
  },
  'money': {
    path: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    viewBox: '0 0 24 24'
  },
  'insurance': {
    path: 'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
    viewBox: '0 0 24 24'
  },
  'file-upload': {
    path: 'M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z',
    viewBox: '0 0 24 24'
  },
  
  // UI and navigation icons
  'home': {
    path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    viewBox: '0 0 24 24'
  },
  'settings': {
    path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    viewBox: '0 0 24 24'
  },
  'notifications': {
    path: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    viewBox: '0 0 24 24'
  },
  'profile': {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    viewBox: '0 0 24 24'
  },
  'menu': {
    path: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    viewBox: '0 0 24 24'
  },
  'close': {
    path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    viewBox: '0 0 24 24'
  },
  'arrow-back': {
    path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    viewBox: '0 0 24 24'
  },
  'arrow-forward': {
    path: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    viewBox: '0 0 24 24'
  },
  'check': {
    path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    viewBox: '0 0 24 24'
  },
  'add': {
    path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    viewBox: '0 0 24 24'
  },
  
  // Gamification icons
  'trophy': {
    path: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z',
    viewBox: '0 0 24 24'
  },
  'achievement': {
    path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2.5 13.5c-1.82 1.85-4.66 1.36-6.5-1.33-1.83 2.69-4.68 3.17-6.5 1.33-1.95-1.95-1.95-5.12 0-7.07 1.95-1.95 5.12-1.95 7.07 0 1.95-1.95 5.12-1.95 7.07 0 1.95 1.95 1.95 5.12 0 7.07z',
    viewBox: '0 0 24 24'
  },
  'star': {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    viewBox: '0 0 24 24'
  },
  'level-up': {
    path: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    viewBox: '0 0 24 24'
  },
  'reward': {
    path: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
    viewBox: '0 0 24 24'
  },
  
  // Status and feedback icons
  'success': {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    viewBox: '0 0 24 24'
  },
  'warning': {
    path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    viewBox: '0 0 24 24'
  },
  'error': {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    viewBox: '0 0 24 24'
  },
  'info': {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    viewBox: '0 0 24 24'
  }
};

/**
 * Icon component that renders an SVG icon based on the provided name.
 * Provides consistent styling and accessibility across the application.
 * 
 * @example
 * ```tsx
 * <Icon name="heart" size="24px" color={colors.journeys.health.primary} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md',
  color, 
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const icon = iconPaths[name];
  
  if (!icon) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }
  
  // Normalise to boolean for internal logic
  const ariaHiddenBool = ariaHidden !== false && ariaHidden !== 'false';

  // If the icon isn't hidden from screen readers, it needs an aria-label
  if (!ariaHiddenBool && !ariaLabel) {
    console.warn('Icon requires an aria-label when aria-hidden is false');
  }

  return (
    <IconContainer
      size={size}
      color={color}
      aria-hidden={ariaHiddenBool}
      data-testid="icon-container"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={icon.viewBox || '0 0 24 24'}
        width="100%"
        height="100%"
        fill="currentColor"
        role={ariaHiddenBool ? undefined : 'img'}
        aria-label={ariaHiddenBool ? undefined : ariaLabel}
      >
        <path d={icon.path} />
      </svg>
    </IconContainer>
  );
};