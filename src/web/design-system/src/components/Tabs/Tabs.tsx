import React, { useState, createContext, useContext, useCallback } from 'react';
import styled from 'styled-components';

import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

// Orientation and tab style types
export type TabOrientation = 'horizontal' | 'vertical';
export type TabStyleVariant = 'bottomBorder' | 'default' | 'leftBorder';

// Context to manage the tab state across components
interface TabsContextType {
    activeTab: number;
    setActiveTab: (index: number) => void;
    journey: string;
    disabled: boolean;
    orientation: TabOrientation;
    tabStyle: TabStyleVariant;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Hook to use the tabs context
const useTabsContext = (): TabsContextType => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
};

// Props for the Tabs component
export interface TabsProps {
    /**
     * The visual style variant for the tabs
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'tertiary';

    /**
     * The size of the tabs
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Whether the tabs are disabled
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the tabs are in a loading state
     * @default false
     */
    loading?: boolean;

    /**
     * Icon to display alongside tab labels
     */
    icon?: string;

    /**
     * Function called when a tab is selected
     */
    onPress?: (index: number) => void;

    /**
     * Accessibility label for screen readers
     */
    accessibilityLabel?: string;

    /**
     * Children elements of the tabs (TabList and TabPanel components)
     */
    children: React.ReactNode;

    /**
     * Journey identifier for journey-specific theming
     * @default 'health'
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Default selected tab index
     * @default 0
     */
    defaultTab?: number;

    /**
     * Whether the tab list should be horizontally scrollable
     * @default false
     */
    scrollable?: boolean;

    /**
     * The orientation of the tab list
     * @default 'horizontal'
     */
    orientation?: TabOrientation;

    /**
     * The style of the active tab indicator
     * @default 'bottomBorder'
     */
    tabStyle?: TabStyleVariant;
}

// Props for the TabList component
interface TabListProps {
    /**
     * The tab items to display
     */
    children: React.ReactNode;
}

// Props for individual Tab components
interface TabProps {
    /**
     * Label of the tab
     */
    label: string;

    /**
     * Icon to display with tab label
     */
    icon?: string;

    /**
     * Whether this tab is disabled
     */
    disabled?: boolean;

    /**
     * Accessibility label for this tab
     */
    accessibilityLabel?: string;
}

// Props for TabPanel component
interface TabPanelProps {
    /**
     * Content to display when this panel is active
     */
    children: React.ReactNode;

    /**
     * Index of the tab this panel is associated with
     */
    index: number;
}

// Styled component for the tabs container
const StyledTabsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

// Styled component for the tab list
const StyledTabList = styled.div<{ $orientation: TabOrientation }>`
    display: flex;
    flex-direction: ${(props) => (props.$orientation === 'vertical' ? 'column' : 'row')};
    ${(props) =>
        props.$orientation === 'vertical'
            ? `border-right: 1px solid ${colors.neutral.gray300};`
            : `border-bottom: 1px solid ${colors.neutral.gray300};`}
    ${(props) =>
        props.$orientation === 'horizontal'
            ? `overflow-x: auto;
    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;`
            : ''}
`;

// Helper to compute active border styles based on tabStyle
const getActiveBorder = (active: boolean, tabStyleVariant: TabStyleVariant, journeyColor: string): string => {
    if (!active) {
        switch (tabStyleVariant) {
            case 'leftBorder':
                return 'border-left: 2px solid transparent;';
            case 'default':
                return '';
            case 'bottomBorder':
            default:
                return 'border-bottom: 2px solid transparent;';
        }
    }
    switch (tabStyleVariant) {
        case 'leftBorder':
            return `border-left: 2px solid ${journeyColor};`;
        case 'default':
            return '';
        case 'bottomBorder':
        default:
            return `border-bottom: 2px solid ${journeyColor};`;
    }
};

// Styled component for individual tabs
const StyledTab = styled.button<{
    active: boolean;
    journey: string;
    variant: string;
    size: string;
    disabled: boolean;
    $tabStyleVariant: TabStyleVariant;
}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: ${(props) => {
        switch (props.size) {
            case 'sm':
                return spacing.sm;
            case 'lg':
                return spacing.lg;
            default:
                return spacing.md;
        }
    }};
    border: none;
    ${(props) =>
        getActiveBorder(
            props.active,
            props.$tabStyleVariant,
            colors.journeys[props.journey as keyof typeof colors.journeys].primary
        )}
    background-color: transparent;
    color: ${(props) =>
        props.active ? colors.journeys[props.journey as keyof typeof colors.journeys].primary : colors.neutral.gray700};
    font-weight: ${(props) => (props.active ? typography.fontWeight.medium : typography.fontWeight.regular)};
    font-size: ${(props) => {
        switch (props.size) {
            case 'sm':
                return typography.fontSize.sm;
            case 'lg':
                return typography.fontSize.lg;
            default:
                return typography.fontSize.md;
        }
    }};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    white-space: nowrap;
    transition: all 0.2s ease-in-out;

    &:hover {
        color: ${(props) => !props.disabled && colors.journeys[props.journey as keyof typeof colors.journeys].primary};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => colors.journeys[props.journey as keyof typeof colors.journeys].secondary};
    }
`;

// Styled component for tab panels
const StyledTabPanel = styled.div<{
    active: boolean;
}>`
    display: ${(props) => (props.active ? 'block' : 'none')};
    padding: ${spacing.md};
`;

// Main Tabs component
export const Tabs: React.FC<TabsProps> & {
    TabList: React.FC<TabListProps>;
    Tab: React.FC<TabProps>;
    Panel: React.FC<TabPanelProps>;
} = ({
    variant: _variant = 'primary',
    size: _size = 'md',
    disabled = false,
    loading = false,
    icon: _icon,
    onPress,
    accessibilityLabel,
    children,
    journey = 'health',
    defaultTab = 0,
    orientation = 'horizontal',
    tabStyle = 'bottomBorder',
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabChange = useCallback(
        (index: number) => {
            if (!disabled) {
                setActiveTab(index);
                if (onPress) {
                    onPress(index);
                }
            }
        },
        [disabled, onPress]
    );

    return (
        <TabsContext.Provider
            value={{
                activeTab,
                setActiveTab: handleTabChange,
                journey,
                disabled: disabled || loading,
                orientation,
                tabStyle,
            }}
        >
            <StyledTabsContainer
                role="tablist"
                aria-label={accessibilityLabel || 'Tabs'}
                journey={journey}
                data-testid="tabs-container"
            >
                {loading ? (
                    <Box padding={spacing.md} display="flex" justifyContent="center">
                        <Text>Loading...</Text>
                    </Box>
                ) : (
                    children
                )}
            </StyledTabsContainer>
        </TabsContext.Provider>
    );
};

// TabList component to contain the tab buttons
const TabList: React.FC<TabListProps> = ({ children }) => {
    const { orientation } = useTabsContext();
    return (
        <StyledTabList role="tablist" $orientation={orientation} data-testid="tab-list">
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement<Record<string, unknown>>(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        index,
                    });
                }
                return child;
            })}
        </StyledTabList>
    );
};

// Individual Tab component
const Tab: React.FC<TabProps & { index?: number }> = ({ label, icon, disabled = false, accessibilityLabel, index }) => {
    const { activeTab, setActiveTab, journey, disabled: tabsDisabled, tabStyle } = useTabsContext();
    const isActive = index === activeTab;
    const isDisabled = disabled || tabsDisabled;

    const handleClick = (): void => {
        if (!isDisabled && index !== undefined) {
            setActiveTab(index);
        }
    };

    return (
        <StyledTab
            active={isActive}
            journey={journey}
            variant="primary"
            size="md"
            disabled={isDisabled}
            $tabStyleVariant={tabStyle}
            onClick={handleClick}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            aria-label={accessibilityLabel || label}
            id={`tab-${index}`}
            aria-controls={`panel-${index}`}
            tabIndex={isActive ? 0 : -1}
            data-testid={`tab-${index}`}
        >
            {icon && (
                <span style={{ marginRight: '4px' }} aria-hidden={true}>
                    {icon}
                </span>
            )}
            {label}
        </StyledTab>
    );
};

// TabPanel component for tab content
const Panel: React.FC<TabPanelProps> = ({ children, index }) => {
    const { activeTab, journey: _panelJourney } = useTabsContext();
    const isActive = index === activeTab;

    return (
        <StyledTabPanel
            role="tabpanel"
            id={`panel-${index}`}
            aria-labelledby={`tab-${index}`}
            active={isActive}
            hidden={!isActive}
            tabIndex={0}
            data-testid={`panel-${index}`}
        >
            {children}
        </StyledTabPanel>
    );
};

// Attach sub-components to Tabs
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.Panel = Panel;
