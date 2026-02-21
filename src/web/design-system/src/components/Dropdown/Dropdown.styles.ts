import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { borderRadius } from '../../tokens/borderRadius';

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownTrigger = styled.button<{ isOpen: boolean; journey?: string }>`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.md};
  color: ${colors.neutral.gray900};
  background-color: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray300};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + ${spacing['3xs']});
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background-color: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray300};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  list-style: none;
  padding: ${spacing['3xs']} 0;
  margin: 0;
  z-index: 50;
`;

export const DropdownItem = styled.li<{ isSelected: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.md};
  color: ${colors.neutral.gray900};
  cursor: pointer;

  &:hover {
    background-color: ${colors.neutral.gray100};
  }
`;
