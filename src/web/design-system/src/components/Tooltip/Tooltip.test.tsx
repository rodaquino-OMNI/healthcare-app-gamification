import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the trigger element', () => {
        render(
            <Tooltip content="Tooltip text">
                <button>Hover me</button>
            </Tooltip>
        );
        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('shows tooltip on hover', () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Hover me</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        expect(screen.getByTestId('tooltip-content')).toHaveTextContent('Tooltip text');
    });

    it('hides tooltip on mouse leave', () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Hover me</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        fireEvent.mouseLeave(screen.getByTestId('tooltip-trigger'));
        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveStyle('opacity: 0');
    });

    it('shows tooltip on click when trigger is click', () => {
        render(
            <Tooltip content="Click tooltip" trigger="click" delay={0}>
                <button>Click me</button>
            </Tooltip>
        );
        fireEvent.click(screen.getByTestId('tooltip-trigger'));
        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveStyle('opacity: 1');
    });

    it('renders arrow by default', () => {
        render(
            <Tooltip content="With arrow" delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();
    });

    it('hides arrow when arrow prop is false', () => {
        render(
            <Tooltip content="No arrow" arrow={false} delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        expect(screen.queryByTestId('tooltip-arrow')).not.toBeInTheDocument();
    });

    it('has correct role', () => {
        render(
            <Tooltip content="Accessible tooltip">
                <button>Hover</button>
            </Tooltip>
        );
        expect(screen.getByTestId('tooltip-content')).toHaveAttribute('role', 'tooltip');
    });
});
