/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { SleepParamList } from '../types';

// Lazy-loaded screens (require + try/catch for resilience)
let SleepHomeScreen: React.ComponentType<unknown> = () => null;
let SleepLogScreen: React.ComponentType<unknown> = () => null;
let SleepQualityScreen: React.ComponentType<unknown> = () => null;
let SleepDiaryScreen: React.ComponentType<unknown> = () => null;
let SleepTrendsScreen: React.ComponentType<unknown> = () => null;
let SleepGoalsScreen: React.ComponentType<unknown> = () => null;
let SleepDetailScreen: React.ComponentType<unknown> = () => null;
let BedtimeRoutineScreen: React.ComponentType<unknown> = () => null;
let SmartAlarmScreen: React.ComponentType<unknown> = () => null;
let SleepInsightsScreen: React.ComponentType<unknown> = () => null;
let SleepDeviceSyncScreen: React.ComponentType<unknown> = () => null;
let SleepExportScreen: React.ComponentType<unknown> = () => null;

try {
    const m = require('../../screens/health/sleep/SleepHome');
    SleepHomeScreen = m.SleepHome || m.default || SleepHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepLog');
    SleepLogScreen = m.SleepLog || m.default || SleepLogScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepQuality');
    SleepQualityScreen = m.SleepQuality || m.default || SleepQualityScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepDiary');
    SleepDiaryScreen = m.SleepDiary || m.default || SleepDiaryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepTrends');
    SleepTrendsScreen = m.SleepTrends || m.default || SleepTrendsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepGoals');
    SleepGoalsScreen = m.SleepGoals || m.default || SleepGoalsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepDetail');
    SleepDetailScreen = m.SleepDetail || m.default || SleepDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/BedtimeRoutine');
    BedtimeRoutineScreen = m.BedtimeRoutine || m.default || BedtimeRoutineScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SmartAlarm');
    SmartAlarmScreen = m.SmartAlarm || m.default || SmartAlarmScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepInsights');
    SleepInsightsScreen = m.SleepInsights || m.default || SleepInsightsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepDeviceSync');
    SleepDeviceSyncScreen = m.SleepDeviceSync || m.default || SleepDeviceSyncScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/sleep/SleepExport');
    SleepExportScreen = m.SleepExport || m.default || SleepExportScreen;
} catch {
    /* not available */
}

const SleepStack = createStackNavigator<SleepParamList>();

export const SleepNavigator = () => (
    <SleepStack.Navigator screenOptions={{ headerShown: false }}>
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_HOME} component={SleepHomeScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_LOG} component={SleepLogScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_QUALITY} component={SleepQualityScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_DIARY} component={SleepDiaryScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_TRENDS} component={SleepTrendsScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_GOALS} component={SleepGoalsScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_DETAIL} component={SleepDetailScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_BEDTIME_ROUTINE} component={BedtimeRoutineScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_SMART_ALARM} component={SmartAlarmScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_INSIGHTS} component={SleepInsightsScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_DEVICE_SYNC} component={SleepDeviceSyncScreen} />
        <SleepStack.Screen name={ROUTES.HEALTH_SLEEP_EXPORT} component={SleepExportScreen} />
    </SleepStack.Navigator>
);
