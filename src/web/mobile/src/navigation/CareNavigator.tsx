import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16
import type { CareStackParamList } from './types';

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
import DoctorReviewsScreen from '../screens/care/DoctorReviews';
import AppointmentTypeScreen from '../screens/care/AppointmentType';
import BookingReasonForVisitScreen from '../screens/care/BookingReasonForVisit';
import BookingDocumentsScreen from '../screens/care/BookingDocuments';
import BookingInsuranceScreen from '../screens/care/BookingInsurance';
import BookingSuccessScreen from '../screens/care/BookingSuccess';
import AppointmentsListScreen from '../screens/care/AppointmentsList';
import AppointmentRescheduleScreen from '../screens/care/AppointmentReschedule';
import AppointmentCancelScreen from '../screens/care/AppointmentCancel';
import AppointmentCancelledScreen from '../screens/care/AppointmentCancelled';
import AppointmentNoShowScreen from '../screens/care/AppointmentNoShow';
import PreVisitChecklistScreen from '../screens/care/PreVisitChecklist';
import RateVisitScreen from '../screens/care/RateVisit';
import SavedDoctorsScreen from '../screens/care/SavedDoctors';
import TelemedicineConnectingScreen from '../screens/care/TelemedicineConnecting';
import TelemedicineControlsScreen from '../screens/care/TelemedicineControls';
import TelemedicineChatOverlayScreen from '../screens/care/TelemedicineChatOverlay';
import TelemedicineScreenShareScreen from '../screens/care/TelemedicineScreenShare';
import TelemedicineEndScreen from '../screens/care/TelemedicineEndScreen';
import VisitSummaryScreen from '../screens/care/VisitSummary';
import VisitPrescriptionsScreen from '../screens/care/VisitPrescriptions';
import VisitFollowUpScreen from '../screens/care/VisitFollowUp';
import VisitLabOrdersScreen from '../screens/care/VisitLabOrders';
import VisitReferralScreen from '../screens/care/VisitReferral';
import PaymentSummaryScreen from '../screens/care/PaymentSummary';
import PaymentReceiptScreen from '../screens/care/PaymentReceipt';
import AsyncDoctorChatScreen from '../screens/care/AsyncDoctorChat';
import MedicalRecordsAccessScreen from '../screens/care/MedicalRecordsAccess';
import { ROUTES } from '../constants/routes';
import { JOURNEY_COLORS } from '../constants/journeys';

// LD1: Creates a Stack Navigator using createStackNavigator from React Navigation.
const Stack = createStackNavigator<CareStackParamList>();

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
      {/* W11 — Consultation Deep */}
      <Stack.Screen name={ROUTES.CARE_DOCTOR_REVIEWS} component={DoctorReviewsScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_TYPE} component={AppointmentTypeScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_REASON} component={BookingReasonForVisitScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_DOCUMENTS} component={BookingDocumentsScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_INSURANCE} component={BookingInsuranceScreen} />
      <Stack.Screen name={ROUTES.CARE_BOOKING_SUCCESS} component={BookingSuccessScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENTS_LIST} component={AppointmentsListScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_RESCHEDULE} component={AppointmentRescheduleScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_CANCEL} component={AppointmentCancelScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_CANCELLED} component={AppointmentCancelledScreen} />
      <Stack.Screen name={ROUTES.CARE_APPOINTMENT_NO_SHOW} component={AppointmentNoShowScreen} />
      <Stack.Screen name={ROUTES.CARE_PRE_VISIT_CHECKLIST} component={PreVisitChecklistScreen} />
      <Stack.Screen name={ROUTES.CARE_RATE_VISIT} component={RateVisitScreen} />
      <Stack.Screen name={ROUTES.CARE_SAVED_DOCTORS} component={SavedDoctorsScreen} />
      {/* W12 — Telemedicine Deep */}
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE_CONNECTING} component={TelemedicineConnectingScreen} />
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE_CONTROLS} component={TelemedicineControlsScreen} />
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE_CHAT} component={TelemedicineChatOverlayScreen} />
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE_SCREEN_SHARE} component={TelemedicineScreenShareScreen} />
      <Stack.Screen name={ROUTES.CARE_TELEMEDICINE_END} component={TelemedicineEndScreen} />
      {/* W12 — Post-Visit */}
      <Stack.Screen name={ROUTES.CARE_VISIT_SUMMARY} component={VisitSummaryScreen} />
      <Stack.Screen name={ROUTES.CARE_VISIT_PRESCRIPTIONS} component={VisitPrescriptionsScreen} />
      <Stack.Screen name={ROUTES.CARE_VISIT_FOLLOW_UP} component={VisitFollowUpScreen} />
      <Stack.Screen name={ROUTES.CARE_VISIT_LAB_ORDERS} component={VisitLabOrdersScreen} />
      <Stack.Screen name={ROUTES.CARE_VISIT_REFERRAL} component={VisitReferralScreen} />
      {/* W12 — Payment + Records */}
      <Stack.Screen name={ROUTES.CARE_PAYMENT_SUMMARY} component={PaymentSummaryScreen} />
      <Stack.Screen name={ROUTES.CARE_PAYMENT_RECEIPT} component={PaymentReceiptScreen} />
      <Stack.Screen name={ROUTES.CARE_ASYNC_DOCTOR_CHAT} component={AsyncDoctorChatScreen} />
      <Stack.Screen name={ROUTES.CARE_MEDICAL_RECORDS} component={MedicalRecordsAccessScreen} />
    </Stack.Navigator>
  );
}
