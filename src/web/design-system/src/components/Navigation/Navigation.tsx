import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { borderRadius } from '../../tokens/borderRadius';

// ======= Header =======
export interface HeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  journey?: 'health' | 'care' | 'plan';
  accessibilityLabel?: string;
}

const getJourneyColor = (journey?: string) => {
  if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
    return colors.journeys[journey as keyof typeof colors.journeys].primary;
  }
  return colors.brand.primary;
};

const HeaderContainer = styled.header<{ journey?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.neutral.white};
  border-bottom: 1px solid ${colors.neutral.gray300};
  min-height: ${spacing['4xl']};
`;

const HeaderTitle = styled.h1`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  margin: 0;
  flex: 1;
  text-align: center;
`;

const HeaderAction = styled.div`
  min-width: ${spacing['2xl']};
  display: flex;
  align-items: center;
`;

export const Header: React.FC<HeaderProps> = ({
  title,
  leftAction,
  rightAction,
  journey,
  accessibilityLabel,
}) => (
  <HeaderContainer journey={journey} role="banner" aria-label={accessibilityLabel || title} data-testid="nav-header">
    <HeaderAction data-testid="nav-header-left">{leftAction}</HeaderAction>
    <HeaderTitle data-testid="nav-header-title">{title}</HeaderTitle>
    <HeaderAction data-testid="nav-header-right">{rightAction}</HeaderAction>
  </HeaderContainer>
);

// ======= TabBar =======
export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  journey?: 'health' | 'care' | 'plan';
  accessibilityLabel?: string;
}

const TabBarContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.neutral.gray300};
  background-color: ${colors.neutral.white};
`;

const Tab = styled.button<{ isActive: boolean; journey?: string; disabled?: boolean }>`
  flex: 1;
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  font-weight: ${props => props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular};
  color: ${props => {
    if (props.disabled) return colors.neutral.gray500;
    return props.isActive ? getJourneyColor(props.journey) : colors.neutral.gray600;
  }};
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.isActive ? getJourneyColor(props.journey) : 'transparent'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    color: ${props => getJourneyColor(props.journey)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 -2px 0 ${props => getJourneyColor(props.journey)};
  }
`;

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  journey,
  accessibilityLabel = 'Tab navigation',
}) => (
  <TabBarContainer role="tablist" aria-label={accessibilityLabel} data-testid="tab-bar">
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        isActive={tab.value === activeTab}
        journey={journey}
        disabled={tab.disabled}
        onClick={() => !tab.disabled && onTabChange(tab.value)}
        role="tab"
        aria-selected={tab.value === activeTab}
        aria-disabled={tab.disabled}
        data-testid={`tab-${tab.value}`}
      >
        {tab.label}
      </Tab>
    ))}
  </TabBarContainer>
);

// ======= BottomNav =======
export interface BottomNavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeItem: string;
  onItemPress: (value: string) => void;
  journey?: 'health' | 'care' | 'plan';
  accessibilityLabel?: string;
}

const BottomNavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${spacing.xs} 0;
  background-color: ${colors.neutral.white};
  border-top: 1px solid ${colors.neutral.gray300};
  box-shadow: ${shadows.md};
`;

const BottomNavButton = styled.button<{ isActive: boolean; journey?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing['3xs']};
  padding: ${spacing['3xs']} ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.xs};
  font-weight: ${props => props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular};
  color: ${props => props.isActive ? getJourneyColor(props.journey) : colors.neutral.gray500};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:focus-visible {
    outline: none;
    border-radius: ${borderRadius.sm};
    box-shadow: 0 0 0 2px ${props => getJourneyColor(props.journey)}40;
  }
`;

const IconWrapper = styled.div`
  font-size: ${typography.fontSize.xl};
  line-height: 1;
`;

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeItem,
  onItemPress,
  journey,
  accessibilityLabel = 'Bottom navigation',
}) => (
  <BottomNavContainer aria-label={accessibilityLabel} data-testid="bottom-nav">
    {items.map((item) => (
      <BottomNavButton
        key={item.value}
        isActive={item.value === activeItem}
        journey={journey}
        onClick={() => onItemPress(item.value)}
        aria-current={item.value === activeItem ? 'page' : undefined}
        data-testid={`bottom-nav-${item.value}`}
      >
        {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
        {item.label}
      </BottomNavButton>
    ))}
  </BottomNavContainer>
);
