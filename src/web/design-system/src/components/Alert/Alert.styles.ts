import styled from 'styled-components';

import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

type AlertType = 'success' | 'error' | 'warning' | 'info';

const getBackgroundColor = (type: AlertType): string => {
    switch (type) {
        case 'success':
            return colors.semantic.successBg;
        case 'error':
            return colors.semantic.errorBg;
        case 'warning':
            return colors.semantic.warningBg;
        case 'info':
        default:
            return colors.semantic.infoBg;
    }
};

const getBorderColor = (type: AlertType): string => {
    switch (type) {
        case 'success':
            return colors.semantic.success;
        case 'error':
            return colors.semantic.error;
        case 'warning':
            return colors.semantic.warning;
        case 'info':
        default:
            return colors.semantic.info;
    }
};

export const AlertContainer = styled.div<{ $alertType: AlertType }>`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: ${spacing.md};
    background-color: ${(props) => getBackgroundColor(props.$alertType)};
    border-left: 4px solid ${(props) => getBorderColor(props.$alertType)};
    border-radius: 4px;
`;

export const IconArea = styled.span<{ $alertType: AlertType }>`
    flex-shrink: 0;
    margin-right: ${spacing.sm};
    font-size: ${typography.fontSize['text-lg']};
    color: ${(props) => getBorderColor(props.$alertType)};
    line-height: 1;
`;

export const ContentArea = styled.div`
    flex: 1;
    min-width: 0;
`;

export const Title = styled.span`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[70]};
    margin-bottom: ${spacing['3xs']};
`;

export const Message = styled.span`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.regular};
    color: ${colors.gray[60]};
    line-height: ${typography.lineHeight.base};
`;

export const DismissButton = styled.button`
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: ${spacing['3xs']};
    margin-left: ${spacing.xs};
    font-size: ${typography.fontSize['text-lg']};
    color: ${colors.gray[40]};
    line-height: 1;

    &:hover {
        color: ${colors.gray[60]};
    }
`;
