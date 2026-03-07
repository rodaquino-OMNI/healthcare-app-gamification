import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

export const StepperContainer = styled.div<{ orientation: string }>`
    display: flex;
    flex-direction: ${(props) => (props.orientation === 'vertical' ? 'column' : 'row')};
    align-items: ${(props) => (props.orientation === 'vertical' ? 'flex-start' : 'center')};
    gap: ${spacing.xs};
`;

export const StepCircle = styled.button<{ status: string }>`
    width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    border-radius: ${borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.semiBold};
    border: 2px solid ${colors.neutral.gray300};
    background-color: ${colors.neutral.white};
    cursor: pointer;
    padding: 0;
`;

export const StepLabel = styled.span<{ isActive: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${(props) => (props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isActive ? colors.neutral.gray900 : colors.neutral.gray600)};
`;

export const StepConnector = styled.div<{ completed: boolean; orientation: string }>`
    background-color: ${(props) => (props.completed ? colors.brand.primary : colors.neutral.gray300)};
    ${(props) => (props.orientation === 'vertical' ? `width: 2px; height: ${spacing.xl};` : `height: 2px; flex: 1;`)}
`;
