/**
 * @file SymptomSelector component index
 * Re-exports the SymptomSelector component and styled components for the Care journey
 * This component allows users to input symptoms as part of the Care Now journey's
 * symptom checker feature (F-102-RQ-001).
 */

// Import the main component
import SymptomSelector from './SymptomSelector';

// Import styled components
import { SymptomSelectorContainer, SymptomList, SymptomItem, SymptomLabel } from './SymptomSelector.styles';

// Export styled components for custom styling and extension
export { SymptomSelectorContainer, SymptomList, SymptomItem, SymptomLabel };

// Export the main component as default
export default SymptomSelector;
