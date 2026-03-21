/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ROUTES } from '../../constants/routes';
import type { WellnessResourcesParamList } from '../types';

// Lazy-loaded screens (require + try/catch for resilience)
let WellnessResourcesHomeScreen: React.ComponentType<unknown> = () => null;
let ArticleListScreen: React.ComponentType<unknown> = () => null;
let ArticleDetailScreen: React.ComponentType<unknown> = () => null;
let VideoLibraryScreen: React.ComponentType<unknown> = () => null;
let VideoPlayerScreen: React.ComponentType<unknown> = () => null;
let WellnessProgramsScreen: React.ComponentType<unknown> = () => null;
let ProgramDetailScreen: React.ComponentType<unknown> = () => null;
let WellnessBookmarksScreen: React.ComponentType<unknown> = () => null;

try {
    const m = require('../../screens/health/wellness-resources/WellnessResourcesHome');
    WellnessResourcesHomeScreen = m.WellnessResourcesHome || m.default || WellnessResourcesHomeScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ArticleList');
    ArticleListScreen = m.ArticleList || m.default || ArticleListScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ArticleDetail');
    ArticleDetailScreen = m.ArticleDetail || m.default || ArticleDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/VideoLibrary');
    VideoLibraryScreen = m.VideoLibrary || m.default || VideoLibraryScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/VideoPlayer');
    VideoPlayerScreen = m.VideoPlayer || m.default || VideoPlayerScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/WellnessPrograms');
    WellnessProgramsScreen = m.WellnessPrograms || m.default || WellnessProgramsScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/ProgramDetail');
    ProgramDetailScreen = m.ProgramDetail || m.default || ProgramDetailScreen;
} catch {
    /* not available */
}
try {
    const m = require('../../screens/health/wellness-resources/WellnessBookmarks');
    WellnessBookmarksScreen = m.WellnessBookmarks || m.default || WellnessBookmarksScreen;
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
