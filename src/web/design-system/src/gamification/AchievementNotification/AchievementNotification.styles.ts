import styled from 'styled-components'; // version 6.1.8

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const NotificationContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.neutral.white};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    text-align: center;
`;

export const NotificationContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const NotificationTitle = styled.h2`
    font-size: ${typography.fontSize.xl};
    font-weight: bold;
    margin-bottom: ${spacing.xs};
`;

export const NotificationMessage = styled.p`
    font-size: ${typography.fontSize.md};
    color: ${colors.neutral.gray600};
`;
