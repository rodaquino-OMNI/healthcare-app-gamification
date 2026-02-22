import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/CareLayout', () => ({
  CareLayout: ({ children }: any) => <div data-testid="care-layout">{children}</div>,
}));

jest.mock('src/web/web/src/components/shared/JourneyHeader', () => ({
  JourneyHeader: ({ title }: any) => <h1 data-testid="journey-header">{title}</h1>,
}));

jest.mock('src/web/web/src/components/forms/AppointmentForm', () => ({
  AppointmentForm: () => <form data-testid="appointment-form"><button type="submit">Agendar</button></form>,
}));

jest.mock('src/web/web/src/context/JourneyContext', () => ({
  JourneyContext: { Consumer: ({ children }: any) => children({ journey: 'care' }) },
  useJourneyContext: () => ({ currentJourney: 'care' }),
}));

import AppointmentBookingPage from '../../../pages/care/appointments/book';

describe('Appointment Booking Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppointmentBookingPage />);
    expect(container).toBeTruthy();
  });

  it('renders the care layout', () => {
    render(<AppointmentBookingPage />);
    expect(screen.getByTestId('care-layout')).toBeTruthy();
  });

  it('renders the journey header', () => {
    render(<AppointmentBookingPage />);
    expect(screen.getByTestId('journey-header')).toBeTruthy();
  });

  it('renders the correct header title', () => {
    render(<AppointmentBookingPage />);
    expect(screen.getByText(/agendar consulta/i)).toBeTruthy();
  });

  it('renders the appointment form', () => {
    render(<AppointmentBookingPage />);
    expect(screen.getByTestId('appointment-form')).toBeTruthy();
  });
});
