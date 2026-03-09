// LD1: Exports the Badge component and its props interface.
import { Badge, type BadgeProps } from './Badge';

// IE3: Exports the BadgeProps interface with members exposed:
// size, unlocked, journey, children, onPress, accessibilityLabel, testID
export type { BadgeProps };

// IE3: Exports the Badge component
export default Badge;
