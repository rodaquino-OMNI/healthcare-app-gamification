/**
 * Universal mock for design-system components and gamification modules.
 * Uses a Proxy so that any named import resolves to a simple div stub.
 * This avoids react-native / styled-components runtime issues in jsdom.
 */
const React = require('react');

const componentCache = {};

const mock = (name) => {
  if (!componentCache[name]) {
    const C = React.forwardRef(({ children, ...props }, ref) => {
      // Filter out non-DOM props to avoid React warnings
      const domProps = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'function' || k.startsWith('on')) {
          domProps[k] = v;
        }
      }
      return React.createElement('div', { ref, 'data-testid': `ds-${name.toLowerCase()}`, ...domProps }, children);
    });
    C.displayName = name;
    // Support compound components (e.g. Tabs.TabList, Tabs.Tab, Tabs.Panel)
    // Any property access on the component returns another mock component
    componentCache[name] = new Proxy(C, {
      get(target, prop) {
        // Pass through standard React/function properties
        if (prop in target || typeof prop === 'symbol') return target[prop];
        if (prop === 'displayName' || prop === '$$typeof' || prop === 'render') return target[prop];
        // For any other string property, return a sub-mock component
        if (typeof prop === 'string') return mock(`${name}.${prop}`);
        return undefined;
      },
    });
  }
  return componentCache[name];
};

// Return a Proxy so any named import works:
//   import { Button } from 'design-system/components/Button/Button'
//   import { Leaderboard } from 'design-system/gamification/Leaderboard'
//   import { AchievementBadge } from 'design-system/gamification/AchievementBadge'
module.exports = new Proxy({}, {
  get(target, prop) {
    if (prop === '__esModule') return true;
    if (prop === 'default') return mock('Default');
    if (typeof prop === 'string') return mock(prop);
    return undefined;
  },
});
