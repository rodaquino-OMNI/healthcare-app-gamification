/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { NutritionParamList } from '../types';

/** Shape of every lazily-loaded screen module. */
interface ScreenModule {
    default?: React.ComponentType;
    [key: string]: React.ComponentType | undefined;
}

// Lazy-loaded screens (require + try/catch for resilience)
let NutritionHomeScreen: React.ComponentType = () => null;
let MealLogScreen: React.ComponentType = () => null;
let MealDetailScreen: React.ComponentType = () => null;
let FoodDiaryScreen: React.ComponentType = () => null;
let MacroTrackerScreen: React.ComponentType = () => null;
let WaterIntakeScreen: React.ComponentType = () => null;
let DietaryGoalsScreen: React.ComponentType = () => null;
let NutritionInsightsScreen: React.ComponentType = () => null;
let FoodSearchScreen: React.ComponentType = () => null;
let NutritionExportScreen: React.ComponentType = () => null;

try {
    const m = require('../../screens/health/nutrition/NutritionHome') as ScreenModule;
    NutritionHomeScreen = m.NutritionHome ?? m.default ?? NutritionHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MealLog') as ScreenModule;
    MealLogScreen = m.MealLog ?? m.default ?? MealLogScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MealDetail') as ScreenModule;
    MealDetailScreen = m.MealDetail ?? m.default ?? MealDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/FoodDiary') as ScreenModule;
    FoodDiaryScreen = m.FoodDiary ?? m.default ?? FoodDiaryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/MacroTracker') as ScreenModule;
    MacroTrackerScreen = m.MacroTracker ?? m.default ?? MacroTrackerScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/WaterIntake') as ScreenModule;
    WaterIntakeScreen = m.WaterIntake ?? m.default ?? WaterIntakeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/DietaryGoals') as ScreenModule;
    DietaryGoalsScreen = m.DietaryGoals ?? m.default ?? DietaryGoalsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/NutritionInsights') as ScreenModule;
    NutritionInsightsScreen = m.NutritionInsights ?? m.default ?? NutritionInsightsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/FoodSearch') as ScreenModule;
    FoodSearchScreen = m.FoodSearch ?? m.default ?? FoodSearchScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/nutrition/NutritionExport') as ScreenModule;
    NutritionExportScreen = m.NutritionExport ?? m.default ?? NutritionExportScreen;
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
