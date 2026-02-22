import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  onItemPress?: (item: BreadcrumbItem, index: number) => void;
  accessibilityLabel?: string;
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.xs};
`;

const BreadcrumbLink = styled.a<{ isActive?: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  font-weight: ${props => props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular};
  color: ${props => props.isActive ? colors.neutral.gray900 : colors.brand.primary};
  text-decoration: none;
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  line-height: ${typography.lineHeight.base};

  &:hover {
    text-decoration: ${props => props.isActive ? 'none' : 'underline'};
  }
`;

const Separator = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray500};
  user-select: none;
`;

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  onItemPress,
  accessibilityLabel = 'Breadcrumb navigation',
}) => {
  return (
    <BreadcrumbContainer aria-label={accessibilityLabel} data-testid="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbLink
              href={!isLast ? item.href : undefined}
              isActive={isLast}
              onClick={(e: React.MouseEvent) => {
                if (!isLast && onItemPress) {
                  e.preventDefault();
                  onItemPress(item, index);
                }
              }}
              aria-current={isLast ? 'page' : undefined}
              data-testid={`breadcrumb-item-${index}`}
            >
              {item.label}
            </BreadcrumbLink>
            {!isLast && <Separator aria-hidden="true" data-testid="breadcrumb-separator">{separator}</Separator>}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};
