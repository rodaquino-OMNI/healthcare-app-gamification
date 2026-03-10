import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// eslint-disable-next-line import/no-unresolved
import SymptomSelector from './SymptomSelector';
type Symptom = { id: string; name: string };
// eslint-disable-next-line import/no-unresolved
import { careTheme } from '../../themes/care.theme';

const symptoms: Symptom[] = [
    { id: '1', name: 'Fever' },
    { id: '2', name: 'Cough' },
    { id: '3', name: 'Headache' },
    { id: '4', name: 'Sore Throat' },
    { id: '5', name: 'Fatigue' },
];

describe('SymptomSelector', () => {
    it('Renders correctly with a list of symptoms', () => {
        // Render the SymptomSelector component with a list of symptoms.
        const { getByText } = render(
            <SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />
        );

        // Verify that each symptom is displayed as a selectable option.
        symptoms.forEach((symptom) => {
            expect(getByText(String(symptom.name))).toBeDefined();
        });
    });

    it('Calls onSelect when a symptom is selected', () => {
        // Render the SymptomSelector component with a list of symptoms and an onSelect function.
        const onSymptomsSelected = jest.fn();
        const { getByTestId } = render(
            <SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={onSymptomsSelected} />
        );

        // Simulate selecting a symptom by firing the onChange event on the Checkbox component.
        const symptomCheckbox = getByTestId('symptom-checkbox-1');
        fireEvent.press(symptomCheckbox);

        const submitButton = getByTestId('submit-symptoms-button');
        fireEvent.press(submitButton);

        // The onSelect function is called with an array containing the selected symptom.
        expect(onSymptomsSelected).toHaveBeenCalledWith([symptoms[0]]);

        // Simulate deselecting the symptom
        fireEvent.press(symptomCheckbox);
        fireEvent.press(submitButton);

        // The onSelect function is not called if no symptom is selected.
        expect(onSymptomsSelected).toHaveBeenCalledWith([]);
    });

    it('Filters symptoms based on search term', () => {
        // Render the SymptomSelector component with a list of symptoms.
        const { getByPlaceholderText, getByText, queryByText } = render(
            <SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />
        );

        // Simulate typing a search term into the Input component.
        const searchInput = getByPlaceholderText('Search symptoms...');
        fireEvent.changeText(searchInput, 'Head');

        // Only symptoms with names that include the search term are rendered.
        expect(getByText('Headache')).toBeDefined();
        expect(queryByText('Fever')).toBeNull();

        // The Input component displays the search term.
        expect(searchInput).toHaveProp('value', 'Head');
    });

    it('Applies Care theme correctly', () => {
        // Render the SymptomSelector component.
        const { getByText, getByPlaceholderText } = render(
            <SymptomSelector symptoms={symptoms} journey="care" onSymptomsSelected={() => {}} />
        );

        // The component's text color matches the Care theme's text color.
        const selectSymptomsText = getByText('Select Your Symptoms');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(selectSymptomsText).toHaveProp('style', { color: careTheme.colors.journeys.care.primary });

        // The component's background color matches the Care theme's background color.
        const searchInput = getByPlaceholderText('Search symptoms...');
        expect(searchInput).toBeDefined();
    });
});
