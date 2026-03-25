import { describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Accordion from './Accordion';

describe('Accordion Component', () => {
    it('Renders children', () => {
        render(
            <Accordion
                title="Test Accordion Title"
                content={<div data-testid="accordion-content">Accordion Content</div>}
            />
        );

        // Check that title and content are in the document
        expect(screen.getByText('Test Accordion Title')).toBeInTheDocument();
        expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
    });

    it('Toggles content visibility on click', () => {
        const { container } = render(
            <Accordion title="Test Accordion" content={<div data-testid="accordion-content">Accordion Content</div>} />
        );

        // The Touchable (button) wraps the AccordionHeader div which holds aria-expanded
        const button = screen.getByRole('button', { name: /Test Accordion/i });
        const header = container.querySelector('[aria-controls]') as HTMLElement;

        // Initially aria-expanded should be false
        expect(header).toHaveAttribute('aria-expanded', 'false');

        // Click the button to toggle
        fireEvent.click(button);

        // After clicking, aria-expanded should be true
        expect(header).toHaveAttribute('aria-expanded', 'true');

        // Click again
        fireEvent.click(button);

        // After second click, aria-expanded should be false again
        expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('Is expanded based on prop', () => {
        const { rerender, container } = render(
            <Accordion
                title="Test Accordion"
                content={<div data-testid="accordion-content">Accordion Content</div>}
                isExpanded={true}
            />
        );

        // The AccordionHeader div holds aria-expanded; the Touchable is the button
        const header = container.querySelector('[aria-controls]') as HTMLElement;

        // Since isExpanded is true, aria-expanded should be true
        expect(header).toHaveAttribute('aria-expanded', 'true');

        // Re-render with isExpanded=false
        rerender(
            <Accordion
                title="Test Accordion"
                content={<div data-testid="accordion-content">Accordion Content</div>}
                isExpanded={false}
            />
        );

        // Now aria-expanded should be false
        expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('Has correct aria attributes', () => {
        const { container } = render(
            <Accordion title="Test Accordion" content={<div data-testid="accordion-content">Accordion Content</div>} />
        );

        // AccordionHeader is the div with aria-controls; region is the content
        const header = container.querySelector('[aria-controls]') as HTMLElement;
        const content = screen.getByRole('region');

        // Check aria attributes on header div
        expect(header).toHaveAttribute('aria-expanded', 'false');
        expect(header).toHaveAttribute('aria-controls');

        // Check aria attributes on content
        expect(content).toHaveAttribute('aria-labelledby');

        // The content's aria-labelledby should match the header's id
        const headerId = header.getAttribute('id')!.split('-header')[0];
        const contentId = content.getAttribute('id')!.split('-content')[0];

        // Ensure the base IDs match to confirm the relationship between elements
        expect(headerId).toBe(contentId);
    });

    it('Supports journey-specific styling', () => {
        // Test with different journeys to ensure the component accepts the prop correctly
        const { rerender } = render(<Accordion title="Health Journey" content="Health content" journey="health" />);

        // Component should render without errors with health journey
        expect(screen.getByText('Health Journey')).toBeInTheDocument();

        // Re-render with care journey
        rerender(<Accordion title="Care Journey" content="Care content" journey="care" />);

        // Component should render without errors with care journey
        expect(screen.getByText('Care Journey')).toBeInTheDocument();

        // Re-render with plan journey
        rerender(<Accordion title="Plan Journey" content="Plan content" journey="plan" />);

        // Component should render without errors with plan journey
        expect(screen.getByText('Plan Journey')).toBeInTheDocument();
    });
});
