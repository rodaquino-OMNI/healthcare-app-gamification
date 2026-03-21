/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { CycleTrackingParamList } from '../types';

// Lazy-loaded screens (require + try/catch for resilience)
let CycleHomeScreen: React.ComponentType<unknown> = () => null;
let CycleCalendarScreen: React.ComponentType<unknown> = () => null;
let LogPeriodStartScreen: React.ComponentType<unknown> = () => null;
let LogSymptomsScreen: React.ComponentType<unknown> = () => null;
let LogFlowIntensityScreen: React.ComponentType<unknown> = () => null;
let FertilityWindowScreen: React.ComponentType<unknown> = () => null;
let PMSPredictionsScreen: React.ComponentType<unknown> = () => null;
let CycleHistoryScreen: React.ComponentType<unknown> = () => null;
let CycleAnalysisScreen: React.ComponentType<unknown> = () => null;
let CycleInsightsScreen: React.ComponentType<unknown> = () => null;
let CycleArticleDetailScreen: React.ComponentType<unknown> = () => null;
let CycleRemindersScreen: React.ComponentType<unknown> = () => null;
let PartnerSharingScreen: React.ComponentType<unknown> = () => null;
let CycleSettingsScreen: React.ComponentType<unknown> = () => null;
let ExportCycleReportScreen: React.ComponentType<unknown> = () => null;

try {
    const m = require('../../screens/health/cycle-tracking/CycleHome');
    CycleHomeScreen = m.CycleHome || m.default || CycleHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleCalendar');
    CycleCalendarScreen = m.CycleCalendar || m.default || CycleCalendarScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/LogPeriodStart');
    LogPeriodStartScreen = m.LogPeriodStart || m.default || LogPeriodStartScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/LogSymptoms');
    LogSymptomsScreen = m.LogSymptoms || m.default || LogSymptomsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/LogFlowIntensity');
    LogFlowIntensityScreen = m.LogFlowIntensity || m.default || LogFlowIntensityScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/FertilityWindow');
    FertilityWindowScreen = m.FertilityWindow || m.default || FertilityWindowScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/PMSPredictions');
    PMSPredictionsScreen = m.PMSPredictions || m.default || PMSPredictionsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleHistory');
    CycleHistoryScreen = m.CycleHistory || m.default || CycleHistoryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleAnalysis');
    CycleAnalysisScreen = m.CycleAnalysis || m.default || CycleAnalysisScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleInsights');
    CycleInsightsScreen = m.CycleInsights || m.default || CycleInsightsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleArticleDetail');
    CycleArticleDetailScreen = m.CycleArticleDetail || m.default || CycleArticleDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleReminders');
    CycleRemindersScreen = m.CycleReminders || m.default || CycleRemindersScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/PartnerSharing');
    PartnerSharingScreen = m.PartnerSharing || m.default || PartnerSharingScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/CycleSettings');
    CycleSettingsScreen = m.CycleSettings || m.default || CycleSettingsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/cycle-tracking/ExportCycleReport');
    ExportCycleReportScreen = m.ExportCycleReport || m.default || ExportCycleReportScreen;
} catch {
    /* not available */
}

const CycleStack = createStackNavigator<CycleTrackingParamList>();

export const CycleTrackingNavigator = () => (
    <CycleStack.Navigator screenOptions={{ headerShown: false }}>
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_HOME} component={CycleHomeScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_CALENDAR} component={CycleCalendarScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_LOG_PERIOD} component={LogPeriodStartScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_LOG_SYMPTOMS} component={LogSymptomsScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_LOG_FLOW} component={LogFlowIntensityScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_FERTILITY} component={FertilityWindowScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_PMS} component={PMSPredictionsScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_HISTORY} component={CycleHistoryScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_ANALYSIS} component={CycleAnalysisScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_INSIGHTS} component={CycleInsightsScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_ARTICLE_DETAIL} component={CycleArticleDetailScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_REMINDERS} component={CycleRemindersScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_PARTNER_SHARING} component={PartnerSharingScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_SETTINGS} component={CycleSettingsScreen} />
        <CycleStack.Screen name={ROUTES.HEALTH_CYCLE_EXPORT_REPORT} component={ExportCycleReportScreen} />
    </CycleStack.Navigator>
);
