/**
 * Navigation type definitions for the AUSTA SuperApp mobile app.
 * Provides typed ParamList for all 8 navigators + 5 Health sub-navigators + utility types.
 *
 * Usage:
 *   import { CareStackParamList } from '../navigation/types';
 *   type Props = NativeStackScreenProps<CareStackParamList, 'CareDoctorProfile'>;
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

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
    AuthSetPassword: { token?: string } | undefined;
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
    ProfileEmergencyContact: undefined;
    ProfileNotificationPrefs: undefined;
    ProfileBiometricSetup: undefined;
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
    CareAppointments: { appointmentId?: string } | undefined;
    CareAppointmentBooking: undefined;
    CareTelemedicine: { sessionId?: string } | undefined;
    CareMedicationTracking: undefined;
    // Symptom checker flow
    CareSymptomChecker: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomBodyMap: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomDetail: { symptomId: string; sessionId?: string };
    CareSymptomSeverity: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomQuestions: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomResult: { sessionId?: string } | undefined;
    CareSymptomRecommendation: { sessionId?: string } | undefined;
    // Symptom checker deep
    CareSymptomBodyMapBack: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomHeadDetail: { symptoms?: string[]; sessionId?: string } | undefined;
    CareSymptomPhotoUpload: { sessionId?: string } | undefined;
    CareSymptomMedicalHistory: { sessionId?: string } | undefined;
    CareSymptomMedicationContext: { sessionId?: string } | undefined;
    CareSymptomVitals: { sessionId?: string } | undefined;
    CareSymptomAnalyzing: { sessionId?: string } | undefined;
    CareSymptomConditionsList: { sessionId?: string } | undefined;
    CareSymptomConditionDetail: { conditionId: string; sessionId?: string };
    CareSymptomSelfCare: { sessionId?: string } | undefined;
    CareSymptomEmergencyWarning: { sessionId?: string } | undefined;
    CareSymptomBookAppointment: { sessionId?: string } | undefined;
    CareSymptomERLocator: { sessionId?: string } | undefined;
    CareSymptomSaveReport: { sessionId?: string } | undefined;
    CareSymptomShareReport: { sessionId?: string } | undefined;
    CareSymptomHistory: undefined;
    CareSymptomHistoryDetail: { sessionId: string };
    CareSymptomAccuracyRating: { sessionId: string };
    CareSymptomFollowUp: { sessionId?: string } | undefined;
    CareSymptomDiary: undefined;
    CareSymptomComparison: undefined;
    // Doctor search & booking
    CareDoctorSearch: undefined;
    CareDoctorFilters: undefined;
    CareDoctorProfile: { doctorId: string };
    CareDoctorAvailability: { doctorId: string };
    CareBookingSchedule: { doctorId: string; date?: string; time?: string };
    CareBookingConfirmation: { doctorId: string; appointmentId?: string; date?: string; time?: string; type?: string };
    CareWaitingRoom: { appointmentId: string };
    // Consultation deep
    CareDoctorReviews: { doctorId: string };
    CareAppointmentType: { doctorId?: string } | undefined;
    CareBookingReason: { doctorId?: string; appointmentType?: string } | undefined;
    CareBookingDocuments: { doctorId?: string; appointmentType?: string } | undefined;
    CareBookingInsurance: { doctorId?: string; appointmentType?: string } | undefined;
    CareBookingSuccess:
        | {
              appointmentId?: string;
              doctorId?: string;
              date?: string;
              time?: string;
              appointmentType?: string;
          }
        | undefined;
    CareAppointmentsList: undefined;
    CareAppointmentReschedule: { appointmentId: string; doctorId?: string };
    CareAppointmentCancel: { appointmentId: string };
    CareAppointmentCancelled: { appointmentId?: string; refundAmount?: string } | undefined;
    CareAppointmentNoShow: { appointmentId?: string } | undefined;
    CarePreVisitChecklist: { appointmentId: string };
    CareRateVisit: { appointmentId: string };
    CareSavedDoctors: undefined;
    // Telemedicine deep
    CareTelemedicineConnecting: { sessionId?: string } | undefined;
    CareTelemedicineControls: { sessionId?: string } | undefined;
    CareTelemedicineChat: { sessionId?: string } | undefined;
    CareTelemedicineScreenShare: { sessionId?: string } | undefined;
    CareTelemedicineEnd: { sessionId?: string } | undefined;
    // Post-visit
    CareVisitSummary: { visitId?: string } | undefined;
    CareVisitPrescriptions: { visitId?: string } | undefined;
    CareVisitFollowUp: { visitId?: string } | undefined;
    CareVisitLabOrders: { visitId?: string } | undefined;
    CareVisitReferral: { visitId?: string } | undefined;
    // Payment
    CarePaymentSummary: { appointmentId?: string } | undefined;
    CarePaymentReceipt: { paymentId?: string } | undefined;
    // Records
    CareAsyncDoctorChat: { doctorId?: string } | undefined;
    CareMedicalRecords: undefined;
};

// ---------------------------------------------------------------------------
// Health Sub-Navigator Param Lists
// ---------------------------------------------------------------------------

export type CycleTrackingParamList = {
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
};

export type SleepParamList = {
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

export type ActivityParamList = {
    HealthActivityHome: undefined;
    HealthActivityWorkoutLog: undefined;
    HealthActivityWorkoutDetail: { workoutId: string };
    HealthActivityWorkoutHistory: undefined;
    HealthActivityStepGoals: undefined;
    HealthActivityTrends: undefined;
    HealthActivityExerciseLibrary: undefined;
    HealthActivityExerciseDetail: { exerciseId: string };
    HealthActivityDeviceSync: undefined;
    HealthActivityExport: undefined;
};

export type NutritionParamList = {
    HealthNutritionHome: undefined;
    HealthNutritionMealLog: undefined;
    HealthNutritionMealDetail: { mealId: string };
    HealthNutritionFoodDiary: undefined;
    HealthNutritionMacroTracker: undefined;
    HealthNutritionWaterIntake: undefined;
    HealthNutritionDietaryGoals: undefined;
    HealthNutritionInsights: undefined;
    HealthNutritionFoodSearch: undefined;
    HealthNutritionExport: undefined;
};

export type WellnessResourcesParamList = {
    HealthWellnessResourcesHome: undefined;
    HealthWellnessResourcesArticleList: undefined;
    HealthWellnessResourcesArticleDetail: { articleId: string };
    HealthWellnessResourcesVideoLibrary: undefined;
    HealthWellnessResourcesVideoPlayer: { videoId: string };
    HealthWellnessResourcesPrograms: undefined;
    HealthWellnessResourcesProgramDetail: { programId: string };
    HealthWellnessResourcesBookmarks: undefined;
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
    HealthMedicationReminder: { medicationId?: string; medicationName?: string; medicationDosage?: string } | undefined;
    HealthMedicationAlarm:
        | {
              medicationId?: string;
              medicationName?: string;
              medicationDosage?: string;
              nextDoseTime?: string;
              snoozeDuration?: number;
          }
        | undefined;
    // Medication deep
    HealthMedicationCalendar: undefined;
    HealthMedicationEmpty: undefined;
    HealthMedicationAddConfirmation: { medicationId?: string } | undefined;
    HealthMedicationDoseTaken: { medicationId?: string } | undefined;
    HealthMedicationDoseMissed: { medicationId?: string } | undefined;
    HealthMedicationEdit: { medicationId: string };
    HealthMedicationDeleteConfirm: { medicationId: string };
    HealthMedicationAdherence: { medicationId?: string } | undefined;
    HealthMedicationMonthlyReport: { medicationId?: string } | undefined;
    HealthMedicationRefillReminder: { medicationId?: string } | undefined;
    HealthMedicationDrugInteraction: { medicationId?: string } | undefined;
    HealthMedicationSideEffectsLog: { medicationId?: string } | undefined;
    HealthMedicationSideEffectForm: { medicationId?: string } | undefined;
    HealthMedicationPharmacyLocator: undefined;
    HealthMedicationPrescriptionPhoto: { medicationId?: string } | undefined;
    HealthMedicationOCRReview: undefined;
    HealthMedicationShareCaregiver: { medicationId?: string } | undefined;
    HealthMedicationCaregiverAccess: undefined;
    HealthMedicationExport: undefined;
    // Sub-navigator references
    CycleTracking: NavigatorScreenParams<CycleTrackingParamList>;
    Sleep: NavigatorScreenParams<SleepParamList>;
    Activity: NavigatorScreenParams<ActivityParamList>;
    Nutrition: NavigatorScreenParams<NutritionParamList>;
    WellnessResources: NavigatorScreenParams<WellnessResourcesParamList>;
};

// ---------------------------------------------------------------------------
// Plan Stack
// Note: PlanNavigator uses legacy `routes` (lowercase) values
// ---------------------------------------------------------------------------

export type PlanStackParamList = {
    PlanDashboard: undefined;
    Coverage: undefined; // routes.COVERAGE = 'Coverage' (legacy)
    ClaimHistory: undefined; // routes.CLAIMS = 'ClaimHistory' (legacy)
    ClaimDetail: { claimId: string }; // routes.CLAIM_DETAIL = 'ClaimDetail' (legacy)
    ClaimSubmission: undefined; // routes.CLAIM_SUBMISSION = 'ClaimSubmission' (legacy)
    CostSimulator: undefined; // routes.COST_SIMULATOR = 'CostSimulator' (legacy)
    DigitalCard: undefined; // routes.DIGITAL_CARD = 'DigitalCard' (legacy)
    Benefits: undefined; // routes.BENEFITS = 'Benefits' (legacy)
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
    SettingsAddDependent:
        | {
              dependent?: {
                  id: string;
                  name: string;
                  relationship: string;
                  dob: string;
                  cpf: string;
              };
          }
        | undefined;
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

export type WellnessScreenProps<T extends keyof WellnessStackParamList> = StackScreenProps<WellnessStackParamList, T>;

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
export type CycleTrackingNavigationProp = StackNavigationProp<CycleTrackingParamList>;
export type SleepNavigationProp = StackNavigationProp<SleepParamList>;
export type ActivityNavigationProp = StackNavigationProp<ActivityParamList>;
export type NutritionNavigationProp = StackNavigationProp<NutritionParamList>;
export type WellnessResourcesNavigationProp = StackNavigationProp<WellnessResourcesParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

/** Composite navigation prop for screens inside the Home tab stack. */
export type HomeTabScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    BottomTabNavigationProp<MainTabParamList>
>;

// ---------------------------------------------------------------------------
// ScreenProps utility types (convenience — one import for props + route)
// ---------------------------------------------------------------------------

export type AuthScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = StackScreenProps<HomeStackParamList, T>;

export type CareScreenProps<T extends keyof CareStackParamList> = StackScreenProps<CareStackParamList, T>;

export type HealthScreenProps<T extends keyof HealthStackParamList> = StackScreenProps<HealthStackParamList, T>;

export type PlanScreenProps<T extends keyof PlanStackParamList> = StackScreenProps<PlanStackParamList, T>;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> = StackScreenProps<SettingsStackParamList, T>;

export type GamificationScreenProps<T extends keyof GamificationStackParamList> = StackScreenProps<
    GamificationStackParamList,
    T
>;

export type CycleTrackingScreenProps<T extends keyof CycleTrackingParamList> = StackScreenProps<
    CycleTrackingParamList,
    T
>;

export type SleepScreenProps<T extends keyof SleepParamList> = StackScreenProps<SleepParamList, T>;

export type ActivityScreenProps<T extends keyof ActivityParamList> = StackScreenProps<ActivityParamList, T>;

export type NutritionScreenProps<T extends keyof NutritionParamList> = StackScreenProps<NutritionParamList, T>;

export type WellnessResourcesScreenProps<T extends keyof WellnessResourcesParamList> = StackScreenProps<
    WellnessResourcesParamList,
    T
>;
