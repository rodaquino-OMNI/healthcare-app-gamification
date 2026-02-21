import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16

import { Dashboard } from '../screens/care/Dashboard';
import { AppointmentDetail } from '../screens/care/AppointmentDetail';
import ProviderSearchScreen from '../screens/care/ProviderSearch';
import SymptomChecker from '../screens/care/SymptomChecker';
import { Telemedicine } from '../screens/care/Telemedicine';
import { TreatmentPlanScreen } from '../screens/care/TreatmentPlan';
import SymptomBodyMap from '../screens/care/SymptomBodyMap';
import SymptomDetail from '../screens/care/SymptomDetail';
import SymptomSeverity from '../screens/care/SymptomSeverity';
import SymptomQuestions from '../screens/care/SymptomQuestions';
import SymptomResult from '../screens/care/SymptomResult';
import SymptomRecommendation from '../screens/care/SymptomRecommendation';
import SymptomBodyMapBack from '../screens/care/SymptomBodyMapBack';
import SymptomHeadDetail from '../screens/care/SymptomHeadDetail';
import SymptomPhotoUpload from '../screens/care/SymptomPhotoUpload';
import SymptomMedicalHistory from '../screens/care/SymptomMedicalHistory';
import SymptomMedicationContext from '../screens/care/SymptomMedicationContext';
import SymptomVitals from '../screens/care/SymptomVitals';
import SymptomAnalyzing from '../screens/care/SymptomAnalyzing';
import SymptomConditionsList from '../screens/care/SymptomConditionsList';
import SymptomConditionDetail from '../screens/care/SymptomConditionDetail';
import SymptomSelfCare from '../screens/care/SymptomSelfCare';
import SymptomEmergencyWarning from '../screens/care/SymptomEmergencyWarning';
import SymptomBookAppointment from '../screens/care/SymptomBookAppointment';
import SymptomERLocator from '../screens/care/SymptomERLocator';
import SymptomSaveReport from '../screens/care/SymptomSaveReport';
import SymptomShareReport from '../screens/care/SymptomShareReport';
import SymptomHistory from '../screens/care/SymptomHistory';
import SymptomHistoryDetail from '../screens/care/SymptomHistoryDetail';
import SymptomAccuracyRating from '../screens/care/SymptomAccuracyRating';
import SymptomFollowUp from '../screens/care/SymptomFollowUp';
import SymptomDiary from '../screens/care/SymptomDiary';
import SymptomComparison from '../screens/care/SymptomComparison';
import DoctorSearchScreen from '../screens/care/DoctorSearch';
import DoctorFiltersScreen from '../screens/care/DoctorFilters';
import DoctorProfileScreen from '../screens/care/DoctorProfile';
import DoctorAvailabilityScreen from '../screens/care/DoctorAvailability';
import BookingScheduleScreen from '../screens/care/BookingSchedule';
import BookingConfirmationScreen from '../screens/care/BookingConfirmation';
import WaitingRoomScreen from '../screens/care/WaitingRoom';
import { ROUTES } from '../constants/routes';
import { JOURNEY_COLORS } from '../constants/journeys';

// LD1: Creates a Stack Navigator using createStackNavigator from React Navigation.
const Stack = createStackNavigator();

// LD1: Defines the stack navigator for the Care Now journey.
export default function CareNavigator() {
  // LD1: Renders the Stack Navigator with the defined screens.
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.CARE_DASHBOARD}
      screenOptions={{
        headerShown: false, // LD1: Configures the navigator with care journey-specific styling (orange theme).
        cardStyle: { backgroundColor: JOURNEY_COLORS.CareNow },
      }}
    >
      {/* LD1: Defines the screens within the Care Now journey, associating each screen component with a route name. */}
      <Stack.Screen name={ROUTES.CARE_DASHBOARD} component={Dashboard} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENTS} component={AppointmentDetail} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_BOOKING} component={ProviderSearchScreen} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_CHECKER} component={SymptomChecker} />
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE} component={Telemedicine} />
      <Stack.Screen name={ROUTES.CARE_MEDICATION_TRACKING} component={TreatmentPlanScreen} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_BODY_MAP} component={SymptomBodyMap} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_DETAIL} component={SymptomDetail} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_SEVERITY} component={SymptomSeverity} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_QUESTIONS} component={SymptomQuestions} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_RESULT} component={SymptomResult} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_RECOMMENDATION} component={SymptomRecommendation} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_BODY_MAP_BACK} component={SymptomBodyMapBack} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_HEAD_DETAIL} component={SymptomHeadDetail} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_PHOTO_UPLOAD} component={SymptomPhotoUpload} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_MEDICAL_HISTORY} component={SymptomMedicalHistory} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_MEDICATION_CONTEXT} component={SymptomMedicationContext} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_VITALS} component={SymptomVitals} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_ANALYZING} component={SymptomAnalyzing} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_CONDITIONS_LIST} component={SymptomConditionsList} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_CONDITION_DETAIL} component={SymptomConditionDetail} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_SELF_CARE} component={SymptomSelfCare} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_EMERGENCY_WARNING} component={SymptomEmergencyWarning} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_BOOK_APPOINTMENT} component={SymptomBookAppointment} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_ER_LOCATOR} component={SymptomERLocator} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_SAVE_REPORT} component={SymptomSaveReport} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_SHARE_REPORT} component={SymptomShareReport} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_HISTORY} component={SymptomHistory} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_HISTORY_DETAIL} component={SymptomHistoryDetail} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_ACCURACY_RATING} component={SymptomAccuracyRating} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_FOLLOW_UP} component={SymptomFollowUp} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_DIARY} component={SymptomDiary} />
      <Stack.Screen name={ROUTES.CARE_SYMPTOM_COMPARISON} component={SymptomComparison} />
      <Stack.Screen name={ROUTES.CARE_DOCTOR_SEARCH} component={DoctorSearchScreen} />
      <Stack.Screen name={ROUTES.CARE_DOCTOR_FILTERS} component={DoctorFiltersScreen} />
      <Stack.Screen name={ROUTES.CARE_DOCTOR_PROFILE} component={DoctorProfileScreen} />
      <Stack.Screen name={ROUTES.CARE_DOCTOR_AVAILABILITY} component={DoctorAvailabilityScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_SCHEDULE} component={BookingScheduleScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_CONFIRMATION} component={BookingConfirmationScreen} />
      <Stack.Screen name={ROUTES.CARE_WAITING_ROOM} component={WaitingRoomScreen} />
    </Stack.Navigator>
  );
}
