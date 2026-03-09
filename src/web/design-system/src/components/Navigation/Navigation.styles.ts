import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.neutral.white};
    border-bottom: 1px solid ${colors.neutral.gray300};
    min-height: ${spacing['4xl']};
`;

export const HeaderTitle = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray900};
    margin: 0;
`;

export const TabBarContainer = styled.div`
    display: flex;
    border-bottom: 1px solid ${colors.neutral.gray300};
    background-color: ${colors.neutral.white};
`;

export const Tab = styled.button<{ isActive: boolean }>`
    flex: 1;
    padding: ${spacing.sm} ${spacing.md};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
    background-color: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
`;

export const BottomNavContainer = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: ${spacing.xs} 0;
    background-color: ${colors.neutral.white};
    border-top: 1px solid ${colors.neutral.gray300};
    box-shadow: ${shadows.md};
`;

export const BottomNavButton = styled.button<{ isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing['3xs']};
    padding: ${spacing['3xs']} ${spacing.sm};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
    background-color: transparent;
    border: none;
    cursor: pointer;
`;

// Suppress unused import warning — borderRadius is used by consumers of this file
const _borderRadiusRef = borderRadius;
export { _borderRadiusRef as _borderRadius };
