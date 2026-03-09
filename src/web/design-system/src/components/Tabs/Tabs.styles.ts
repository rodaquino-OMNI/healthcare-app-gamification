import styled from 'styled-components';

interface TabsItemProps {
    selected?: boolean;
}

export const TabsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const TabsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid ${(props) => props.theme.colors.neutral.gray300};
`;

export const TabsItem = styled.li<TabsItemProps>`
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
    cursor: pointer;
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => (props.selected ? props.theme.colors.brand.primary : props.theme.colors.neutral.gray500)};
    border-bottom: ${(props) => (props.selected ? `2px solid ${props.theme.colors.brand.primary}` : 'none')};
    transition: all ${(props) => props.theme.animation.duration.fast} ease-in-out;

    &:hover {
        color: ${(props) => props.theme.colors.brand.primary};
    }
`;
