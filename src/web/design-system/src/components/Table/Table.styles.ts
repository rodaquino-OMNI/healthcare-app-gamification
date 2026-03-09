import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    border: 1px solid ${colors.neutral.gray300};
    border-radius: ${borderRadius.md};
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: ${typography.fontFamily.body};
`;

export const TableHead = styled.thead`
    background-color: ${colors.neutral.gray100};
`;

export const TableHeaderCell = styled.th<{ sortable?: boolean }>`
    padding: ${spacing.sm} ${spacing.md};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray600};
    text-align: left;
    text-transform: uppercase;
    letter-spacing: ${typography.letterSpacing.wide};
    border-bottom: 1px solid ${colors.neutral.gray300};
    cursor: ${(props) => (props.sortable ? 'pointer' : 'default')};
`;

export const TableRow = styled.tr<{ striped?: boolean; index?: number }>`
    background-color: ${(props) =>
        props.striped && props.index !== undefined && props.index % 2 === 1
            ? colors.neutral.gray100
            : colors.neutral.white};
    border-bottom: 1px solid ${colors.neutral.gray300};
`;

export const TableCell = styled.td`
    padding: ${spacing.sm} ${spacing.md};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray900};
`;
