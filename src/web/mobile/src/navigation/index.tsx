import { AuthNavigator } from './AuthNavigator'; // src/web/mobile/src/navigation/AuthNavigator.tsx
import CareNavigator from './CareNavigator'; // src/web/mobile/src/navigation/CareNavigator.tsx
import GamificationNavigator from './GamificationNavigator'; // src/web/mobile/src/navigation/GamificationNavigator.tsx
import HealthNavigator from './HealthNavigator'; // src/web/mobile/src/navigation/HealthNavigator.tsx
import { MainNavigator } from './MainNavigator'; // src/web/mobile/src/navigation/MainNavigator.tsx
import { PlanNavigator } from './PlanNavigator'; // src/web/mobile/src/navigation/PlanNavigator.tsx
import { RootNavigator } from './RootNavigator'; // src/web/mobile/src/navigation/RootNavigator.tsx
import WellnessNavigator from './WellnessNavigator'; // src/web/mobile/src/navigation/WellnessNavigator.tsx

// IE3: Be generous about your exports so long as it doesn't create a security risk.
export {
    AuthNavigator, // Navigation component for authentication flow.
    CareNavigator, // Navigation component for the Care Now journey.
    GamificationNavigator, // Navigation component for the Gamification journey.
    HealthNavigator, // Navigation component for the My Health journey.
    MainNavigator, // Navigation component for the main app flow (after authentication).
    PlanNavigator, // Navigation component for the My Plan & Benefits journey.
    RootNavigator, // Root navigation component that determines whether to show the auth flow or the main app.
    WellnessNavigator, // Navigation component for the AI Wellness Companion journey (Module 06).
};
