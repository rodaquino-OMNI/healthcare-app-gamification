import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFoundPage from './404';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('NotFoundPage (404)', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotFoundPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<NotFoundPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
