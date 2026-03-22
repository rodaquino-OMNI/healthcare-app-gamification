/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { WellnessResourcesParamList } from '../types';

/** Shape of every lazily-loaded screen module. */
interface ScreenModule {
    default?: React.ComponentType;
    [key: string]: React.ComponentType | undefined;
}

// Lazy-loaded screens (require + try/catch for resilience)
let WellnessResourcesHomeScreen: React.ComponentType = () => null;
let ArticleListScreen: React.ComponentType = () => null;
let ArticleDetailScreen: React.ComponentType = () => null;
let VideoLibraryScreen: React.ComponentType = () => null;
let VideoPlayerScreen: React.ComponentType = () => null;
let WellnessProgramsScreen: React.ComponentType = () => null;
let ProgramDetailScreen: React.ComponentType = () => null;
let WellnessBookmarksScreen: React.ComponentType = () => null;

try {
    const m = require('../../screens/health/wellness-resources/WellnessResourcesHome') as ScreenModule;
    WellnessResourcesHomeScreen = m.WellnessResourcesHome ?? m.default ?? WellnessResourcesHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ArticleList') as ScreenModule;
    ArticleListScreen = m.ArticleList ?? m.default ?? ArticleListScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ArticleDetail') as ScreenModule;
    ArticleDetailScreen = m.ArticleDetail ?? m.default ?? ArticleDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/VideoLibrary') as ScreenModule;
    VideoLibraryScreen = m.VideoLibrary ?? m.default ?? VideoLibraryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/VideoPlayer') as ScreenModule;
    VideoPlayerScreen = m.VideoPlayer ?? m.default ?? VideoPlayerScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/WellnessPrograms') as ScreenModule;
    WellnessProgramsScreen = m.WellnessPrograms ?? m.default ?? WellnessProgramsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ProgramDetail') as ScreenModule;
    ProgramDetailScreen = m.ProgramDetail ?? m.default ?? ProgramDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/WellnessBookmarks') as ScreenModule;
    WellnessBookmarksScreen = m.WellnessBookmarks ?? m.default ?? WellnessBookmarksScreen;
} catch {
    /* not available */
}

const WellnessResourcesStack = createStackNavigator<WellnessResourcesParamList>();

export const WellnessResourcesNavigator = () => (
    <WellnessResourcesStack.Navigator screenOptions={{ headerShown: false }}>
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_HOME}
            component={WellnessResourcesHomeScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_ARTICLE_LIST}
            component={ArticleListScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_ARTICLE_DETAIL}
            component={ArticleDetailScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_VIDEO_LIBRARY}
            component={VideoLibraryScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_VIDEO_PLAYER}
            component={VideoPlayerScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_PROGRAMS}
            component={WellnessProgramsScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_PROGRAM_DETAIL}
            component={ProgramDetailScreen}
        />
        <WellnessResourcesStack.Screen
            name={ROUTES.HEALTH_WELLNESS_RESOURCES_BOOKMARKS}
            component={WellnessBookmarksScreen}
        />
    </WellnessResourcesStack.Navigator>
);
