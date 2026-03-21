import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16
import React from 'react'; // version 18.2.0

import {
    CycleTrackingNavigator,
    SleepNavigator,
    ActivityNavigator,
    NutritionNavigator,
    WellnessResourcesNavigator,
} from './health';
import type { HealthStackParamList } from './types';
import { JOURNEY_COLORS } from '../constants/journeys';
import { ROUTES } from '../constants/routes';
import { AddMetricScreen } from '../screens/health/AddMetric';
import { AssessmentWizard } from '../screens/health/assessment';
import { Dashboard } from '../screens/health/Dashboard';
import { DeviceConnection as DeviceConnectionScreen } from '../screens/health/DeviceConnection';
import HealthGoalsScreen from '../screens/health/HealthGoals';
import MedicalHistoryScreen from '../screens/health/MedicalHistory';
import MedicationAdd from '../screens/health/MedicationAdd';
import { MedicationAddConfirmation } from '../screens/health/MedicationAddConfirmation';
import { MedicationAdherence } from '../screens/health/MedicationAdherence';
import { MedicationAlarmScreen } from '../screens/health/MedicationAlarm';
import { MedicationCalendar } from '../screens/health/MedicationCalendar';
import { MedicationCaregiverAccess } from '../screens/health/MedicationCaregiverAccess';
import { MedicationDeleteConfirm } from '../screens/health/MedicationDeleteConfirm';
import MedicationDetail from '../screens/health/MedicationDetail';
import { MedicationDoseMissed } from '../screens/health/MedicationDoseMissed';
import { MedicationDoseTaken } from '../screens/health/MedicationDoseTaken';
import { MedicationDrugInteraction } from '../screens/health/MedicationDrugInteraction';
import { MedicationEdit } from '../screens/health/MedicationEdit';
import { MedicationEmpty } from '../screens/health/MedicationEmpty';
import { MedicationExport } from '../screens/health/MedicationExport';
import MedicationList from '../screens/health/MedicationList';
import { MedicationMonthlyReport } from '../screens/health/MedicationMonthlyReport';
import { MedicationOCRReview } from '../screens/health/MedicationOCRReview';
import { MedicationPharmacyLocator } from '../screens/health/MedicationPharmacyLocator';
import { MedicationPrescriptionPhoto } from '../screens/health/MedicationPrescriptionPhoto';
import { MedicationRefillReminder } from '../screens/health/MedicationRefillReminder';
import { MedicationReminderScreen } from '../screens/health/MedicationReminder';
import MedicationSearch from '../screens/health/MedicationSearch';
import { MedicationShareCaregiver } from '../screens/health/MedicationShareCaregiver';
import { MedicationSideEffectForm } from '../screens/health/MedicationSideEffectForm';
import { MedicationSideEffectsLog } from '../screens/health/MedicationSideEffectsLog';
import { MetricDetail } from '../screens/health/MetricDetail';

// Sub-navigators (Cycle Tracking, Sleep, Activity, Nutrition, Wellness Resources)

// LD1: Creates a Stack Navigator using createStackNavigator from React Navigation.
const Stack = createStackNavigator<HealthStackParamList>();

// LD1: Defines the stack navigator for the My Health journey.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
export default function HealthNavigator() {
    // LD1: Renders the Stack Navigator with the defined screens.
    return (
        <Stack.Navigator
            initialRouteName={ROUTES.HEALTH_DASHBOARD}
            screenOptions={{
                headerShown: false, // LD1: Configures the navigator with health journey-specific styling (green theme).
                cardStyle: { backgroundColor: JOURNEY_COLORS.MyHealth },
            }}
        >
            {/* LD1: Defines the screens within the My Health journey,
                associating each screen component with a route name. */}
            <Stack.Screen name={ROUTES.HEALTH_DASHBOARD} component={Dashboard} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICAL_HISTORY} component={MedicalHistoryScreen} />
            <Stack.Screen name={ROUTES.HEALTH_HEALTH_GOALS} component={HealthGoalsScreen} />
            <Stack.Screen name={ROUTES.HEALTH_DEVICE_CONNECTION} component={DeviceConnectionScreen} />
            <Stack.Screen name={ROUTES.HEALTH_METRIC_DETAIL} component={MetricDetail} />
            <Stack.Screen name={ROUTES.HEALTH_ADD_METRIC} component={AddMetricScreen} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_LIST} component={MedicationList} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_ADD} component={MedicationAdd} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_DETAIL} component={MedicationDetail} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_SEARCH} component={MedicationSearch} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_REMINDER} component={MedicationReminderScreen} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_ALARM} component={MedicationAlarmScreen} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_CALENDAR} component={MedicationCalendar} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_EMPTY} component={MedicationEmpty} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_ADD_CONFIRMATION} component={MedicationAddConfirmation} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_DOSE_TAKEN} component={MedicationDoseTaken} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_DOSE_MISSED} component={MedicationDoseMissed} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_EDIT} component={MedicationEdit} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_DELETE_CONFIRM} component={MedicationDeleteConfirm} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_ADHERENCE} component={MedicationAdherence} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_MONTHLY_REPORT} component={MedicationMonthlyReport} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_REFILL_REMINDER} component={MedicationRefillReminder} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_DRUG_INTERACTION} component={MedicationDrugInteraction} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_SIDE_EFFECTS_LOG} component={MedicationSideEffectsLog} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_SIDE_EFFECT_FORM} component={MedicationSideEffectForm} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_PHARMACY_LOCATOR} component={MedicationPharmacyLocator} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_PRESCRIPTION_PHOTO} component={MedicationPrescriptionPhoto} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_OCR_REVIEW} component={MedicationOCRReview} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_SHARE_CAREGIVER} component={MedicationShareCaregiver} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_CAREGIVER_ACCESS} component={MedicationCaregiverAccess} />
            <Stack.Screen name={ROUTES.HEALTH_MEDICATION_EXPORT} component={MedicationExport} />
            <Stack.Screen name={ROUTES.HEALTH_ASSESSMENT_WIZARD} component={AssessmentWizard} />
            {/* Sub-navigators */}
            <Stack.Screen name="CycleTracking" component={CycleTrackingNavigator} />
            <Stack.Screen name="Sleep" component={SleepNavigator} />
            <Stack.Screen name="Activity" component={ActivityNavigator} />
            <Stack.Screen name="Nutrition" component={NutritionNavigator} />
            <Stack.Screen name="WellnessResources" component={WellnessResourcesNavigator} />
        </Stack.Navigator>
    );
}
