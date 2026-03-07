import { describe, it, expect } from '@jest/globals'; // Version latest
import { render, screen } from '@testing-library/react'; // Version ^14.0.0
import React from 'react';

import { Badge } from './Badge'; // Import the Badge component to be tested

describe('Badge', () => {
    it('renders correctly', () => {
        render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders with children', () => {
        render(
            <Badge>
                <span>Test Child</span>
            </Badge>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        const { rerender } = render(<Badge journey="health">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#0ACF83',
        });

        rerender(<Badge journey="care">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#FF8C42',
        });

        rerender(<Badge journey="plan">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#3A86FF',
        });
    });

    it('renders a success badge', () => {
        render(<Badge status="success">Success Badge</Badge>);
        expect(screen.getByText('Success Badge').closest('div')).toHaveStyle({
            backgroundColor: '#00C853',
        });
    });

    it('renders a warning badge', () => {
        render(<Badge status="warning">Warning Badge</Badge>);
        expect(screen.getByText('Warning Badge').closest('div')).toHaveStyle({
            backgroundColor: '#FFD600',
        });
    });

    it('renders an error badge', () => {
        render(<Badge status="error">Error Badge</Badge>);
        expect(screen.getByText('Error Badge').closest('div')).toHaveStyle({
            backgroundColor: '#FF3B30',
        });
    });

    it('renders an info badge', () => {
        render(<Badge status="info">Info Badge</Badge>);
        expect(screen.getByText('Info Badge').closest('div')).toHaveStyle({
            backgroundColor: '#0066CC',
        });
    });
});
