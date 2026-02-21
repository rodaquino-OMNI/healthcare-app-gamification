import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, React.ReactNode>[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: ${borderRadius.md};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${typography.fontFamily.body};
`;

const TableHead = styled.thead`
  background-color: ${colors.neutral.gray100};
`;

const TableHeaderCell = styled.th<{ sortable?: boolean; compact?: boolean; width?: string }>`
  padding: ${props => props.compact ? spacing.xs : spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray600};
  text-align: left;
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  border-bottom: 1px solid ${colors.neutral.gray300};
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: ${props => props.sortable ? 'none' : 'auto'};
  white-space: nowrap;
  ${props => props.width ? `width: ${props.width};` : ''}

  &:hover {
    ${props => props.sortable ? `color: ${colors.neutral.gray900};` : ''}
  }
`;

const SortIndicator = styled.span<{ active: boolean; direction: string }>`
  margin-left: ${spacing['3xs']};
  font-size: ${typography.fontSize.xs};
  color: ${props => props.active ? colors.brand.primary : colors.neutral.gray500};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ striped?: boolean; hoverable?: boolean; index?: number }>`
  background-color: ${props => props.striped && props.index !== undefined && props.index % 2 === 1
    ? colors.neutral.gray100
    : colors.neutral.white};
  border-bottom: 1px solid ${colors.neutral.gray300};

  ${props => props.hoverable && `
    &:hover {
      background-color: ${colors.neutral.gray100};
    }
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td<{ compact?: boolean }>`
  padding: ${props => props.compact ? spacing.xs : spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray900};
  line-height: ${typography.lineHeight.base};
`;

const EmptyState = styled.td`
  padding: ${spacing['2xl']} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray500};
  text-align: center;
`;

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  striped = false,
  hoverable = true,
  compact = false,
  accessibilityLabel = 'Data table',
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !onSort) return;
    const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(column.key);
    setSortDirection(newDirection);
    onSort(column.key, newDirection);
  };

  return (
    <TableContainer data-testid="table-container">
      <StyledTable role="table" aria-label={accessibilityLabel} data-testid="table">
        <TableHead>
          <tr>
            {columns.map(column => (
              <TableHeaderCell
                key={column.key}
                sortable={column.sortable}
                compact={compact}
                width={column.width}
                onClick={() => handleSort(column)}
                aria-sort={sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                data-testid={`table-header-${column.key}`}
              >
                {column.header}
                {column.sortable && (
                  <SortIndicator
                    active={sortKey === column.key}
                    direction={sortKey === column.key ? sortDirection : 'asc'}
                    data-testid={`table-sort-${column.key}`}
                  >
                    {sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </SortIndicator>
                )}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <tr>
              <EmptyState colSpan={columns.length} data-testid="table-empty">
                No data available
              </EmptyState>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                striped={striped}
                hoverable={hoverable}
                index={rowIndex}
                data-testid={`table-row-${rowIndex}`}
              >
                {columns.map(column => (
                  <TableCell key={column.key} compact={compact} data-testid={`table-cell-${rowIndex}-${column.key}`}>
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};
