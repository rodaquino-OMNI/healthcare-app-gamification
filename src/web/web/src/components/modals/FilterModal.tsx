import { Button } from 'design-system/components/Button/Button';
import { Checkbox } from 'design-system/components/Checkbox/Checkbox';
import { Modal } from 'design-system/components/Modal/Modal';
import React, { useCallback } from 'react';

import { useJourney } from '@/hooks/useJourney';

/**
 * Defines the props interface for the FilterModal component
 */
interface FilterModalProps {
    /**
     * A boolean indicating whether the modal is visible.
     */
    visible: boolean;
    /**
     * A callback function that is called when the modal is closed.
     */
    onClose: () => void;
    /**
     * The title of the modal.
     */
    title: string;
    /**
     * An array of filter options to display in the modal.
     */
    options: { id: string; label: string }[];
    /**
     * A callback function that is called when the apply button is clicked.
     */
    onApply: (selectedOptions: string[]) => void;
}

/**
 * A reusable modal component for displaying and managing filter options.
 */
export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, title, options, onApply }) => {
    // Retrieves the current journey using the `useJourney` hook.
    const { journey } = useJourney();
    const journeyId =
        journey?.id === 'health' || journey?.id === 'care' || journey?.id === 'plan' ? journey.id : undefined;
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    // Handles checkbox change
    const handleCheckboxChange = useCallback((optionId: string) => {
        setSelectedOptions((prevOptions) => {
            if (prevOptions.includes(optionId)) {
                return prevOptions.filter((id) => id !== optionId);
            } else {
                return [...prevOptions, optionId];
            }
        });
    }, []);

    // Handles the 'Apply' button click to apply the selected filters.
    const handleApply = (): void => {
        onApply(selectedOptions);
        onClose();
    };

    // Handles the 'Cancel' button click to close the modal without applying filters.
    const handleCancel = (): void => {
        onClose();
    };

    return (
        // Renders a Modal component with a title and close button.
        <Modal visible={visible} onClose={onClose} title={title} journey={journeyId}>
            {/* Renders a list of Checkbox components for each filter option. */}
            {options &&
                options.map((option) => (
                    <Checkbox
                        key={option.id}
                        id={option.id}
                        name="filter-option"
                        value={option.id}
                        label={option.label}
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                        journey={journeyId}
                    />
                ))}

            {/* Renders 'Apply' and 'Cancel' buttons. */}
            <Button onPress={handleApply} journey={journeyId}>
                Apply
            </Button>
            <Button variant="secondary" onPress={handleCancel} journey={journeyId}>
                Cancel
            </Button>
        </Modal>
    );
};
