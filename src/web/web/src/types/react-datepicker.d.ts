declare module 'react-datepicker' {
    import { Component, ReactNode } from 'react';

    interface DatePickerProps {
        selected?: Date | null;
        onChange: (date: Date | null) => void;
        [key: string]: unknown;
    }

    interface CalendarContainerProps {
        children?: ReactNode;
        className?: string;
    }

    export default class DatePicker extends Component<DatePickerProps> {}
    export function registerLocale(localeName: string, localeData: object): void;
    export function setDefaultLocale(localeName: string): void;
    export { CalendarContainerProps };
}
