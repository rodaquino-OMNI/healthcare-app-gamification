import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MaintenancePage from './maintenance';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('MaintenancePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MaintenancePage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<MaintenancePage />);
    expect(container.firstChild).toBeTruthy();
  });
});
