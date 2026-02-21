import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16

import { Dashboard } from '../screens/health/Dashboard';
import { MedicalHistoryScreen } from '../screens/health/MedicalHistory';
import { HealthGoalsScreen } from '../screens/health/HealthGoals';
import { DeviceConnectionScreen } from '../screens/health/DeviceConnection';
import { MetricDetail } from '../screens/health/MetricDetail';
import { AddMetricScreen } from '../screens/health/AddMetric';
import MedicationList from '../screens/health/MedicationList';
import MedicationAdd from '../screens/health/MedicationAdd';
import MedicationDetail from '../screens/health/MedicationDetail';
import MedicationSearch from '../screens/health/MedicationSearch';
import { MedicationReminderScreen } from '../screens/health/MedicationReminder';
import { MedicationAlarmScreen } from '../screens/health/MedicationAlarm';
import { MedicationCalendar } from '../screens/health/MedicationCalendar';
import { MedicationEmpty } from '../screens/health/MedicationEmpty';
import { MedicationAddConfirmation } from '../screens/health/MedicationAddConfirmation';
import { MedicationDoseTaken } from '../screens/health/MedicationDoseTaken';
import { MedicationDoseMissed } from '../screens/health/MedicationDoseMissed';
import { MedicationEdit } from '../screens/health/MedicationEdit';
import { MedicationDeleteConfirm } from '../screens/health/MedicationDeleteConfirm';
import { MedicationAdherence } from '../screens/health/MedicationAdherence';
import { MedicationMonthlyReport } from '../screens/health/MedicationMonthlyReport';
import { MedicationRefillReminder } from '../screens/health/MedicationRefillReminder';
import { MedicationDrugInteraction } from '../screens/health/MedicationDrugInteraction';
import { MedicationSideEffectsLog } from '../screens/health/MedicationSideEffectsLog';
import { MedicationSideEffectForm } from '../screens/health/MedicationSideEffectForm';
import { MedicationPharmacyLocator } from '../screens/health/MedicationPharmacyLocator';
import { MedicationPrescriptionPhoto } from '../screens/health/MedicationPrescriptionPhoto';
import { MedicationOCRReview } from '../screens/health/MedicationOCRReview';
import { MedicationShareCaregiver } from '../screens/health/MedicationShareCaregiver';
import { MedicationCaregiverAccess } from '../screens/health/MedicationCaregiverAccess';
import { MedicationExport } from '../screens/health/MedicationExport';
import { ROUTES } from '../constants/routes';
import { JOURNEY_COLORS } from '../constants/journeys';

// LD1: Creates a Stack Navigator using createStackNavigator from React Navigation.
const Stack = createStackNavigator();

// LD1: Defines the stack navigator for the My Health journey.
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
      {/* LD1: Defines the screens within the My Health journey, associating each screen component with a route name. */}
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
    </Stack.Navigator>
  );
}