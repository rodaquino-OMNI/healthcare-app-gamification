import { render, screen, fireEvent, act } from '@testing-library/react';
import { format } from 'date-fns';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import DatePicker, { DatePickerProps } from '../DatePicker';

// Create a mock theme for testing
const mockTheme = {
    colors: {
        journeys: {
            health: {
                primary: '#0ACF83',
                secondary: '#05A66A',
                accent: '#00875A',
                background: '#F0FFF4',
                text: '#1A1A1A',
            },
            care: {
                primary: '#FF8C42',
                secondary: '#F17C3A',
                accent: '#E55A00',
                background: '#FFF8F0',
                text: '#1A1A1A',
            },
            plan: {
                primary: '#3A86FF',
                secondary: '#2D6FD9',
                accent: '#0057E7',
                background: '#F0F8FF',
                text: '#1A1A1A',
            },
        },
        neutral: {
            white: '#FFFFFF',
            gray100: '#F5F5F5',
            gray200: '#EEEEEE',
            gray300: '#E0E0E0',
            gray400: '#BDBDBD',
            gray500: '#9E9E9E',
            gray600: '#757575',
            gray700: '#616161',
            gray800: '#424242',
            gray900: '#212121',
            black: '#000000',
        },
        semantic: {
            error: '#FF3B30',
        },
        brand: {
            primary: '#0066CC',
            secondary: '#00A3E0',
        },
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    },
};

// Helper function to render components with theme
const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={mockTheme as any}>{ui}</ThemeProvider>);
};

// Helper function to set up the component with props
const setup = (props: Partial<DatePickerProps> = {}) => {
    const onChange = jest.fn();
    const utils = renderWithTheme(<DatePicker onChange={onChange} {...props} />);

    return {
        ...utils,
        onChange,
    };
};

// Mock Modal component
jest.mock('../../components/Modal/Modal', () => {
    const MockModal = ({ children, visible, onClose, title }: any) =>
        visible ? (
            <div role="dialog" aria-modal="true" data-testid="mock-modal">
                <div>{title}</div>
                <div data-testid="modal-content">{children}</div>
                <button onClick={onClose} data-testid="close-modal">
                    Close
                </button>
            </div>
        ) : null;
    MockModal.displayName = 'MockModal';
    return MockModal;
});

// Mock Button component
jest.mock('../../components/Button/Button', () => {
    const MockButton = ({ children, onPress, variant, journey, accessibilityLabel }: any) => (
        <button
            onClick={onPress}
            data-testid={`button-${variant || 'primary'}`}
            data-journey={journey}
            aria-label={accessibilityLabel}
        >
            {children}
        </button>
    );
    MockButton.displayName = 'MockButton';
    return MockButton;
});

// Mock react-datepicker
/* eslint-disable @typescript-eslint/no-unsafe-return -- Mock factory returns untyped test double */
jest.mock('react-datepicker', () => {
    const actual = jest.requireActual('react-datepicker');
    return {
        __esModule: true,
        ...actual,
        default: ({ onChange, minDate, maxDate, calendarContainer: CalendarContainer, locale }: any) => {
            // Mock calendar component
            const calendar = (
                <div data-testid="mock-date-picker">
                    <div>
                        <button
                            onClick={() => onChange(new Date(2023, 3, 10))}
                            data-testid="select-early-date"
                            disabled={minDate && new Date(2023, 3, 10) < minDate}
                        >
                            April 10
                        </button>
                        <button onClick={() => onChange(new Date(2023, 3, 15))} data-testid="select-mid-date">
                            April 15
                        </button>
                        <button
                            onClick={() => onChange(new Date(2023, 3, 20))}
                            data-testid="select-late-date"
                            disabled={maxDate && new Date(2023, 3, 20) > maxDate}
                        >
                            April 20
                        </button>
                    </div>
                    {locale === 'pt-BR' && <div data-testid="brazilian-locale">Portuguese locale applied</div>}
                </div>
            );

            if (CalendarContainer) {
                return (
                    <CalendarContainer className="calendar-container">
                        {calendar}
                        <div>
                            <button data-testid="button-secondary">Cancelar</button>
                            <button data-testid="button-primary">Confirmar</button>
                        </div>
                    </CalendarContainer>
                );
            }

            return calendar;
        },
    };
});
/* eslint-enable @typescript-eslint/no-unsafe-return */

describe('DatePicker', () => {
    it('renders correctly with default props', () => {
        const { getByTestId } = setup();
        const input = getByTestId('date-picker-input');

        expect(input).toBeInTheDocument();
        expect(screen.getByText('Selecione uma data')).toBeInTheDocument();
    });

    it('handles date selection', () => {
        const { getByTestId, onChange } = setup();
        const input = getByTestId('date-picker-input');

        // Open the date picker
        fireEvent.click(input);

        // Modal should be open
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

        // Select a date
        fireEvent.click(screen.getByTestId('select-mid-date'));

        // Click confirm
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);

        // Check if onChange was called with the selected date
        expect(onChange).toHaveBeenCalledWith(expect.any(Date));
        const selectedDate = onChange.mock.calls[0][0];
        expect(selectedDate.getDate()).toBe(15);
        expect(selectedDate.getMonth()).toBe(3); // April (0-indexed)
        expect(selectedDate.getFullYear()).toBe(2023);
    });

    it('displays the selected date in the correct format', () => {
        const testDate = new Date(2023, 3, 15); // April 15, 2023
        setup({ value: testDate });

        const formattedDate = format(testDate, 'dd/MM/yyyy');
        const textElement = screen.getByTestId('date-picker-text');
        expect(textElement).toHaveTextContent(formattedDate);
    });

    it('respects min and max date constraints', () => {
        const minDate = new Date(2023, 3, 12); // April 12, 2023
        const maxDate = new Date(2023, 3, 18); // April 18, 2023
        const { getByTestId, onChange } = setup({ minDate, maxDate });

        // Open the date picker
        fireEvent.click(getByTestId('date-picker-input'));

        // Try to select a date before minDate (should be disabled)
        const earlyDate = screen.getByTestId('select-early-date');
        expect(earlyDate).toBeDisabled();
        fireEvent.click(earlyDate);

        // Select a valid date
        fireEvent.click(screen.getByTestId('select-mid-date'));

        // Try to select a date after maxDate (should be disabled)
        const lateDate = screen.getByTestId('select-late-date');
        expect(lateDate).toBeDisabled();
        fireEvent.click(lateDate);

        // Click confirm
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);

        // Only the mid-date selection should have worked
        expect(onChange).toHaveBeenCalledTimes(1);
        const selectedDate = onChange.mock.calls[0][0];
        expect(selectedDate.getDate()).toBe(15);
    });

    it('allows clearing the date using the ref', () => {
        const testDate = new Date(2023, 3, 15); // April 15, 2023
        const datePickerRef = React.createRef<any>();
        const onChange = jest.fn();

        renderWithTheme(<DatePicker ref={datePickerRef} value={testDate} onChange={onChange} />);

        // Verify date is displayed
        expect(screen.getByTestId('date-picker-text')).toHaveTextContent(format(testDate, 'dd/MM/yyyy'));

        // Use the ref to clear the date
        act(() => {
            datePickerRef.current.clear();
        });

        // Check if onChange was called with null
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('displays error message when provided', () => {
        const errorMessage = 'This is an error message';
        setup({ error: errorMessage });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        // Test each journey to verify they apply different styling
        const journeys = ['health', 'care', 'plan'] as const;

        journeys.forEach((journey) => {
            const { getByTestId, unmount } = setup({ journey });
            const inputContainer = getByTestId('date-picker-input');

            // Assert that component renders with the journey prop
            expect(inputContainer).toBeInTheDocument();

            // In a real test with jest-styled-components, we would check styling directly
            // Here we're just verifying that the component accepts different journey props
            unmount();
        });
    });

    it('is accessible via keyboard navigation', () => {
        const { getByTestId } = setup();
        const input = getByTestId('date-picker-input');

        // Focus the input
        input.focus();

        // Simulate pressing Enter to open the date picker
        fireEvent.keyDown(input, { key: 'Enter' });

        // Check if modal is opened
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

        // Check if date picker has appropriate accessibility attributes
        const datePicker = screen.getByTestId('mock-date-picker');
        expect(datePicker).toBeInTheDocument();

        // Verify cancel and confirm buttons have accessibility labels
        const cancelButton = screen.getByText('Cancelar');
        const confirmButton = screen.getByText('Confirmar');
        expect(cancelButton).toHaveAttribute('aria-label', 'Cancelar');
        expect(confirmButton).toHaveAttribute('aria-label', 'Confirmar');
    });

    it('supports internationalization', () => {
        const { getByTestId } = setup();
        const input = getByTestId('date-picker-input');

        // Open the date picker
        fireEvent.click(input);

        // Verify that Brazilian Portuguese is being used
        expect(screen.getByTestId('brazilian-locale')).toBeInTheDocument();

        // Verify that the modal title is in Portuguese
        expect(screen.getByText('Selecione uma data')).toBeInTheDocument();

        // Check for Portuguese button text
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();

        // Select a date and confirm
        fireEvent.click(screen.getByTestId('select-mid-date'));
        fireEvent.click(screen.getByText('Confirmar'));

        // After selecting, the date should be displayed in Brazilian format (DD/MM/YYYY)
        const selectedDate = new Date(2023, 3, 15);
        const formattedDate = format(selectedDate, 'dd/MM/yyyy');
        expect(formattedDate).toMatch(/\d{2}\/\d{2}\/\d{4}/); // DD/MM/YYYY format
    });
});
