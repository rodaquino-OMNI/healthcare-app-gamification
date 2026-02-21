import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  width: 100%;
`;

export const SliderTrack = styled.div`
  position: relative;
  width: 100%;
  height: ${spacing['3xs']};
  background-color: ${colors.neutral.gray300};
  border-radius: ${borderRadius.full};
`;

export const SliderFill = styled.div<{ percentage: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.full};
`;

export const SliderThumb = styled.div<{ percentage: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.percentage}%;
  transform: translate(-50%, -50%);
  width: ${spacing.lg};
  height: ${spacing.lg};
  background-color: ${colors.brand.primary};
  border: 2px solid ${colors.neutral.white};
  border-radius: ${borderRadius.full};
  box-shadow: ${shadows.sm};
`;

export const ValueLabel = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray700};
  text-align: center;
`;
