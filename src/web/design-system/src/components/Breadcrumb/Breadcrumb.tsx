import React from 'react';
import styled from 'styled-components';

import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/** Divider style presets for the breadcrumb separator. */
export type BreadcrumbDividerType = 'colon' | 'icon' | 'slash';

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: string;
    /** Preset divider style. Ignored when an explicit `separator` is provided. @default 'slash' */
    dividerType?: BreadcrumbDividerType;
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
    font-weight: ${(props) => (props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isActive ? colors.neutral.gray900 : colors.brand.primary)};
    text-decoration: none;
    cursor: ${(props) => (props.isActive ? 'default' : 'pointer')};
    line-height: ${typography.lineHeight.base};

    &:hover {
        text-decoration: ${(props) => (props.isActive ? 'none' : 'underline')};
    }
`;

const Separator = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray500};
    user-select: none;
`;

/**
 * Resolve the separator character from dividerType and explicit separator props.
 * An explicit `separator` that differs from the default '/' always wins.
 */
const resolveSeparator = (dividerType: BreadcrumbDividerType, separator: string | undefined): string => {
    // If caller explicitly provided a non-default separator, honour it
    if (separator !== undefined && separator !== '/') {
        return separator;
    }
    switch (dividerType) {
        case 'colon':
            return ':';
        case 'icon':
            return '\u203A'; // single right-pointing angle quotation mark (›)
        case 'slash':
        default:
            return '/';
    }
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    separator,
    dividerType = 'slash',
    onItemPress,
    accessibilityLabel = 'Breadcrumb navigation',
}) => {
    const resolvedSeparator = resolveSeparator(dividerType, separator);
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
                        {!isLast && (
                            <Separator aria-hidden="true" data-testid="breadcrumb-separator">
                                {resolvedSeparator}
                            </Separator>
                        )}
                    </React.Fragment>
                );
            })}
        </BreadcrumbContainer>
    );
};
