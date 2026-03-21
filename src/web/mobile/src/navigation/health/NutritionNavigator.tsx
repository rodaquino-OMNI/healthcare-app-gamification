/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { NutritionParamList } from '../types';

// Lazy-loaded screens (require + try/catch for resilience)
let NutritionHomeScreen: React.ComponentType<unknown> = () => null;
let MealLogScreen: React.ComponentType<unknown> = () => null;
let MealDetailScreen: React.ComponentType<unknown> = () => null;
let FoodDiaryScreen: React.ComponentType<unknown> = () => null;
let MacroTrackerScreen: React.ComponentType<unknown> = () => null;
let WaterIntakeScreen: React.ComponentType<unknown> = () => null;
let DietaryGoalsScreen: React.ComponentType<unknown> = () => null;
let NutritionInsightsScreen: React.ComponentType<unknown> = () => null;
let FoodSearchScreen: React.ComponentType<unknown> = () => null;
let NutritionExportScreen: React.ComponentType<unknown> = () => null;

try {
    const m = require('../../screens/health/nutrition/NutritionHome');
    NutritionHomeScreen = m.NutritionHome || m.default || NutritionHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MealLog');
    MealLogScreen = m.MealLog || m.default || MealLogScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MealDetail');
    MealDetailScreen = m.MealDetail || m.default || MealDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/FoodDiary');
    FoodDiaryScreen = m.FoodDiary || m.default || FoodDiaryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MacroTracker');
    MacroTrackerScreen = m.MacroTracker || m.default || MacroTrackerScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/WaterIntake');
    WaterIntakeScreen = m.WaterIntake || m.default || WaterIntakeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/DietaryGoals');
    DietaryGoalsScreen = m.DietaryGoals || m.default || DietaryGoalsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/NutritionInsights');
    NutritionInsightsScreen = m.NutritionInsights || m.default || NutritionInsightsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/FoodSearch');
    FoodSearchScreen = m.FoodSearch || m.default || FoodSearchScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/NutritionExport');
    NutritionExportScreen = m.NutritionExport || m.default || NutritionExportScreen;
} catch {
    /* not available */
}

const NutritionStack = createStackNavigator<NutritionParamList>();

export const NutritionNavigator = () => (
    <NutritionStack.Navigator screenOptions={{ headerShown: false }}>
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_HOME} component={NutritionHomeScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_MEAL_LOG} component={MealLogScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_MEAL_DETAIL} component={MealDetailScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_FOOD_DIARY} component={FoodDiaryScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_MACRO_TRACKER} component={MacroTrackerScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_WATER_INTAKE} component={WaterIntakeScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_DIETARY_GOALS} component={DietaryGoalsScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_INSIGHTS} component={NutritionInsightsScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_FOOD_SEARCH} component={FoodSearchScreen} />
        <NutritionStack.Screen name={ROUTES.HEALTH_NUTRITION_EXPORT} component={NutritionExportScreen} />
    </NutritionStack.Navigator>
);
