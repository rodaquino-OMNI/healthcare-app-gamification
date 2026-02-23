/**
 * Navigation type definitions for the AUSTA SuperApp mobile app.
 * Provides typed ParamList for all 8 navigators + utility types.
 *
 * Usage:
 *   import { CareStackParamList } from '../navigation/types';
 *   type Props = NativeStackScreenProps<CareStackParamList, 'CareDoctorProfile'>;
 */

import type {
  NavigatorScreenParams,
  CompositeNavigationProp,
} from '@react-navigation/native';
import type {
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// ---------------------------------------------------------------------------
// Auth Stack
// ---------------------------------------------------------------------------

export type AuthStackParamList = {
  // Welcome & Onboarding (local ROUTES constants)
  AuthWelcome: undefined;
  AuthOnboarding: undefined;
  AuthWelcomeCTA: undefined;
  // Core auth screens (unified ROUTES constants)
  AuthLogin: undefined;
  AuthRegister: undefined;
  AuthForgotPassword: undefined;
  AuthMFA: undefined;
  AuthEmailVerify: undefined;
  AuthSetPassword: undefined;
  // Social
  AuthSocial: undefined;
  // Personalization
  AuthPersonalizationIntro: undefined;
  AuthGoalSelection: undefined;
  AuthOnboardingConfirmation: undefined;
  // Profile setup (registered in auth flow)
  ProfileSetup: undefined;
  ProfileHealth: undefined;
  ProfileInsurance: undefined;
  ProfileAddress: undefined;
  ProfileDocuments: undefined;
  ProfilePhoto: undefined;
  ProfileConfirmation: undefined;
};

// ---------------------------------------------------------------------------
// Home Stack (nested inside the Home tab)
// ---------------------------------------------------------------------------

export type HomeStackParamList = {
  HomeMain: undefined;
  HomeMetrics: undefined;
  HomeAlert: undefined;
  NotificationDetail: { notificationId: string };
  Search: undefined;
  SearchResults: { query?: string };
  HomeWeeklySummary: undefined;
  HomeBottomSheet: undefined;
  HomeMedicationReminders: undefined;
  HomeAppointmentWidget: undefined;
  HomeHealthTips: undefined;
  HomeEmpty: undefined;
  NotificationUnread: undefined;
  NotificationCategoryFilter: undefined;
  NotificationEmpty: undefined;
  NotificationSettings: undefined;
  SearchDoctorResults: { query?: string };
  SearchArticleResults: { query?: string };
  SearchMedicationResults: { query?: string };
  SearchNoResults: { query?: string };
};

// ---------------------------------------------------------------------------
// Care Stack
// ---------------------------------------------------------------------------

export type CareStackParamList = {
  // Core
  CareDashboard: undefined;
  CareAppointments: { appointmentId?: string };
  CareAppointmentBooking: undefined;
  CareTelemedicine: { sessionId?: string };
  CareMedicationTracking: undefined;
  // Symptom checker flow
  CareSymptomChecker: { symptoms?: string[]; sessionId?: string };
  CareSymptomBodyMap: { symptoms?: string[]; sessionId?: string };
  CareSymptomDetail: { symptomId: string; sessionId?: string };
  CareSymptomSeverity: { symptoms?: string[]; sessionId?: string };
  CareSymptomQuestions: { symptoms?: string[]; sessionId?: string };
  CareSymptomResult: { sessionId?: string };
  CareSymptomRecommendation: { sessionId?: string };
  // Symptom checker deep
  CareSymptomBodyMapBack: { symptoms?: string[]; sessionId?: string };
  CareSymptomHeadDetail: { symptoms?: string[]; sessionId?: string };
  CareSymptomPhotoUpload: { sessionId?: string };
  CareSymptomMedicalHistory: { sessionId?: string };
  CareSymptomMedicationContext: { sessionId?: string };
  CareSymptomVitals: { sessionId?: string };
  CareSymptomAnalyzing: { sessionId?: string };
  CareSymptomConditionsList: { sessionId?: string };
  CareSymptomConditionDetail: { conditionId: string; sessionId?: string };
  CareSymptomSelfCare: { sessionId?: string };
  CareSymptomEmergencyWarning: { sessionId?: string };
  CareSymptomBookAppointment: { sessionId?: string };
  CareSymptomERLocator: { sessionId?: string };
  CareSymptomSaveReport: { sessionId?: string };
  CareSymptomShareReport: { sessionId?: string };
  CareSymptomHistory: undefined;
  CareSymptomHistoryDetail: { sessionId: string };
  CareSymptomAccuracyRating: { sessionId: string };
  CareSymptomFollowUp: { sessionId?: string };
  CareSymptomDiary: undefined;
  CareSymptomComparison: undefined;
  // Doctor search & booking
  CareDoctorSearch: undefined;
  CareDoctorFilters: undefined;
  CareDoctorProfile: { doctorId: string };
  CareDoctorAvailability: { doctorId: string };
  CareBookingSchedule: { doctorId: string; date?: string; time?: string };
  CareBookingConfirmation: { doctorId: string; appointmentId?: string };
  CareWaitingRoom: { appointmentId: string };
  // Consultation deep
  CareDoctorReviews: { doctorId: string };
  CareAppointmentType: undefined;
  CareBookingReason: undefined;
  CareBookingDocuments: undefined;
  CareBookingInsurance: undefined;
  CareBookingSuccess: { appointmentId?: string };
  CareAppointmentsList: undefined;
  CareAppointmentReschedule: { appointmentId: string };
  CareAppointmentCancel: { appointmentId: string };
  CareAppointmentCancelled: { appointmentId?: string };
  CareAppointmentNoShow: { appointmentId?: string };
  CarePreVisitChecklist: { appointmentId: string };
  CareRateVisit: { appointmentId: string };
  CareSavedDoctors: undefined;
  // Telemedicine deep
  CareTelemedicineConnecting: { sessionId?: string };
  CareTelemedicineControls: { sessionId?: string };
  CareTelemedicineChat: { sessionId?: string };
  CareTelemedicineScreenShare: { sessionId?: string };
  CareTelemedicineEnd: { sessionId?: string };
  // Post-visit
  CareVisitSummary: { visitId?: string };
  CareVisitPrescriptions: { visitId?: string };
  CareVisitFollowUp: { visitId?: string };
  CareVisitLabOrders: { visitId?: string };
  CareVisitReferral: { visitId?: string };
  // Payment
  CarePaymentSummary: { appointmentId?: string };
  CarePaymentReceipt: { paymentId?: string };
  // Records
  CareAsyncDoctorChat: { doctorId?: string };
  CareMedicalRecords: undefined;
};

// ---------------------------------------------------------------------------
// Health Stack
// ---------------------------------------------------------------------------

export type HealthStackParamList = {
  // Core
  HealthDashboard: undefined;
  HealthMedicalHistory: undefined;
  HealthGoals: undefined;
  HealthDeviceConnection: undefined;
  HealthMetricDetail: { metricType: string };
  HealthAddMetric: undefined;
  HealthAssessmentWizard: undefined;
  // Medication core
  HealthMedicationList: undefined;
  HealthMedicationAdd: undefined;
  HealthMedicationDetail: { medicationId: string };
  HealthMedicationSearch: undefined;
  HealthMedicationReminder: { medicationId?: string };
  HealthMedicationAlarm: { medicationId?: string };
  // Medication deep
  HealthMedicationCalendar: undefined;
  HealthMedicationEmpty: undefined;
  HealthMedicationAddConfirmation: { medicationId?: string };
  HealthMedicationDoseTaken: { medicationId: string };
  HealthMedicationDoseMissed: { medicationId: string };
  HealthMedicationEdit: { medicationId: string };
  HealthMedicationDeleteConfirm: { medicationId: string };
  HealthMedicationAdherence: { medicationId?: string };
  HealthMedicationMonthlyReport: { medicationId?: string };
  HealthMedicationRefillReminder: { medicationId?: string };
  HealthMedicationDrugInteraction: { medicationId?: string };
  HealthMedicationSideEffectsLog: { medicationId?: string };
  HealthMedicationSideEffectForm: { medicationId?: string };
  HealthMedicationPharmacyLocator: undefined;
  HealthMedicationPrescriptionPhoto: { medicationId?: string };
  HealthMedicationOCRReview: undefined;
  HealthMedicationShareCaregiver: { medicationId?: string };
  HealthMedicationCaregiverAccess: undefined;
  HealthMedicationExport: undefined;
  // Cycle tracking
  HealthCycleHome: undefined;
  HealthCycleCalendar: undefined;
  HealthCycleLogPeriod: undefined;
  HealthCycleLogSymptoms: undefined;
  HealthCycleLogFlow: undefined;
  HealthCycleFertility: undefined;
  HealthCyclePMS: undefined;
  HealthCycleHistory: undefined;
  HealthCycleAnalysis: undefined;
  HealthCycleInsights: undefined;
  HealthCycleArticleDetail: { articleId: string };
  HealthCycleReminders: undefined;
  HealthCyclePartnerSharing: undefined;
  HealthCycleSettings: undefined;
  HealthCycleExportReport: undefined;
  // Sleep Management
  HealthSleepHome: undefined;
  HealthSleepLog: undefined;
  HealthSleepQuality: undefined;
  HealthSleepDiary: undefined;
  HealthSleepTrends: undefined;
  HealthSleepGoals: undefined;
  HealthSleepDetail: { date: string };
  HealthSleepBedtimeRoutine: undefined;
  HealthSleepSmartAlarm: undefined;
  HealthSleepInsights: undefined;
  HealthSleepDeviceSync: undefined;
  HealthSleepExport: undefined;
};

// ---------------------------------------------------------------------------
// Plan Stack
// Note: PlanNavigator uses legacy `routes` (lowercase) values
// ---------------------------------------------------------------------------

export type PlanStackParamList = {
  PlanDashboard: undefined;
  Coverage: undefined;          // routes.COVERAGE = 'Coverage' (legacy)
  ClaimHistory: undefined;      // routes.CLAIMS = 'ClaimHistory' (legacy)
  ClaimDetail: { claimId: string };  // routes.CLAIM_DETAIL = 'ClaimDetail' (legacy)
  ClaimSubmission: undefined;   // routes.CLAIM_SUBMISSION = 'ClaimSubmission' (legacy)
  CostSimulator: undefined;     // routes.COST_SIMULATOR = 'CostSimulator' (legacy)
  DigitalCard: undefined;       // routes.DIGITAL_CARD = 'DigitalCard' (legacy)
  Benefits: undefined;          // routes.BENEFITS = 'Benefits' (legacy)
};

// ---------------------------------------------------------------------------
// Settings Stack
// ---------------------------------------------------------------------------

export type SettingsStackParamList = {
  SettingsMain: undefined;
  // Existing sub-screens (moved from HomeStack)
  SettingsEdit: undefined;
  SettingsNotifications: undefined;
  SettingsPrivacy: undefined;
  // Account & Security
  SettingsPersonalInfo: undefined;
  SettingsChangePassword: undefined;
  SettingsTwoFactor: undefined;
  SettingsBiometric: undefined;
  // Data Management
  SettingsDataExport: undefined;
  SettingsDeleteAccount: undefined;
  SettingsDeleteConfirm: undefined;
  // Preferences
  SettingsLanguage: undefined;
  SettingsTheme: undefined;
  SettingsAccessibility: undefined;
  // Devices
  SettingsConnectedDevices: undefined;
  // Health Plan
  SettingsHealthPlan: undefined;
  SettingsInsuranceDocs: undefined;
  SettingsDependents: undefined;
  SettingsAddDependent: undefined;
  // Contacts & Addresses
  SettingsEmergencyContacts: undefined;
  SettingsAddresses: undefined;
  SettingsAddAddress: undefined;
  // Legal & Info
  SettingsTerms: undefined;
  SettingsPrivacyPolicy: undefined;
  SettingsAbout: undefined;
  // Session
  SettingsLogout: undefined;
  SettingsFeedback: undefined;
  // Help Center
  HelpHome: undefined;
  HelpFAQCategory: { categoryId: string };
  HelpFAQDetail: { faqId: string };
  HelpContact: undefined;
  HelpChat: undefined;
  HelpReport: undefined;
};

// ---------------------------------------------------------------------------
// Gamification Stack
// ---------------------------------------------------------------------------

export type GamificationStackParamList = {
  GamificationAchievements: undefined;
  GamificationAchievementDetail: { achievementId: string };
  GamificationLeaderboard: undefined;
  GamificationQuests: undefined;
  GamificationQuestDetail: { questId: string };
  GamificationRewards: undefined;
  GamificationRewardDetail: { rewardId: string };
};

// ---------------------------------------------------------------------------
// AI Wellness Companion (Module 06)
// ---------------------------------------------------------------------------

export type WellnessStackParamList = {
  WellnessChat: undefined;
  WellnessChatActive: undefined;
  WellnessQuickReplies: undefined;
  WellnessMoodCheckIn: undefined;
  WellnessTipDetail: { tipId: string };
  WellnessBreathing: undefined;
  WellnessMeditation: undefined;
  WellnessDailyPlan: undefined;
  WellnessInsights: undefined;
  WellnessGoals: undefined;
  WellnessJournal: undefined;
  WellnessJournalHistory: undefined;
  WellnessChallenges: undefined;
  WellnessChallengeDetail: { challengeId: string };
  WellnessStreaks: undefined;
};

export type WellnessNavigationProp = StackNavigationProp<WellnessStackParamList>;

export type WellnessScreenProps<T extends keyof WellnessStackParamList> =
  StackScreenProps<WellnessStackParamList, T>;

// ---------------------------------------------------------------------------
// Main Tab (bottom tab navigator)
// ---------------------------------------------------------------------------

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Health: NavigatorScreenParams<HealthStackParamList>;
  Care: NavigatorScreenParams<CareStackParamList>;
  Plan: NavigatorScreenParams<PlanStackParamList>;
  Notifications: undefined;
  Profile: undefined;
  Achievements: NavigatorScreenParams<GamificationStackParamList>;
  Wellness: NavigatorScreenParams<WellnessStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// ---------------------------------------------------------------------------
// Root Stack (auth gate — combines Auth + Main)
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// ---------------------------------------------------------------------------
// NavigationProp utility types
// ---------------------------------------------------------------------------

export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type HomeNavigationProp = StackNavigationProp<HomeStackParamList>;
export type CareNavigationProp = StackNavigationProp<CareStackParamList>;
export type HealthNavigationProp = StackNavigationProp<HealthStackParamList>;
export type PlanNavigationProp = StackNavigationProp<PlanStackParamList>;
export type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList>;
export type GamificationNavigationProp = StackNavigationProp<GamificationStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

/** Composite navigation prop for screens inside the Home tab stack. */
export type HomeTabScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

// ---------------------------------------------------------------------------
// ScreenProps utility types (convenience — one import for props + route)
// ---------------------------------------------------------------------------

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  StackScreenProps<HomeStackParamList, T>;

export type CareScreenProps<T extends keyof CareStackParamList> =
  StackScreenProps<CareStackParamList, T>;

export type HealthScreenProps<T extends keyof HealthStackParamList> =
  StackScreenProps<HealthStackParamList, T>;

export type PlanScreenProps<T extends keyof PlanStackParamList> =
  StackScreenProps<PlanStackParamList, T>;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> =
  StackScreenProps<SettingsStackParamList, T>;

export type GamificationScreenProps<T extends keyof GamificationStackParamList> =
  StackScreenProps<GamificationStackParamList, T>;
