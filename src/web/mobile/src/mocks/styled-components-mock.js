/**
 * Mock for styled-components in React Native context.
 *
 * styled-components is a web-only dependency pulled in transitively by
 * @austa/design-system's web barrel files. This mock neutralises it so
 * the bundle doesn't crash when it tries to access DOM APIs.
 */
const React = require('react');
const { View, Text: RNText } = require('react-native');

/** styled() returns a component that renders its children in a View. */
function styled(Component) {
    return function styledFactory() {
        const StyledComponent = React.forwardRef(function StyledComp(props, ref) {
            const { children, ...rest } = props;
            if (
                Component === 'div' ||
                Component === 'span' ||
                Component === 'section' ||
                Component === 'article' ||
                Component === 'main' ||
                Component === 'header' ||
                Component === 'footer' ||
                Component === 'nav' ||
                Component === 'form' ||
                Component === 'label' ||
                Component === 'p' ||
                Component === 'h1' ||
                Component === 'h2' ||
                Component === 'h3' ||
                Component === 'h4' ||
                Component === 'h5' ||
                Component === 'h6'
            ) {
                return React.createElement(View, { ref, ...rest }, children);
            }
            if (Component === 'input' || Component === 'textarea') {
                return React.createElement(View, { ref, ...rest });
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
