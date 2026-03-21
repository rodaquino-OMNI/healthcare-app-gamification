import { Button } from '@design-system/components/Button/Button'; // version: that is compatible with the design system
import { Checkbox } from '@design-system/components/Checkbox/Checkbox'; // version: that is compatible with the design system
import { Modal } from '@design-system/components/Modal/Modal'; // version: that is compatible with the design system
import { RadioButton } from '@design-system/components/RadioButton/RadioButton'; // version: that is compatible with the design system
import { FilterOption } from '@shared/types/index';
import React, { useState, useCallback } from 'react';

import { JourneyContext } from '@context/JourneyContext';
import { useI18n } from '@i18n/index'; // i18next version: v23.0.0

/**
 * Props interface for the FilterModal component.
 * @property {boolean} visible - A boolean indicating whether the modal is visible.
 * @property {() => void} onClose - A callback function that is called when the modal is closed.
 * @property {(selectedOptions: FilterOption[]) => void} onApply - A callback called when
 *   filter options are applied.
 * @property {FilterOption[]} options - An array of filter options to display in the modal.
 * @property {string} title - The title of the modal.
 */
export interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedOptions: FilterOption[]) => void;
    options: FilterOption[];
    title: string;
}

/**
 * A reusable modal component for displaying and managing filter options.
 * @param {FilterModalProps} props - The props for the FilterModal component.
 * @returns {React.ReactNode} The FilterModal component.
 */
export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, options, title }) => {
    // useState hook to manage the state of the selected filter options
    const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);

    // useContext hook to access the current journey from the JourneyContext
    const { journey } = React.useContext(JourneyContext);

    // useTranslation hook to access the translation function from the i18n context
    const { t } = useI18n();

    // useCallback hook to handle the apply button click
    const handleApply = useCallback(() => {
        onApply(selectedOptions);
        onClose();
    }, [onApply, selectedOptions, onClose]);

    // useCallback hook to handle the checkbox/radio button change
    const handleOptionChange = useCallback((option: FilterOption) => {
        setSelectedOptions((prevOptions) => {
            if (option.type === 'radio') {
                return [option]; // For radio buttons, only one option can be selected
            } else {
                // For checkboxes, toggle the selection
                if (prevOptions.find((o) => o.id === option.id)) {
                    return prevOptions.filter((o) => o.id !== option.id);
                } else {
                    return [...prevOptions, option];
                }
            }
        });
    }, []);

    return (
        <Modal visible={visible} onClose={onClose} title={t(title)} journey={journey as 'health' | 'care' | 'plan'}>
            {/* Mapping through the options array to render each filter option */}
            {options.map((option) => (
                <React.Fragment key={option.id}>
                    {option.type === 'checkbox' ? (
                        <Checkbox
                            id={option.id}
                            name={option.name}
                            value={option.value}
                            checked={!!selectedOptions.find((o) => o.id === option.id)}
                            onChange={() => handleOptionChange(option)}
                            label={t(option.label)}
                            journey={journey as 'health' | 'care' | 'plan'}
                        />
                    ) : (
                        <RadioButton
                            id={option.id}
                            name={option.name}
                            value={option.value}
                            checked={!!selectedOptions.find((o) => o.id === option.id)}
                            onChange={() => handleOptionChange(option)}
                            label={t(option.label)}
                            journey={journey as 'health' | 'care' | 'plan'}
                        />
                    )}
                </React.Fragment>
            ))}

            {/* Apply and Cancel buttons */}
            <Button onPress={handleApply} journey={journey as 'health' | 'care' | 'plan' | undefined}>
                {t('common.buttons.save')}
            </Button>
            <Button variant="secondary" onPress={onClose} journey={journey as 'health' | 'care' | 'plan' | undefined}>
                {t('common.buttons.cancel')}
            </Button>
        </Modal>
    );
};
