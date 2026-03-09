declare module 'react-datepicker' {
    import * as React from 'react';

    export interface CalendarContainerProps {
        className?: string;
        children?: React.ReactNode;
    }

    export function registerLocale(localeName: string, localeData: object): void;
    export function setDefaultLocale(localeName: string): void;

    export interface ReactDatePickerProps {
        selected?: Date | null;
        onChange?: (date: Date | null) => void;
        calendarContainer?: (props: CalendarContainerProps) => React.ReactElement;
        locale?: string;
        inline?: boolean;
        showPopperArrow?: boolean;
        minDate?: Date;
        maxDate?: Date;
        dateFormat?: string;
        disabledKeyboardNavigation?: boolean;
        'aria-label'?: string;
    }

    const DatePicker: React.FC<ReactDatePickerProps>;
    export default DatePicker;
}
