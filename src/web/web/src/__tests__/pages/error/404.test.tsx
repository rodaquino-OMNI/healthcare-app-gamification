import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    neutral: {
      white: '#ffffff',
      gray900: '#111827',
      gray600: '#4b5563',
    },
    brand: { primary: '#0066cc' },
  },
}));

jest.mock('src/web/design-system/src/tokens/typography', () => ({
  typography: {
    fontFamily: { body: 'sans-serif' },
    fontSize: {
      'display-sm': '2.5rem',
      'text-lg': '1.125rem',
      'text-md': '1rem',
    },
    fontWeight: { bold: 700, medium: 500 },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacing: {
    sm: '12px',
    md: '16px',
    xl: '32px',
    '2xl': '48px',
  },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
  borderRadius: { md: '8px' },
}));

import NotFoundPage from '../../../pages/404';

describe('404 Not Found Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotFoundPage />);
    expect(container).toBeTruthy();
  });

  it('renders the 404 error code', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeTruthy();
  });

  it('renders the page not found message', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/pagina nao encontrada/i)).toBeTruthy();
  });

  it('renders a link back to home', () => {
    render(<NotFoundPage />);
    const homeLink = screen.getByText(/voltar ao inicio/i);
    expect(homeLink).toBeTruthy();
  });

  it('home link points to root path', () => {
    render(<NotFoundPage />);
    const homeLink = screen.getByText(/voltar ao inicio/i).closest('a');
    expect(homeLink?.getAttribute('href')).toBe('/');
  });

  it('has full viewport height layout', () => {
    render(<NotFoundPage />);
    const container = document.querySelector('[style*="min-height"]');
    expect(container).toBeTruthy();
  });

  it('renders a centered layout', () => {
    render(<NotFoundPage />);
    const container = document.querySelector('[style*="align-items: center"]');
    expect(container).toBeTruthy();
  });
});
