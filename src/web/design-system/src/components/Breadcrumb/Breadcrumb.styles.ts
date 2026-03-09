import styled from 'styled-components';

import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const BreadcrumbContainer = styled.nav`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${spacing.xs};
`;

export const BreadcrumbLink = styled.a<{ isActive?: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${(props) => (props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isActive ? colors.neutral.gray900 : colors.brand.primary)};
    text-decoration: none;
    cursor: ${(props) => (props.isActive ? 'default' : 'pointer')};

    &:hover {
        text-decoration: ${(props) => (props.isActive ? 'none' : 'underline')};
    }
`;

export const Separator = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray500};
    user-select: none;
`;
