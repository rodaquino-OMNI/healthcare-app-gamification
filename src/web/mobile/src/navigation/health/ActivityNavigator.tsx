import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { ActivityParamList } from '../types';
import { ROUTES } from '../../constants/routes';

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

try { const m = require('../../screens/health/activity/ActivityHome'); ActivityHomeScreen = m.ActivityHome || m.default || ActivityHomeScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/WorkoutLog'); WorkoutLogScreen = m.WorkoutLog || m.default || WorkoutLogScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/WorkoutDetail'); WorkoutDetailScreen = m.WorkoutDetail || m.default || WorkoutDetailScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/WorkoutHistory'); WorkoutHistoryScreen = m.WorkoutHistory || m.default || WorkoutHistoryScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/StepGoals'); StepGoalsScreen = m.StepGoals || m.default || StepGoalsScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/ActivityTrends'); ActivityTrendsScreen = m.ActivityTrends || m.default || ActivityTrendsScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/ExerciseLibrary'); ExerciseLibraryScreen = m.ExerciseLibrary || m.default || ExerciseLibraryScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/ExerciseDetail'); ExerciseDetailScreen = m.ExerciseDetail || m.default || ExerciseDetailScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/ActivityDeviceSync'); ActivityDeviceSyncScreen = m.ActivityDeviceSync || m.default || ActivityDeviceSyncScreen; } catch { /* not available */ }
try { const m = require('../../screens/health/activity/ActivityExport'); ActivityExportScreen = m.ActivityExport || m.default || ActivityExportScreen; } catch { /* not available */ }

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
