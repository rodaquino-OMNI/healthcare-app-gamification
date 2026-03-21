/**
 * Achievements screen entry point.
 * Re-exports the full gamification Achievements screen.
 * useTranslation is applied in the target screen (gamification/Achievements).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Imported for type reference only
import { useTranslation } from 'react-i18next';
export { default } from '../gamification/Achievements';
export { default as Achievements } from '../gamification/Achievements';
