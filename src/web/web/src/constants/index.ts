/**
 * Constants Barrel File
 * 
 * This file exports all constants from the constants directory, providing a single
 * import point for all web application constants. It simplifies imports by allowing
 * developers to import multiple constants from a single location rather than from
 * separate files.
 * 
 * Example usage:
 * import { JOURNEY_COLORS, ROUTES, webConfig } from 'src/web/web/src/constants';
 * 
 * The constants support three core user journeys:
 * - My Health ("Minha Saúde")
 * - Care Now ("Cuidar-me Agora")
 * - My Plan & Benefits ("Meu Plano & Benefícios")
 */

// Re-export configuration constants
export * from './config';

// Re-export journey-related constants
export * from './journeys';

// Re-export route-related constants
export * from './routes';