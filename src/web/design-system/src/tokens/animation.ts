/**
 * Animation design tokens for the AUSTA SuperApp
 * Provides consistent animation timing and easing functions across the application
 * Used in transitions, micro-interactions, and gamification elements
 *
 * @version 1.0.0
 */

/**
 * Duration tokens for animations
 * - fast: Quick micro-interactions and feedback animations (150ms)
 * - normal: Standard transitions between states (300ms)
 * - slow: Emphasis animations and celebrations (500ms)
 */
const duration = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
};

/**
 * Easing function tokens for animations
 * - easeIn: Acceleration from zero velocity
 * - easeOut: Deceleration to zero velocity
 * - easeInOut: Acceleration until halfway, then deceleration
 */
const easing = {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Animation tokens for consistent animation behavior throughout the application
 * Used in journey transitions, feedback animations, and gamification elements
 */
export const animation = {
    duration,
    easing,
};

export default animation;
