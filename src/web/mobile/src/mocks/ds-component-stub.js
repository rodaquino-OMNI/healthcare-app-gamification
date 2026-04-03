/**
 * DEMO_MODE — Stub for DS components that don't have .native.tsx variants yet.
 *
 * When a mobile screen imports a DS component via @design-system/* path alias
 * and no .native.tsx variant exists, Metro resolves to this stub instead of
 * the web .tsx version (which uses styled-components and crashes RN).
 *
 * The stub renders children in a View — non-destructive at runtime.
 * Named exports are Proxy-based so any destructured import resolves to the stub.
 */
const React = require('react');
const { View } = require('react-native');

const StubComponent = React.forwardRef(function DSStub(props, ref) {
    const { children, ...rest } = props;
    return React.createElement(View, { ref, ...rest }, children);
});
StubComponent.displayName = 'DSComponentStub';

// Proxy-based module: any named import returns the stub component
const handler = {
    get(target, prop) {
        if (prop === '__esModule') return true;
        if (prop === 'default') return StubComponent;
        if (typeof prop === 'string' && prop[0] === prop[0].toUpperCase()) {
            return StubComponent;
        }
        return target[prop];
    },
};

module.exports = new Proxy({ default: StubComponent }, handler);
