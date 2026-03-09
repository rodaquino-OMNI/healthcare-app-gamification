import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

interface MockCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
    interactive?: boolean;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
    size?: string;
}

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockBadgeProps {
    children?: React.ReactNode;
    status?: string;
}

interface MockInputProps {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    'aria-label'?: string;
}

interface MockSpreadProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

interface MockTabLabelProps {
    label: string;
}

jest.mock('design-system/components/Card/Card', () => ({
    Card: ({ children, onPress, accessibilityLabel, interactive }: MockCardProps) => (
        <div
            data-testid="card"
            onClick={onPress}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && onPress) {
                    onPress();
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={accessibilityLabel}
            data-interactive={interactive}
        >
            {children}
        </div>
    ),
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, accessibilityLabel, size }: MockButtonProps) => (
        <button onClick={onPress} aria-label={accessibilityLabel} data-size={size}>
            {children}
        </button>
    ),
}));

jest.mock('design-system/components/Tabs/Tabs', () => {
    const MockTabs = ({ children }: MockChildrenProps) => <div data-testid="tabs">{children}</div>;
    MockTabs.displayName = 'Tabs';
    const MockTabList = ({ children }: MockChildrenProps) => <div role="tablist">{children}</div>;
    MockTabList.displayName = 'TabList';
    const MockTab = ({ label }: MockTabLabelProps) => <button role="tab">{label}</button>;
    MockTab.displayName = 'Tab';
    const MockPanel = ({ children }: MockChildrenProps) => <div role="tabpanel">{children}</div>;
    MockPanel.displayName = 'Panel';
    MockTabs.TabList = MockTabList;
    MockTabs.Tab = MockTab;
    MockTabs.Panel = MockPanel;
    return { Tabs: MockTabs };
});

jest.mock('design-system/components/Badge/Badge', () => ({
    Badge: ({ children, status }: MockBadgeProps) => (
        <span data-testid="badge" data-status={status}>
            {children}
        </span>
    ),
}));

jest.mock('design-system/components/Input/Input', () => ({
    default: ({ value, onChange, placeholder, 'aria-label': ariaLabel }: MockInputProps) => (
        <input value={value} onChange={onChange} placeholder={placeholder} aria-label={ariaLabel} />
    ),
}));

jest.mock('design-system/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: MockSpreadProps) => <span {...props}>{children}</span>,
}));

jest.mock('design-system/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: MockSpreadProps) => <div {...props}>{children}</div>,
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: { health: { primary: '#1a9e6a', text: '#0d4a2d' } },
        gray: { 40: '#aaa', 50: '#888' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: { xs: '8px', sm: '12px', md: '16px', xl: '32px', '3xs': '4px' },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_HEALTH_ROUTES: { MEDICATION_ADD: '/health/medications/add' },
}));

import MedicationsPage from '../../../pages/health/medications';

describe('Medications Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicationsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the medications heading', () => {
        render(<MedicationsPage />);
        expect(screen.getByText(/medications/i)).toBeTruthy();
    });

    it('renders add medication button', () => {
        render(<MedicationsPage />);
        expect(screen.getByRole('button', { name: /add a new medication/i })).toBeTruthy();
    });

    it('renders search input', () => {
        render(<MedicationsPage />);
        expect(screen.getByLabelText(/search medications/i)).toBeTruthy();
    });

    it('renders tabs component', () => {
        render(<MedicationsPage />);
        expect(screen.getByTestId('tabs')).toBeTruthy();
    });

    it('renders medication entries', () => {
        render(<MedicationsPage />);
        expect(screen.getByText(/losartan/i)).toBeTruthy();
        expect(screen.getByText(/metformin/i)).toBeTruthy();
    });

    it('renders adherence badges', () => {
        render(<MedicationsPage />);
        const badges = screen.getAllByTestId('badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('filters medications by search term', () => {
        render(<MedicationsPage />);
        const searchInput = screen.getByLabelText(/search medications/i);
        fireEvent.change(searchInput, { target: { value: 'Losartan' } });
        expect(screen.getByText(/losartan/i)).toBeTruthy();
    });
});
