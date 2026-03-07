import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from './Stepper';

describe('Stepper', () => {
    const defaultSteps = [
        { label: 'Account', description: 'Create account' },
        { label: 'Profile', description: 'Setup profile' },
        { label: 'Confirm', description: 'Review details' },
    ];

    it('renders all steps', () => {
        render(<Stepper steps={defaultSteps} activeStep={0} />);
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('marks completed steps with checkmark', () => {
        render(<Stepper steps={defaultSteps} activeStep={2} />);
        expect(screen.getByTestId('step-circle-0')).toHaveTextContent('✓');
        expect(screen.getByTestId('step-circle-1')).toHaveTextContent('✓');
    });

    it('shows step number for active and pending steps', () => {
        render(<Stepper steps={defaultSteps} activeStep={1} />);
        expect(screen.getByTestId('step-circle-1')).toHaveTextContent('2');
        expect(screen.getByTestId('step-circle-2')).toHaveTextContent('3');
    });

    it('calls onStepPress when step is clicked', () => {
        const onStepPress = jest.fn();
        render(<Stepper steps={defaultSteps} activeStep={1} onStepPress={onStepPress} />);
        fireEvent.click(screen.getByTestId('step-circle-0'));
        expect(onStepPress).toHaveBeenCalledWith(0);
    });

    it('renders connectors between steps', () => {
        render(<Stepper steps={defaultSteps} activeStep={0} />);
        expect(screen.getByTestId('step-connector-0')).toBeInTheDocument();
        expect(screen.getByTestId('step-connector-1')).toBeInTheDocument();
    });

    it('has correct accessibility attributes', () => {
        render(<Stepper steps={defaultSteps} activeStep={0} accessibilityLabel="Signup progress" />);
        expect(screen.getByTestId('stepper')).toHaveAttribute('aria-label', 'Signup progress');
    });
});
