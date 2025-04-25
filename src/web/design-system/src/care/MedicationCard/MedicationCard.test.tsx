import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { ThemeProvider } from 'styled-components';
import MedicationCard from './MedicationCard';
import { careTheme } from '../../themes/care.theme';

/**
 * Helper function to render components with the Care journey theme.
 */
const renderWithTheme = (ui: React.ReactNode) => {
  return render(
    <ThemeProvider theme={careTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('MedicationCard', () => {
  it('renders medication information correctly', () => {
    const mockProps = {
      name: 'Amoxicillin',
      dosage: '500mg',
      schedule: 'Three times daily',
      adherence: true
    };

    renderWithTheme(
      <MedicationCard {...mockProps} />
    );

    expect(screen.getByText('Amoxicillin - 500mg')).toBeInTheDocument();
    expect(screen.getByText('Three times daily')).toBeInTheDocument();
    
    // Check if the pill icon is rendered
    const pillIcon = document.querySelector('[aria-hidden="true"]');
    expect(pillIcon).toBeInTheDocument();
    
    // Check if the adherence status icon is rendered correctly (check icon for adherence: true)
    const adherenceIcon = document.querySelectorAll('[aria-hidden="true"]')[1];
    expect(adherenceIcon).toBeInTheDocument();
  });

  it('renders with warning icon when adherence is false', () => {
    renderWithTheme(
      <MedicationCard 
        name="Lisinopril" 
        dosage="10mg" 
        schedule="Once daily" 
        adherence={false} 
      />
    );

    // The second icon should be a warning icon since adherence is false
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    const adherenceIcon = icons[1];
    expect(adherenceIcon).toBeInTheDocument();
    
    // Check parent element has warning color (this is an indirect test,
    // we're checking it has different styling than the success case)
    const iconContainer = adherenceIcon.parentElement;
    const computedStyle = window.getComputedStyle(iconContainer as Element);
    expect(computedStyle.color).not.toBe(careTheme.colors.semantic.success);
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    
    renderWithTheme(
      <MedicationCard 
        name="Aspirin" 
        dosage="81mg" 
        schedule="Once daily" 
        adherence={true}
        onPress={onPressMock}
      />
    );

    const card = screen.getByText('Aspirin - 81mg').closest('div');
    fireEvent.click(card as HTMLElement);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies care journey styling correctly', () => {
    renderWithTheme(
      <MedicationCard 
        name="Simvastatin" 
        dosage="20mg" 
        schedule="Once daily at bedtime" 
        adherence={true} 
      />
    );

    // Check if the pill icon has the care journey primary color
    const pillIcon = document.querySelector('[aria-hidden="true"]');
    const iconContainer = pillIcon?.parentElement;
    
    // Check the color matches the care journey primary color from the theme
    expect(iconContainer).toHaveStyle(`color: ${careTheme.colors.journeys.care.primary}`);
    
    // Check if the card has care journey styling (test for border left property)
    const card = screen.getByText('Simvastatin - 20mg').closest('div[role="button"]');
    expect(card).toHaveAttribute('journey', 'care');
  });

  it('has correct accessibility attributes', () => {
    renderWithTheme(
      <MedicationCard 
        name="Metformin" 
        dosage="1000mg" 
        schedule="Twice daily with meals" 
        adherence={true} 
      />
    );

    // The card should have a role of "button" and an appropriate aria-label
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    
    // Check if the card has the right accessibility label
    expect(card).toHaveAccessibleName(/Medication Metformin, 1000mg, Twice daily with meals, taken as prescribed/i);
    
    // Icons should be appropriately hidden from screen readers
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(2); // Both pill icon and adherence icon
  });
});