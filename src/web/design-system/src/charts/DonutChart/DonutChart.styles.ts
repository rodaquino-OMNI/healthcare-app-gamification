import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

export const ChartContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${spacing.md};
    background-color: ${colors.neutral.white};
    border-radius: ${borderRadius.md};
`;

export const ChartWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const CenterLabel = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: ${typography.fontFamily.body};
`;
