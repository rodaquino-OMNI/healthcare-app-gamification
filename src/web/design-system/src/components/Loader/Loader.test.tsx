import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Loader } from './Loader';

describe('Loader', () => {
    it('renders spinner variant by default', () => {
        render(<Loader />);
        expect(screen.getByTestId('loader-spinner')).toBeInTheDocument();
    });

    it('renders skeleton variant', () => {
        render(<Loader variant="skeleton" />);
        expect(screen.getByTestId('loader-skeleton')).toBeInTheDocument();
    });

    it('renders progress variant', () => {
        render(<Loader variant="progress" progress={50} />);
        expect(screen.getByTestId('loader-progress')).toBeInTheDocument();
    });

    it('has correct progress aria attributes', () => {
        render(<Loader variant="progress" progress={75} />);
        const progressBar = screen.getByTestId('loader-progress');
        expect(progressBar).toHaveAttribute('aria-valuenow', '75');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has correct accessibility label', () => {
        render(<Loader accessibilityLabel="Loading data" />);
        expect(screen.getByTestId('loader-spinner')).toHaveAttribute('aria-label', 'Loading data');
    });

    it('renders with journey theming', () => {
        render(<Loader journey="health" />);
        expect(screen.getByTestId('loader-spinner')).toBeInTheDocument();
    });
});
