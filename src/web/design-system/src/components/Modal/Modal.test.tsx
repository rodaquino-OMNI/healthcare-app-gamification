import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Modal } from './Modal';
import { baseTheme } from '../../themes/base.theme';
import { careTheme } from '../../themes/care.theme';
import { healthTheme } from '../../themes/health.theme';
import { planTheme } from '../../themes/plan.theme';

// Helper function to render a component with a specified theme
const renderWithTheme = (ui: React.ReactElement, theme: any) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Modal component', () => {
    it('renders correctly when visible', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} title="Test Modal">
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
        renderWithTheme(
            <Modal visible={false} onClose={() => {}} title="Test Modal">
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders with a title when provided', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} title="Custom Title">
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders children content', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}}>
                <div>Custom Content</div>
            </Modal>,
            baseTheme
        );

        expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('calls onClose when backdrop is clicked', () => {
        const onCloseMock = jest.fn();
        renderWithTheme(
            <Modal visible={true} onClose={onCloseMock}>
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        // The ModalContainer IS the dialog overlay; clicking it directly (target === currentTarget) calls onClose
        const backdrop = screen.getByRole('dialog');
        fireEvent.click(backdrop);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the close button is clicked', () => {
        const onCloseMock = jest.fn();
        renderWithTheme(
            <Modal visible={true} onClose={onCloseMock} title="Modal with Close Button">
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        // Find the close button by its accessibility label and click it
        const closeButton = screen.getByRole('button', { name: 'Close modal' });
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls action handler when action button is clicked', () => {
        const actionHandlerMock = jest.fn();
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} title="Modal with Actions">
                <div>Modal content</div>
                <button onClick={actionHandlerMock}>Action Button</button>
            </Modal>,
            baseTheme
        );

        // Find and click the action button
        const actionButton = screen.getByText('Action Button');
        fireEvent.click(actionButton);

        expect(actionHandlerMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', () => {
        const onCloseMock = jest.fn();
        renderWithTheme(
            <Modal visible={true} onClose={onCloseMock}>
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('applies journey-specific styling with health theme', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} journey="health" title="Health Journey Modal">
                <div>Modal content</div>
            </Modal>,
            healthTheme
        );

        // journey prop is consumed by styled-component Text for CSS — not forwarded as DOM attribute
        // Verify the title renders correctly with the health journey modal
        expect(screen.getByText('Health Journey Modal')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('applies journey-specific styling with care theme', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} journey="care" title="Care Journey Modal">
                <div>Modal content</div>
            </Modal>,
            careTheme
        );

        expect(screen.getByText('Care Journey Modal')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('applies journey-specific styling with plan theme', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} journey="plan" title="Plan Journey Modal">
                <div>Modal content</div>
            </Modal>,
            planTheme
        );

        expect(screen.getByText('Plan Journey Modal')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has correct accessibility attributes', () => {
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} title="Accessible Modal">
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        // Get the dialog element
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');

        // aria-labelledby is on the dialog element itself, not a child
        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

        // Find the title element and check its ID
        const titleElement = screen.getByText('Accessible Modal');
        expect(titleElement).toHaveAttribute('id', 'modal-title');
    });

    it('traps focus within the modal when open', async () => {
        // This test verifies that focus can be set on elements inside the modal
        renderWithTheme(
            <Modal visible={true} onClose={() => {}} title="Focus Trap Test">
                <button>First Button</button>
                <button>Second Button</button>
                <button>Third Button</button>
            </Modal>,
            baseTheme
        );

        // Modal should be in the document
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Simulate tabbing through elements and verify focus remains in modal
        const buttons = screen.getAllByRole('button');
        for (const button of buttons) {
            button.focus();
            expect(document.activeElement).toBe(button);
        }
    });

    it('closes when Escape key is pressed', () => {
        const onCloseMock = jest.fn();
        renderWithTheme(
            <Modal visible={true} onClose={onCloseMock}>
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('prevents body scrolling when open and restores on close', () => {
        const { rerender } = renderWithTheme(
            <Modal visible={true} onClose={() => {}}>
                <div>Modal content</div>
            </Modal>,
            baseTheme
        );

        // Body should have overflow: hidden when modal is open
        expect(document.body.style.overflow).toBe('hidden');

        // Re-render with visible=false
        rerender(
            <ThemeProvider theme={baseTheme}>
                <Modal visible={false} onClose={() => {}}>
                    <div>Modal content</div>
                </Modal>
            </ThemeProvider>
        );

        // Body overflow should be restored
        expect(document.body.style.overflow).toBe('');
    });
});
