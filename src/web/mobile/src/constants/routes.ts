/**
 * Routes constant definitions for the AUSTA SuperApp
 * This file provides a centralized repository of all route names used for navigation
 * throughout the mobile application, organized by journey.
 */

/**
 * Application route constants
 */
export const ROUTES = {
    // Universal/Global Routes
    HOME: 'Home',
    NOTIFICATIONS: 'Notifications',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
    ACHIEVEMENTS: 'Achievements',
    HOME_METRICS: 'HomeMetrics',
    HOME_ALERT: 'HomeAlert',
    HOME_HEADER: 'HomeHeader',
    HOME_WEEKLY_SUMMARY: 'HomeWeeklySummary',
    HOME_BOTTOM_SHEET: 'HomeBottomSheet',
    HOME_MEDICATION_REMINDERS: 'HomeMedicationReminders',
    HOME_APPOINTMENT_WIDGET: 'HomeAppointmentWidget',
    HOME_HEALTH_TIPS: 'HomeHealthTips',
    HOME_EMPTY: 'HomeEmpty',

    // Authentication Routes - Welcome & Onboarding
    AUTH_WELCOME: 'AuthWelcome',
    AUTH_ONBOARDING: 'AuthOnboarding',
    AUTH_WELCOME_CTA: 'AuthWelcomeCTA',
    AUTH_LOGIN: 'AuthLogin',
    AUTH_REGISTER: 'AuthRegister',
    AUTH_FORGOT_PASSWORD: 'AuthForgotPassword',
    AUTH_MFA: 'AuthMFA',

    // Authentication Routes - Verification
    AUTH_EMAIL_VERIFY: 'AuthEmailVerify',
    AUTH_SET_PASSWORD: 'AuthSetPassword',

    // Authentication Routes - Social
    AUTH_SOCIAL: 'AuthSocial',

    // Authentication — Personalization Routes
    AUTH_PERSONALIZATION_INTRO: 'AuthPersonalizationIntro',
    AUTH_GOAL_SELECTION: 'AuthGoalSelection',
    AUTH_ONBOARDING_CONFIRMATION: 'AuthOnboardingConfirmation',

    // Profile Routes
    PROFILE_SETUP: 'ProfileSetup',
    PROFILE_HEALTH: 'ProfileHealth',
    PROFILE_INSURANCE: 'ProfileInsurance',
    PROFILE_ADDRESS: 'ProfileAddress',
    PROFILE_DOCUMENTS: 'ProfileDocuments',
    PROFILE_PHOTO: 'ProfilePhoto',
    PROFILE_CONFIRMATION: 'ProfileConfirmation',

    // Profile — Additional Setup Routes
    PROFILE_EMERGENCY_CONTACT: 'ProfileEmergencyContact',
    PROFILE_NOTIFICATION_PREFS: 'ProfileNotificationPrefs',
    PROFILE_BIOMETRIC_SETUP: 'ProfileBiometricSetup',

    // My Health Journey Routes (Green)
    HEALTH_DASHBOARD: 'HealthDashboard',
    HEALTH_MEDICAL_HISTORY: 'HealthMedicalHistory',
    HEALTH_HEALTH_GOALS: 'HealthGoals',
    HEALTH_DEVICE_CONNECTION: 'HealthDeviceConnection',
    HEALTH_METRIC_DETAIL: 'HealthMetricDetail',
    HEALTH_ADD_METRIC: 'HealthAddMetric',
    HEALTH_MEDICATION_LIST: 'HealthMedicationList',
    HEALTH_MEDICATION_ADD: 'HealthMedicationAdd',
    HEALTH_MEDICATION_DETAIL: 'HealthMedicationDetail',
    HEALTH_MEDICATION_SEARCH: 'HealthMedicationSearch',
    HEALTH_MEDICATION_REMINDER: 'HealthMedicationReminder',
    HEALTH_MEDICATION_ALARM: 'HealthMedicationAlarm',

    // Health Medication — Deep Screens
    HEALTH_MEDICATION_CALENDAR: 'HealthMedicationCalendar',
    HEALTH_MEDICATION_EMPTY: 'HealthMedicationEmpty',
    HEALTH_MEDICATION_ADD_CONFIRMATION: 'HealthMedicationAddConfirmation',
    HEALTH_MEDICATION_DOSE_TAKEN: 'HealthMedicationDoseTaken',
    HEALTH_MEDICATION_DOSE_MISSED: 'HealthMedicationDoseMissed',
    HEALTH_MEDICATION_EDIT: 'HealthMedicationEdit',
    HEALTH_MEDICATION_DELETE_CONFIRM: 'HealthMedicationDeleteConfirm',
    HEALTH_MEDICATION_ADHERENCE: 'HealthMedicationAdherence',
    HEALTH_MEDICATION_MONTHLY_REPORT: 'HealthMedicationMonthlyReport',
    HEALTH_MEDICATION_REFILL_REMINDER: 'HealthMedicationRefillReminder',
    HEALTH_MEDICATION_DRUG_INTERACTION: 'HealthMedicationDrugInteraction',
    HEALTH_MEDICATION_SIDE_EFFECTS_LOG: 'HealthMedicationSideEffectsLog',
    HEALTH_MEDICATION_SIDE_EFFECT_FORM: 'HealthMedicationSideEffectForm',
    HEALTH_MEDICATION_PHARMACY_LOCATOR: 'HealthMedicationPharmacyLocator',
    HEALTH_MEDICATION_PRESCRIPTION_PHOTO: 'HealthMedicationPrescriptionPhoto',
    HEALTH_MEDICATION_OCR_REVIEW: 'HealthMedicationOCRReview',
    HEALTH_MEDICATION_SHARE_CAREGIVER: 'HealthMedicationShareCaregiver',
    HEALTH_MEDICATION_CAREGIVER_ACCESS: 'HealthMedicationCaregiverAccess',
    HEALTH_MEDICATION_EXPORT: 'HealthMedicationExport',

    // Health — Cycle Tracking (Module 12)
    HEALTH_CYCLE_HOME: 'HealthCycleHome',
    HEALTH_CYCLE_CALENDAR: 'HealthCycleCalendar',
    HEALTH_CYCLE_LOG_PERIOD: 'HealthCycleLogPeriod',
    HEALTH_CYCLE_LOG_SYMPTOMS: 'HealthCycleLogSymptoms',
    HEALTH_CYCLE_LOG_FLOW: 'HealthCycleLogFlow',
    HEALTH_CYCLE_FERTILITY: 'HealthCycleFertility',
    HEALTH_CYCLE_PMS: 'HealthCyclePMS',
    HEALTH_CYCLE_HISTORY: 'HealthCycleHistory',
    HEALTH_CYCLE_ANALYSIS: 'HealthCycleAnalysis',
    HEALTH_CYCLE_INSIGHTS: 'HealthCycleInsights',
    HEALTH_CYCLE_ARTICLE_DETAIL: 'HealthCycleArticleDetail',
    HEALTH_CYCLE_REMINDERS: 'HealthCycleReminders',
    HEALTH_CYCLE_PARTNER_SHARING: 'HealthCyclePartnerSharing',
    HEALTH_CYCLE_SETTINGS: 'HealthCycleSettings',
    HEALTH_CYCLE_EXPORT_REPORT: 'HealthCycleExportReport',

    // Health — Sleep Management (Module 09)
    HEALTH_SLEEP_HOME: 'HealthSleepHome',
    HEALTH_SLEEP_LOG: 'HealthSleepLog',
    HEALTH_SLEEP_QUALITY: 'HealthSleepQuality',
    HEALTH_SLEEP_DIARY: 'HealthSleepDiary',
    HEALTH_SLEEP_TRENDS: 'HealthSleepTrends',
    HEALTH_SLEEP_GOALS: 'HealthSleepGoals',
    HEALTH_SLEEP_DETAIL: 'HealthSleepDetail',
    HEALTH_SLEEP_BEDTIME_ROUTINE: 'HealthSleepBedtimeRoutine',
    HEALTH_SLEEP_SMART_ALARM: 'HealthSleepSmartAlarm',
    HEALTH_SLEEP_INSIGHTS: 'HealthSleepInsights',
    HEALTH_SLEEP_DEVICE_SYNC: 'HealthSleepDeviceSync',
    HEALTH_SLEEP_EXPORT: 'HealthSleepExport',

    // Health — Activity Tracker (Module 10)
    HEALTH_ACTIVITY_HOME: 'HealthActivityHome',
    HEALTH_ACTIVITY_WORKOUT_LOG: 'HealthActivityWorkoutLog',
    HEALTH_ACTIVITY_WORKOUT_DETAIL: 'HealthActivityWorkoutDetail',
    HEALTH_ACTIVITY_WORKOUT_HISTORY: 'HealthActivityWorkoutHistory',
    HEALTH_ACTIVITY_STEP_GOALS: 'HealthActivityStepGoals',
    HEALTH_ACTIVITY_TRENDS: 'HealthActivityTrends',
    HEALTH_ACTIVITY_EXERCISE_LIBRARY: 'HealthActivityExerciseLibrary',
    HEALTH_ACTIVITY_EXERCISE_DETAIL: 'HealthActivityExerciseDetail',
    HEALTH_ACTIVITY_DEVICE_SYNC: 'HealthActivityDeviceSync',
    HEALTH_ACTIVITY_EXPORT: 'HealthActivityExport',
    // Health — Nutrition Monitoring (Module 11)
    HEALTH_NUTRITION_HOME: 'HealthNutritionHome',
    HEALTH_NUTRITION_MEAL_LOG: 'HealthNutritionMealLog',
    HEALTH_NUTRITION_MEAL_DETAIL: 'HealthNutritionMealDetail',
    HEALTH_NUTRITION_FOOD_DIARY: 'HealthNutritionFoodDiary',
    HEALTH_NUTRITION_MACRO_TRACKER: 'HealthNutritionMacroTracker',
    HEALTH_NUTRITION_WATER_INTAKE: 'HealthNutritionWaterIntake',
    HEALTH_NUTRITION_DIETARY_GOALS: 'HealthNutritionDietaryGoals',
    HEALTH_NUTRITION_INSIGHTS: 'HealthNutritionInsights',
    HEALTH_NUTRITION_FOOD_SEARCH: 'HealthNutritionFoodSearch',
    HEALTH_NUTRITION_EXPORT: 'HealthNutritionExport',
    // Health — Wellness Resources (Module 16)
    HEALTH_WELLNESS_RESOURCES_HOME: 'HealthWellnessResourcesHome',
    HEALTH_WELLNESS_RESOURCES_ARTICLE_LIST: 'HealthWellnessResourcesArticleList',
    HEALTH_WELLNESS_RESOURCES_ARTICLE_DETAIL: 'HealthWellnessResourcesArticleDetail',
    HEALTH_WELLNESS_RESOURCES_VIDEO_LIBRARY: 'HealthWellnessResourcesVideoLibrary',
    HEALTH_WELLNESS_RESOURCES_VIDEO_PLAYER: 'HealthWellnessResourcesVideoPlayer',
    HEALTH_WELLNESS_RESOURCES_PROGRAMS: 'HealthWellnessResourcesPrograms',
    HEALTH_WELLNESS_RESOURCES_PROGRAM_DETAIL: 'HealthWellnessResourcesProgramDetail',
    HEALTH_WELLNESS_RESOURCES_BOOKMARKS: 'HealthWellnessResourcesBookmarks',

    // Health Assessment Wizard
    HEALTH_ASSESSMENT_WIZARD: 'HealthAssessmentWizard',

    // Cross-Journey / Global
    NOTIFICATION_DETAIL: 'NotificationDetail',
    NOTIFICATION_UNREAD: 'NotificationUnread',
    NOTIFICATION_CATEGORY_FILTER: 'NotificationCategoryFilter',
    NOTIFICATION_EMPTY: 'NotificationEmpty',
    NOTIFICATION_SETTINGS: 'NotificationSettings',
    SEARCH: 'Search',
    SEARCH_RESULTS: 'SearchResults',
    SEARCH_DOCTOR_RESULTS: 'SearchDoctorResults',
    SEARCH_ARTICLE_RESULTS: 'SearchArticleResults',
    SEARCH_MEDICATION_RESULTS: 'SearchMedicationResults',
    SEARCH_NO_RESULTS: 'SearchNoResults',
    SETTINGS_EDIT: 'SettingsEdit',
    SETTINGS_NOTIFICATIONS: 'SettingsNotifications',
    SETTINGS_PRIVACY: 'SettingsPrivacy',

    // Care Now Journey Routes (Orange)
    CARE_DASHBOARD: 'CareDashboard',
    CARE_APPOINTMENTS: 'CareAppointments',
    CARE_APPOINTMENT_BOOKING: 'CareAppointmentBooking',
    CARE_TELEMEDICINE: 'CareTelemedicine',
    CARE_MEDICATION_TRACKING: 'CareMedicationTracking',
    CARE_SYMPTOM_CHECKER: 'CareSymptomChecker',
    CARE_SYMPTOM_BODY_MAP: 'CareSymptomBodyMap',
    CARE_SYMPTOM_DETAIL: 'CareSymptomDetail',
    CARE_SYMPTOM_SEVERITY: 'CareSymptomSeverity',
    CARE_SYMPTOM_QUESTIONS: 'CareSymptomQuestions',
    CARE_SYMPTOM_RESULT: 'CareSymptomResult',
    CARE_SYMPTOM_RECOMMENDATION: 'CareSymptomRecommendation',

    // Care Now — Symptom Checker Deep Routes (Orange)
    CARE_SYMPTOM_BODY_MAP_BACK: 'CareSymptomBodyMapBack',
    CARE_SYMPTOM_HEAD_DETAIL: 'CareSymptomHeadDetail',
    CARE_SYMPTOM_PHOTO_UPLOAD: 'CareSymptomPhotoUpload',
    CARE_SYMPTOM_MEDICAL_HISTORY: 'CareSymptomMedicalHistory',
    CARE_SYMPTOM_MEDICATION_CONTEXT: 'CareSymptomMedicationContext',
    CARE_SYMPTOM_VITALS: 'CareSymptomVitals',
    CARE_SYMPTOM_ANALYZING: 'CareSymptomAnalyzing',
    CARE_SYMPTOM_CONDITIONS_LIST: 'CareSymptomConditionsList',
    CARE_SYMPTOM_CONDITION_DETAIL: 'CareSymptomConditionDetail',
    CARE_SYMPTOM_SELF_CARE: 'CareSymptomSelfCare',
    CARE_SYMPTOM_EMERGENCY_WARNING: 'CareSymptomEmergencyWarning',
    CARE_SYMPTOM_BOOK_APPOINTMENT: 'CareSymptomBookAppointment',
    CARE_SYMPTOM_ER_LOCATOR: 'CareSymptomERLocator',
    CARE_SYMPTOM_SAVE_REPORT: 'CareSymptomSaveReport',
    CARE_SYMPTOM_SHARE_REPORT: 'CareSymptomShareReport',
    CARE_SYMPTOM_HISTORY: 'CareSymptomHistory',
    CARE_SYMPTOM_HISTORY_DETAIL: 'CareSymptomHistoryDetail',
    CARE_SYMPTOM_ACCURACY_RATING: 'CareSymptomAccuracyRating',
    CARE_SYMPTOM_FOLLOW_UP: 'CareSymptomFollowUp',
    CARE_SYMPTOM_DIARY: 'CareSymptomDiary',
    CARE_SYMPTOM_COMPARISON: 'CareSymptomComparison',

    // Care Now — Consultation Flow Routes (Orange)
    CARE_DOCTOR_SEARCH: 'CareDoctorSearch',
    CARE_DOCTOR_FILTERS: 'CareDoctorFilters',
    CARE_DOCTOR_PROFILE: 'CareDoctorProfile',
    CARE_DOCTOR_AVAILABILITY: 'CareDoctorAvailability',
    CARE_BOOKING_SCHEDULE: 'CareBookingSchedule',
    CARE_BOOKING_CONFIRMATION: 'CareBookingConfirmation',
    CARE_WAITING_ROOM: 'CareWaitingRoom',

    // Care Now — Consultation Deep Routes (Orange)
    CARE_DOCTOR_REVIEWS: 'CareDoctorReviews',
    CARE_APPOINTMENT_TYPE: 'CareAppointmentType',
    CARE_BOOKING_REASON: 'CareBookingReason',
    CARE_BOOKING_DOCUMENTS: 'CareBookingDocuments',
    CARE_BOOKING_INSURANCE: 'CareBookingInsurance',
    CARE_BOOKING_SUCCESS: 'CareBookingSuccess',
    CARE_APPOINTMENTS_LIST: 'CareAppointmentsList',
    CARE_APPOINTMENT_RESCHEDULE: 'CareAppointmentReschedule',
    CARE_APPOINTMENT_CANCEL: 'CareAppointmentCancel',
    CARE_APPOINTMENT_CANCELLED: 'CareAppointmentCancelled',
    CARE_APPOINTMENT_NO_SHOW: 'CareAppointmentNoShow',
    CARE_PRE_VISIT_CHECKLIST: 'CarePreVisitChecklist',
    CARE_RATE_VISIT: 'CareRateVisit',
    CARE_SAVED_DOCTORS: 'CareSavedDoctors',

    // Care Now — Telemedicine Deep Routes (Orange)
    CARE_TELEMEDICINE_CONNECTING: 'CareTelemedicineConnecting',
    CARE_TELEMEDICINE_CONTROLS: 'CareTelemedicineControls',
    CARE_TELEMEDICINE_CHAT: 'CareTelemedicineChat',
    CARE_TELEMEDICINE_SCREEN_SHARE: 'CareTelemedicineScreenShare',
    CARE_TELEMEDICINE_END: 'CareTelemedicineEnd',

    // Care Now — Post-Visit Routes (Orange)
    CARE_VISIT_SUMMARY: 'CareVisitSummary',
    CARE_VISIT_PRESCRIPTIONS: 'CareVisitPrescriptions',
    CARE_VISIT_FOLLOW_UP: 'CareVisitFollowUp',
    CARE_VISIT_LAB_ORDERS: 'CareVisitLabOrders',
    CARE_VISIT_REFERRAL: 'CareVisitReferral',

    // Care Now — Payment Routes (Orange)
    CARE_PAYMENT_SUMMARY: 'CarePaymentSummary',
    CARE_PAYMENT_RECEIPT: 'CarePaymentReceipt',

    // Care Now — Records Routes (Orange)
    CARE_ASYNC_DOCTOR_CHAT: 'CareAsyncDoctorChat',
    CARE_MEDICAL_RECORDS: 'CareMedicalRecords',

    // My Plan & Benefits Journey Routes (Blue)
    PLAN_DASHBOARD: 'PlanDashboard',
    PLAN_COVERAGE: 'Coverage',
    PLAN_DIGITAL_CARD: 'DigitalCard',
    PLAN_CLAIMS: 'ClaimHistory',
    PLAN_COST_SIMULATOR: 'CostSimulator',
    PLAN_CLAIM_DETAIL: 'ClaimDetail',
    PLAN_CLAIM_SUBMISSION: 'ClaimSubmission',
    PLAN_BENEFITS: 'Benefits',

    // Gamification Journey Routes (Purple)
    GAMIFICATION_ACHIEVEMENTS: 'GamificationAchievements',
    GAMIFICATION_DETAIL: 'GamificationAchievementDetail',
    GAMIFICATION_LEADERBOARD: 'GamificationLeaderboard',
    GAMIFICATION_QUESTS: 'GamificationQuests',
    GAMIFICATION_QUEST_DETAIL: 'GamificationQuestDetail',
    GAMIFICATION_REWARDS: 'GamificationRewards',
    GAMIFICATION_REWARD_DETAIL: 'GamificationRewardDetail',

    // AI Wellness Companion (Module 06)
    WELLNESS_CHAT: 'WellnessChat',
    WELLNESS_CHAT_ACTIVE: 'WellnessChatActive',
    WELLNESS_QUICK_REPLIES: 'WellnessQuickReplies',
    WELLNESS_MOOD_CHECK_IN: 'WellnessMoodCheckIn',
    WELLNESS_TIP_DETAIL: 'WellnessTipDetail',
    WELLNESS_BREATHING: 'WellnessBreathing',
    WELLNESS_MEDITATION: 'WellnessMeditation',
    WELLNESS_DAILY_PLAN: 'WellnessDailyPlan',
    WELLNESS_INSIGHTS: 'WellnessInsights',
    WELLNESS_GOALS: 'WellnessGoals',
    WELLNESS_JOURNAL: 'WellnessJournal',
    WELLNESS_JOURNAL_HISTORY: 'WellnessJournalHistory',
    WELLNESS_CHALLENGES: 'WellnessChallenges',
    WELLNESS_CHALLENGE_DETAIL: 'WellnessChallengeDetail',
    WELLNESS_STREAKS: 'WellnessStreaks',

    // Settings Module Routes (18-03 through 18-33)
    SETTINGS_PERSONAL_INFO: 'SettingsPersonalInfo',
    SETTINGS_CHANGE_PASSWORD: 'SettingsChangePassword',
    SETTINGS_TWO_FACTOR: 'SettingsTwoFactor',
    SETTINGS_BIOMETRIC: 'SettingsBiometric',
    SETTINGS_DATA_EXPORT: 'SettingsDataExport',
    SETTINGS_DELETE_ACCOUNT: 'SettingsDeleteAccount',
    SETTINGS_DELETE_CONFIRM: 'SettingsDeleteConfirm',
    SETTINGS_LANGUAGE: 'SettingsLanguage',
    SETTINGS_THEME: 'SettingsTheme',
    SETTINGS_ACCESSIBILITY: 'SettingsAccessibility',
    SETTINGS_CONNECTED_DEVICES: 'SettingsConnectedDevices',
    SETTINGS_HEALTH_PLAN: 'SettingsHealthPlan',
    SETTINGS_INSURANCE_DOCS: 'SettingsInsuranceDocs',
    SETTINGS_DEPENDENTS: 'SettingsDependents',
    SETTINGS_ADD_DEPENDENT: 'SettingsAddDependent',
    SETTINGS_EMERGENCY_CONTACTS: 'SettingsEmergencyContacts',
    SETTINGS_ADDRESSES: 'SettingsAddresses',
    SETTINGS_ADD_ADDRESS: 'SettingsAddAddress',
    SETTINGS_TERMS: 'SettingsTerms',
    SETTINGS_PRIVACY_POLICY: 'SettingsPrivacyPolicy',
    SETTINGS_ABOUT: 'SettingsAbout',
    SETTINGS_LOGOUT: 'SettingsLogout',
    SETTINGS_FEEDBACK: 'SettingsFeedback',

    // Help Center Routes
    HELP_HOME: 'HelpHome',
    HELP_FAQ_CATEGORY: 'HelpFAQCategory',
    HELP_FAQ_DETAIL: 'HelpFAQDetail',
    HELP_CONTACT: 'HelpContact',
    HELP_CHAT: 'HelpChat',
    HELP_REPORT: 'HelpReport',

    // Error Routes (programmatic use, not registered in navigator)
    ERROR_NO_INTERNET: 'ErrorNoInternet',
    ERROR_SERVER: 'ErrorServer',
    ERROR_MAINTENANCE: 'ErrorMaintenance',
    ERROR_FORCE_UPDATE: 'ErrorForceUpdate',
} as const;
