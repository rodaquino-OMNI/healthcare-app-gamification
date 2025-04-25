/**
 * @file Icon component exports for the AUSTA SuperApp design system.
 * 
 * This file exports the Icon component and its associated type definition,
 * making them accessible for use in other modules throughout the application.
 * 
 * The Icon component provides a consistent way to render SVG icons
 * with proper styling and accessibility support across all three journeys
 * (Health, Care, and Plan).
 * 
 * @example
 * ```tsx
 * import { Icon } from '@austa/design-system';
 * 
 * // Use in a component
 * <Icon 
 *   name="heart" 
 *   size="24px"
 *   color={colors.journeys.health.primary}
 *   aria-hidden={false}
 *   aria-label="Health metric"
 * />
 * ```
 */

import { Icon, IconProps } from './Icon';

export { Icon, IconProps };