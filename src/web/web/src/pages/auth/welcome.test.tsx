import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomePage from './welcome';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('WelcomePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<WelcomePage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<WelcomePage />);
    expect(container.firstChild).toBeTruthy();
  });
});
