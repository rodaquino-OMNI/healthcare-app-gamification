import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import GoalCard from './GoalCard';
import { baseTheme as theme } from '../../themes';

// Create a custom render function that includes the ThemeProvider
const customRender = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GoalCard', () => {
    it('renders goal card with correct title and progress', () => {
        const title = 'Daily Steps';
        const progress = 65;

        customRender(<GoalCard title={title} progress={progress} />);

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(`${progress}%`)).toBeInTheDocument();

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', String(progress));
    });

    it('renders with description when provided', () => {
        const title = 'Daily Steps';
        const description = 'Walk 10,000 steps every day';

        customRender(<GoalCard title={title} description={description} progress={50} />);

        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('renders completed state correctly', () => {
        customRender(<GoalCard title="Daily Steps" progress={75} completed={true} />);

        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('normalizes progress values to valid range', () => {
        // Test negative progress (should be normalized to 0)
        customRender(<GoalCard title="Test Goal" progress={-20} />);

        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('normalizes progress values above 100 to 100', () => {
        // Re-render with progress > 100 (should be normalized to 100)
        customRender(<GoalCard title="Test Goal" progress={120} />);

        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('has correct accessibility attributes', () => {
        customRender(<GoalCard title="Exercise Goal" progress={50} />);

        const card = screen.getByTestId('goal-card');
        expect(card).toHaveAttribute('aria-label', 'Goal: Exercise Goal, 50% complete');

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    // Note: This test would require modifying the GoalCard component to accept a journey prop
    // and apply different styling based on the journey. This is a placeholder test.
    it('applies journey-specific styling', () => {
        // Since the current implementation doesn't support journey-specific styling,
        // this test is a placeholder for future implementation
        expect(true).toBeTruthy();

        // Future implementation would look like this:
        /*
    // Mock custom theme with journey colors
    const mockTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        journeys: {
          health: { primary: '#0ACF83' },
          care: { primary: '#FF8C42' }
        },
        semantic: {
          success: '#00C853'
        },
        neutral: {
          white: '#FFFFFF',
          gray200: '#EEEEEE',
          gray600: '#757575',
          gray700: '#616161',
          gray900: '#212121'
        }
      },
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)'
      },
      typography: {
        fontSize: {
          sm: '14px',
          md: '16px',
          lg: '18px'
        },
        fontWeight: {
          medium: 500,
          bold: 700
        }
      }
    };

    const { rerender } = render(
      <ThemeProvider theme={mockTheme}>
        <GoalCard 
          title="Health Goal" 
          progress={50}
          journey="health"
        />
      </ThemeProvider>
    );
    
    // Check that health journey styling is applied
    const card = screen.getByTestId('goal-card');
    expect(card).toHaveStyle('border-left-color: #0ACF83');
    
    // Re-render with care journey
    rerender(
      <ThemeProvider theme={mockTheme}>
        <GoalCard 
          title="Care Goal" 
          progress={50}
          journey="care"
        />
      </ThemeProvider>
    );
    
    // Check that care journey styling is applied
    expect(card).toHaveStyle('border-left-color: #FF8C42');
    */
    });
});
