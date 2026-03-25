import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import SymptomSelector from './SymptomSelector';
import { careTheme } from '../../themes/care.theme';

type Symptom = { id: string; name: string };

const symptoms: Symptom[] = [
    { id: '1', name: 'Fever' },
    { id: '2', name: 'Cough' },
    { id: '3', name: 'Headache' },
    { id: '4', name: 'Sore Throat' },
    { id: '5', name: 'Fatigue' },
];

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={careTheme}>{ui}</ThemeProvider>);
};

describe('SymptomSelector', () => {
    it('Renders correctly with a list of symptoms', () => {
        renderWithTheme(<SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />);
        symptoms.forEach((symptom) => {
            expect(screen.getByText(String(symptom.name))).toBeInTheDocument();
        });
    });

    it('Calls onSymptomsSelected when a symptom is selected and submitted', () => {
        const onSymptomsSelected = jest.fn();
        renderWithTheme(<SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={onSymptomsSelected} />);

        const symptomCheckbox = screen.getByTestId('symptom-checkbox-1');
        fireEvent.click(symptomCheckbox);

        const submitButton = screen.getByRole('button', { name: /submit selected symptoms/i });
        fireEvent.click(submitButton);

        expect(onSymptomsSelected).toHaveBeenCalledWith([symptoms[0]]);
    });

    it('Disables submit button when no symptoms are selected', () => {
        renderWithTheme(<SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />);

        const submitButton = screen.getByRole('button', { name: /submit selected symptoms/i });
        expect(submitButton).toBeDisabled();
    });

    it('Filters symptoms based on search term', () => {
        renderWithTheme(<SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />);

        const searchInput = screen.getByPlaceholderText('Search symptoms...');
        fireEvent.change(searchInput, { target: { value: 'Head' } });

        expect(screen.getByText('Headache')).toBeInTheDocument();
        expect(screen.queryByText('Fever')).not.toBeInTheDocument();
    });

    it('Applies Care theme correctly', () => {
        renderWithTheme(<SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />);

        expect(screen.getByText('Select Your Symptoms')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search symptoms...')).toBeInTheDocument();
    });
});
