/**
 * DEMO_MODE — React Native-compatible mock for @austa/design-system
 *
 * The real design-system uses styled-components with web-only APIs
 * (styled.span, styled.div, <svg>) that crash in React Native.
 * This mock provides RN-compatible equivalents for the 7 components
 * used by the mobile app: Button, Card, FormContainer, FormField, Icon, Input, Text
 */
const React = require('react');
const { View, Text: RNText, TextInput, TouchableOpacity, StyleSheet } = require('react-native');

// --- Text ---
const Text = React.forwardRef(function Text(props, ref) {
    const { children, fontSize, fontWeight, textAlign, color, style, ...rest } = props;
    const sizeMap = { xs: 10, sm: 12, md: 14, lg: 18, xl: 22, '2xl': 28 };
    const weightMap = { normal: '400', medium: '500', semibold: '600', bold: '700' };
    return React.createElement(
        RNText,
        {
            ref,
            style: [
                {
                    fontSize: sizeMap[fontSize] || (typeof fontSize === 'number' ? fontSize : 14),
                    fontWeight: weightMap[fontWeight] || fontWeight || '400',
                    textAlign: textAlign || 'left',
                    color: color || '#1A1A2E',
                },
                style,
            ],
            ...rest,
        },
        children
    );
});

// --- Button ---
function Button(props) {
    const { children, onPress, variant, journey, accessibilityLabel, disabled, style, ...rest } = props;
    return React.createElement(
        TouchableOpacity,
        {
            onPress,
            disabled,
            accessibilityLabel,
            style: [styles.button, variant === 'outline' && styles.buttonOutline, style],
            ...rest,
        },
        React.createElement(
            RNText,
            { style: [styles.buttonText, variant === 'outline' && styles.buttonTextOutline] },
            children
        )
    );
}

// --- Card ---
function Card(props) {
    const { children, style, ...rest } = props;
    return React.createElement(View, { style: [styles.card, style], ...rest }, children);
}

// --- Icon ---
function Icon(props) {
    const { name, size, color } = props;
    const iconMap = {
        'alert-circle': '\u26A0\uFE0F',
        heart: '\u2764\uFE0F',
        calendar: '\uD83D\uDCC5',
        check: '\u2705',
        close: '\u274C',
        search: '\uD83D\uDD0D',
        settings: '\u2699\uFE0F',
        user: '\uD83D\uDC64',
        home: '\uD83C\uDFE0',
        star: '\u2B50',
        info: '\u2139\uFE0F',
        'arrow-left': '\u2B05\uFE0F',
        'arrow-right': '\u27A1\uFE0F',
        'chevron-right': '\u203A',
        'chevron-left': '\u2039',
        plus: '\u2795',
        minus: '\u2796',
        edit: '\u270F\uFE0F',
        trash: '\uD83D\uDDD1\uFE0F',
        camera: '\uD83D\uDCF7',
        location: '\uD83D\uDCCD',
        phone: '\uD83D\uDCDE',
        mail: '\uD83D\uDCE7',
        clock: '\uD83D\uDD52',
        bell: '\uD83D\uDD14',
    };
    return React.createElement(
        RNText,
        {
            style: { fontSize: size || 24, color: color || '#666' },
            accessibilityRole: 'image',
        },
        iconMap[name] || '\u2B55'
    );
}

// --- Input ---
function Input(props) {
    const { label, value, onChangeText, placeholder, style, error, ...rest } = props;
    return React.createElement(
        View,
        { style: styles.inputContainer },
        label && React.createElement(RNText, { style: styles.inputLabel }, label),
        React.createElement(TextInput, {
            value,
            onChangeText,
            placeholder,
            style: [styles.input, error && styles.inputError, style],
            ...rest,
        }),
        error && React.createElement(RNText, { style: styles.inputErrorText }, error)
    );
}

// --- FormContainer ---
function FormContainer(props) {
    const { children, style, ...rest } = props;
    return React.createElement(View, { style: [styles.formContainer, style], ...rest }, children);
}

// --- FormField ---
function FormField(props) {
    const { children, label, error, style, ...rest } = props;
    return React.createElement(
        View,
        { style: [styles.formField, style], ...rest },
        label && React.createElement(RNText, { style: styles.formFieldLabel }, label),
        children,
        error && React.createElement(RNText, { style: styles.formFieldError }, error)
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0066CC',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0066CC',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextOutline: {
        color: '#0066CC',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#E53E3E',
    },
    inputErrorText: {
        color: '#E53E3E',
        fontSize: 12,
        marginTop: 4,
    },
    formContainer: {
        padding: 16,
    },
    formField: {
        marginBottom: 16,
    },
    formFieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    formFieldError: {
        color: '#E53E3E',
        fontSize: 12,
        marginTop: 4,
    },
});

module.exports = {
    Text,
    Button,
    Card,
    Icon,
    Input,
    FormContainer,
    FormField,
};
