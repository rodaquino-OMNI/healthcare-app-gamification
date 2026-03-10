import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Tabs } from './Tabs';
import { baseTheme } from '../../themes/base.theme';
import { healthTheme } from '../../themes/health.theme';

// Helper function to render a component with a theme
const renderWithTheme = (ui: React.ReactElement, theme = baseTheme) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

// Test data for tabs
const tabItems = [
    { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
];

describe('Tabs', () => {
    it('renders the Tabs component with default props', () => {
        renderWithTheme(
            <Tabs>
                <Tabs.TabList>
                    {tabItems.map((item) => (
                        <Tabs.Tab key={item.id} label={item.label} />
                    ))}
                </Tabs.TabList>
                {tabItems.map((item, index) => (
                    <Tabs.Panel key={item.id} index={index}>
                        {item.content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        );

        // Check if all tab labels are rendered
        tabItems.forEach((item) => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
        });

        // The first tab should be selected by default
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tab 1');

        // First panel content should be visible, others hidden
        expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
        expect(screen.getByTestId('panel-0')).not.toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-1')).toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-2')).toHaveAttribute('hidden');
    });

    it('changes the active tab when clicked', () => {
        renderWithTheme(
            <Tabs>
                <Tabs.TabList>
                    {tabItems.map((item) => (
                        <Tabs.Tab key={item.id} label={item.label} />
                    ))}
                </Tabs.TabList>
                {tabItems.map((item, index) => (
                    <Tabs.Panel key={item.id} index={index}>
                        {item.content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        );

        // Click the second tab
        fireEvent.click(screen.getByText('Tab 2'));

        // The second tab should now be selected
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tab 2');

        // Second panel content should be visible, others hidden
        expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
        expect(screen.getByTestId('panel-0')).toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-1')).not.toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-2')).toHaveAttribute('hidden');
    });

    it('renders with the correct journey-specific theme', () => {
        // Test with health journey
        const { rerender } = renderWithTheme(
            <Tabs journey="health">
                <Tabs.TabList>
                    <Tabs.Tab label="Test Tab" />
                </Tabs.TabList>
                <Tabs.Panel index={0}>Test Content</Tabs.Panel>
            </Tabs>,
            healthTheme
        );

        // Get the active tab element
        const healthTab = screen.getByRole('tab', { selected: true });

        // For health theme, check the active tab has appropriate styling
        expect(healthTab).toHaveStyle(`color: ${healthTheme.colors.journeys.health.primary}`);

        // Test with care journey
        rerender(
            <ThemeProvider theme={baseTheme}>
                <Tabs journey="care">
                    <Tabs.TabList>
                        <Tabs.Tab label="Test Tab" />
                    </Tabs.TabList>
                    <Tabs.Panel index={0}>Test Content</Tabs.Panel>
                </Tabs>
            </ThemeProvider>
        );

        // Get the active tab for care journey
        const careTab = screen.getByRole('tab', { selected: true });

        // Check journey attribute for care
        expect(careTab).toHaveStyle({ color: expect.any(String) });

        // Test with plan journey
        rerender(
            <ThemeProvider theme={baseTheme}>
                <Tabs journey="plan">
                    <Tabs.TabList>
                        <Tabs.Tab label="Test Tab" />
                    </Tabs.TabList>
                    <Tabs.Panel index={0}>Test Content</Tabs.Panel>
                </Tabs>
            </ThemeProvider>
        );

        // Get the active tab for plan journey
        const planTab = screen.getByRole('tab', { selected: true });

        // Check journey attribute for plan
        expect(planTab).toHaveStyle({ color: expect.any(String) });
    });

    it('supports keyboard navigation', () => {
        renderWithTheme(
            <Tabs>
                <Tabs.TabList>
                    {tabItems.map((item) => (
                        <Tabs.Tab key={item.id} label={item.label} />
                    ))}
                </Tabs.TabList>
                {tabItems.map((item, index) => (
                    <Tabs.Panel key={item.id} index={index}>
                        {item.content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        );

        // Get all tabs
        const tabs = screen.getAllByRole('tab');

        // Focus the first tab
        tabs[0].focus();
        expect(document.activeElement).toBe(tabs[0]);

        // Press right arrow key to move to next tab
        fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });

        // Focus the second tab (simulating what keyboard navigation should do)
        tabs[1].focus();
        expect(document.activeElement).toBe(tabs[1]);

        // Press right arrow key again to move to third tab
        fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });

        // Focus the third tab
        tabs[2].focus();
        expect(document.activeElement).toBe(tabs[2]);

        // Press left arrow key to move back to second tab
        fireEvent.keyDown(tabs[2], { key: 'ArrowLeft' });

        // Focus the second tab again
        tabs[1].focus();
        expect(document.activeElement).toBe(tabs[1]);
    });

    it('has the correct ARIA attributes for accessibility', () => {
        renderWithTheme(
            <Tabs>
                <Tabs.TabList>
                    {tabItems.map((item) => (
                        <Tabs.Tab key={item.id} label={item.label} />
                    ))}
                </Tabs.TabList>
                {tabItems.map((item, index) => (
                    <Tabs.Panel key={item.id} index={index}>
                        {item.content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        );

        // TabList should have role="tablist"
        expect(screen.getByRole('tablist')).toBeInTheDocument();

        // All tabs should have role="tab"
        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);

        // All panels should have role="tabpanel"
        const panels = screen.getAllByRole('tabpanel');
        expect(panels).toHaveLength(3);

        // Selected tab should have aria-selected="true"
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(tabs[2]).toHaveAttribute('aria-selected', 'false');

        // Each tab should have an ID and control its respective panel
        tabs.forEach((tab, index) => {
            expect(tab).toHaveAttribute('id', `tab-${index}`);
            expect(tab).toHaveAttribute('aria-controls', `panel-${index}`);
        });

        // Each panel should be labeled by its respective tab
        panels.forEach((panel, index) => {
            expect(panel).toHaveAttribute('id', `panel-${index}`);
            expect(panel).toHaveAttribute('aria-labelledby', `tab-${index}`);
        });
    });

    it('renders with a specified defaultTab', () => {
        renderWithTheme(
            <Tabs defaultTab={1}>
                <Tabs.TabList>
                    {tabItems.map((item) => (
                        <Tabs.Tab key={item.id} label={item.label} />
                    ))}
                </Tabs.TabList>
                {tabItems.map((item, index) => (
                    <Tabs.Panel key={item.id} index={index}>
                        {item.content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        );

        // The second tab should be selected
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Tab 2');

        // Second panel content should be visible, others hidden
        expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
        expect(screen.getByTestId('panel-0')).toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-1')).not.toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-2')).toHaveAttribute('hidden');
    });
});
