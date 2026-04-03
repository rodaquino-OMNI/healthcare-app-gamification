/**
 * Mock for styled-components in React Native context.
 *
 * styled-components is a web-only dependency pulled in transitively by
 * @austa/design-system's web barrel files. This mock neutralises it so
 * the bundle doesn't crash when it tries to access DOM APIs.
 */
const React = require('react');
const { View, Text: RNText } = require('react-native');

// HTML elements that contain text directly → must use RN Text
const TEXT_ELEMENTS = new Set([
    'p',
    'span',
    'label',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'em',
    'b',
    'i',
    'small',
    'sub',
    'sup',
]);
// HTML elements that are containers → use RN View
const CONTAINER_ELEMENTS = new Set([
    'div',
    'section',
    'article',
    'main',
    'header',
    'footer',
    'nav',
    'form',
    'ul',
    'ol',
    'li',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th',
    'figure',
    'figcaption',
    'aside',
]);

/** styled() returns a component that renders its children in a View or Text. */
function styled(Component) {
    return function styledFactory() {
        const StyledComponent = React.forwardRef(function StyledComp(props, ref) {
            const { children, ...rest } = props;
            // Text-bearing HTML elements → RN Text (allows string children)
            if (TEXT_ELEMENTS.has(Component)) {
                return React.createElement(RNText, { ref, ...rest }, children);
            }
            // Container HTML elements → RN View
            if (CONTAINER_ELEMENTS.has(Component)) {
                return React.createElement(View, { ref, ...rest }, children);
            }
            if (Component === 'input' || Component === 'textarea') {
                return React.createElement(View, { ref, ...rest });
            }
            if (Component === 'button') {
                return React.createElement(View, { ref, ...rest }, children);
            }
            if (typeof Component === 'string') {
                return React.createElement(View, { ref, ...rest }, children);
            }
            return React.createElement(Component, { ref, ...rest }, children);
        });
        StyledComponent.displayName = `Styled(${typeof Component === 'string' ? Component : Component?.displayName || 'Component'})`;
        StyledComponent.attrs = () => styledFactory;
        StyledComponent.withConfig = () => styledFactory;
        return StyledComponent;
    };
}

// HTML element helpers
const elements = [
    'div',
    'span',
    'button',
    'input',
    'textarea',
    'section',
    'article',
    'main',
    'header',
    'footer',
    'nav',
    'form',
    'label',
    'p',
    'a',
    'img',
    'ul',
    'ol',
    'li',
    'table',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'svg',
    'path',
    'circle',
    'rect',
    'line',
    'polyline',
    'polygon',
];
elements.forEach((el) => {
    styled[el] = styled(el);
});

// ThemeProvider & helpers
const ThemeProvider = ({ children }) => children;
const ThemeContext = React.createContext({});
const useTheme = () => ({});
const withTheme = (C) => C;
const ServerStyleSheet = class {
    collectStyles(c) {
        return c;
    }
    getStyleTags() {
        return '';
    }
    seal() {}
};
const StyleSheetManager = ({ children }) => children;
const createGlobalStyle = () => () => null;
const css = (...args) => args;
const keyframes = () => '';
const isStyledComponent = () => false;

module.exports = styled;
module.exports.default = styled;
module.exports.ThemeProvider = ThemeProvider;
module.exports.ThemeContext = ThemeContext;
module.exports.useTheme = useTheme;
module.exports.withTheme = withTheme;
module.exports.ServerStyleSheet = ServerStyleSheet;
module.exports.StyleSheetManager = StyleSheetManager;
module.exports.createGlobalStyle = createGlobalStyle;
module.exports.css = css;
module.exports.keyframes = keyframes;
module.exports.isStyledComponent = isStyledComponent;
