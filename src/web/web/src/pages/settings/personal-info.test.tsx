import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalInfoPage from './personal-info';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/settings/personal-info',
    asPath: '/settings/personal-info',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('../../api/settings', () => ({
  savePersonalInfo: jest.fn().mockResolvedValue({}),
}));

describe('PersonalInfoPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<PersonalInfoPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<PersonalInfoPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
