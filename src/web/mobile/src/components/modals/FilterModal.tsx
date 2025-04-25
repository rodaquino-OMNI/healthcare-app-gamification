import React, { useState, useCallback } from 'react';
import { Modal, ModalProps } from 'src/web/design-system/src/components/Modal/Modal.tsx'; // version: that is compatible with the design system
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx'; // version: that is compatible with the design system
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox.tsx'; // version: that is compatible with the design system
import { RadioButton } from 'src/web/design-system/src/components/RadioButton/RadioButton.tsx'; // version: that is compatible with the design system
import { JourneyContext } from 'src/web/mobile/src/context/JourneyContext.tsx';
import { useI18n } from 'src/web/mobile/src/i18n/index.ts'; // i18next version: v23.0.0
import { FilterOption } from 'src/web/shared/types/index.ts';

/**
 * Props interface for the FilterModal component.
 * @property {boolean} visible - A boolean indicating whether the modal is visible.
 * @property {() => void} onClose - A callback function that is called when the modal is closed.
 * @property {(selectedOptions: FilterOption[]) => void} onApply - A callback function that is called when the filter options are applied.
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
export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  options,
  title,
}) => {
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
  const handleOptionChange = useCallback(
    (option: FilterOption) => {
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
    },
    []
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t(title)}
      journey={journey}
    >
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
              journey={journey}
            />
          ) : (
            <RadioButton
              id={option.id}
              name={option.name}
              value={option.value}
              checked={!!selectedOptions.find((o) => o.id === option.id)}
              onChange={() => handleOptionChange(option)}
              label={t(option.label)}
              journey={journey}
            />
          )}
        </React.Fragment>
      ))}

      {/* Apply and Cancel buttons */}
      <Button onPress={handleApply} journey={journey}>
        {t('common.buttons.save')}
      </Button>
      <Button variant="secondary" onPress={onClose} journey={journey}>
        {t('common.buttons.cancel')}
      </Button>
    </Modal>
  );
};