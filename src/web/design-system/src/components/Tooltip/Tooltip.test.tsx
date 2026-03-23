import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import { Tooltip } from './Tooltip';
import { colors } from '../../tokens/colors';

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

    it('renders with color="black" by default', () => {
        render(
            <Tooltip content="Black tooltip" delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveStyle(`background-color: ${colors.gray[80]}`);
        expect(tooltipContent).toHaveStyle(`color: ${colors.neutral.white}`);
    });

    it('renders with color="brand" and brand background', () => {
        render(
            <Tooltip content="Brand tooltip" color="brand" delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveStyle(`background-color: ${colors.componentColors.brand}`);
        expect(tooltipContent).toHaveStyle(`color: ${colors.neutral.white}`);
    });

    it('renders with color="white" and white background with border', () => {
        render(
            <Tooltip content="White tooltip" color="white" delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveStyle(`background-color: ${colors.neutral.white}`);
        expect(tooltipContent).toHaveStyle(`color: ${colors.gray[80]}`);
        expect(tooltipContent).toHaveStyle(`border: 1px solid ${colors.gray[20]}`);
    });

    it('arrow color matches tooltip color variant', () => {
        render(
            <Tooltip content="Brand tooltip" color="brand" delay={0}>
                <button>Hover</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
        act(() => {
            jest.runAllTimers();
        });
        const arrow = screen.getByTestId('tooltip-arrow');
        expect(arrow).toHaveStyle(`background-color: ${colors.componentColors.brand}`);
    });
});
