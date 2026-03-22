/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { ActivityParamList } from '../types';

/** Shape of every lazily-loaded screen module. */
interface ScreenModule {
    default?: React.ComponentType;
    [key: string]: React.ComponentType | undefined;
}

// Lazy-loaded screens (require + try/catch for resilience)
let ActivityHomeScreen: React.ComponentType<unknown> = () => null;
let WorkoutLogScreen: React.ComponentType<unknown> = () => null;
let WorkoutDetailScreen: React.ComponentType<unknown> = () => null;
let WorkoutHistoryScreen: React.ComponentType<unknown> = () => null;
let StepGoalsScreen: React.ComponentType<unknown> = () => null;
let ActivityTrendsScreen: React.ComponentType<unknown> = () => null;
let ExerciseLibraryScreen: React.ComponentType<unknown> = () => null;
let ExerciseDetailScreen: React.ComponentType<unknown> = () => null;
let ActivityDeviceSyncScreen: React.ComponentType<unknown> = () => null;
let ActivityExportScreen: React.ComponentType<unknown> = () => null;

try {
    const m = require('../../screens/health/activity/ActivityHome') as ScreenModule;
    ActivityHomeScreen = m.ActivityHome ?? m.default ?? ActivityHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/WorkoutLog') as ScreenModule;
    WorkoutLogScreen = m.WorkoutLog ?? m.default ?? WorkoutLogScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/WorkoutDetail') as ScreenModule;
    WorkoutDetailScreen = m.WorkoutDetail ?? m.default ?? WorkoutDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/WorkoutHistory') as ScreenModule;
    WorkoutHistoryScreen = m.WorkoutHistory ?? m.default ?? WorkoutHistoryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/StepGoals') as ScreenModule;
    StepGoalsScreen = m.StepGoals ?? m.default ?? StepGoalsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/ActivityTrends') as ScreenModule;
    ActivityTrendsScreen = m.ActivityTrends ?? m.default ?? ActivityTrendsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/ExerciseLibrary') as ScreenModule;
    ExerciseLibraryScreen = m.ExerciseLibrary ?? m.default ?? ExerciseLibraryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/ExerciseDetail') as ScreenModule;
    ExerciseDetailScreen = m.ExerciseDetail ?? m.default ?? ExerciseDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/ActivityDeviceSync') as ScreenModule;
    ActivityDeviceSyncScreen = m.ActivityDeviceSync ?? m.default ?? ActivityDeviceSyncScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/activity/ActivityExport') as ScreenModule;
    ActivityExportScreen = m.ActivityExport ?? m.default ?? ActivityExportScreen;
} catch {
    /* not available */
}

const ActivityStack = createStackNavigator<ActivityParamList>();

export const ActivityNavigator = () => (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_HOME} component={ActivityHomeScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_WORKOUT_LOG} component={WorkoutLogScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_WORKOUT_DETAIL} component={WorkoutDetailScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_WORKOUT_HISTORY} component={WorkoutHistoryScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_STEP_GOALS} component={StepGoalsScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_TRENDS} component={ActivityTrendsScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_EXERCISE_LIBRARY} component={ExerciseLibraryScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_EXERCISE_DETAIL} component={ExerciseDetailScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_DEVICE_SYNC} component={ActivityDeviceSyncScreen} />
        <ActivityStack.Screen name={ROUTES.HEALTH_ACTIVITY_EXPORT} component={ActivityExportScreen} />
    </ActivityStack.Navigator>
);
