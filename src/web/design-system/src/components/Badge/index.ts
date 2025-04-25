// LD1: Exports the Badge component for use in other components.
import { Badge } from './Badge';
// LD1: Exports the props interface for the Badge component.
import type { BadgeProps } from './Badge';

// IE3: Exports the BadgeProps interface with members exposed: size, unlocked, journey, children, onPress, accessibilityLabel, testID
export type { BadgeProps };
// IE3: Exports the Badge component with members exposed: size, unlocked, journey, children, onPress, accessibilityLabel, testID
export default Badge;