import React, { useCallback } from 'react';

import { AlertContainer, ContentArea, DismissButton, IconArea, Message, Title } from './Alert.styles';

/**
 * Props for the Alert component.
 */
export interface AlertProps {
    /** Type of alert determining color scheme and default icon */
    type: 'success' | 'error' | 'warning' | 'info';
    /** Optional title displayed in semiBold above the message */
    title?: string;
    /** The alert message content */
    message: string;
    /** Callback when the alert is dismissed */
    onDismiss?: () => void;
    /** Whether the alert shows a dismiss button */
    dismissible?: boolean;
    /** Custom icon override (text glyph or emoji) */
    icon?: string;
    /** Test identifier */
    testID?: string;
}

const defaultIcons: Record<AlertProps['type'], string> = {
    success: '\u2713', // check mark
    error: '\u2717', // ballot x
    warning: '\u26A0', // warning sign
    info: '\u2139', // information source
};

/**
 * Alert component for inline persistent notifications.
 * Unlike Toast, Alert is not auto-dismissing and stays visible in the layout.
 *
 * @example
 * ```tsx
 * <Alert
 *   type="success"
 *   title="Payment processed"
 *   message="Your payment has been successfully processed."
 *   dismissible
 *   onDismiss={() => setVisible(false)}
 * />
 * ```
 */
export const Alert: React.FC<AlertProps> = ({ type, title, message, onDismiss, dismissible = false, icon, testID }) => {
    const displayIcon = icon ?? defaultIcons[type];

    const handleDismiss = useCallback(() => {
        if (onDismiss) {
            onDismiss();
        }
    }, [onDismiss]);

    return (
        <AlertContainer $alertType={type} role="alert" data-testid={testID || 'alert'}>
            <IconArea $alertType={type} aria-hidden="true">
                {displayIcon}
            </IconArea>
            <ContentArea>
                {title && <Title>{title}</Title>}
                <Message>{message}</Message>
            </ContentArea>
            {dismissible && (
                <DismissButton
                    onClick={handleDismiss}
                    aria-label="Dismiss alert"
                    data-testid="alert-dismiss-button"
                    type="button"
                >
                    {'\u00D7'}
                </DismissButton>
            )}
        </AlertContainer>
    );
};
