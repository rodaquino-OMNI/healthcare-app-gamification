import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16

import Achievements from '../screens/home/Achievements';
import { ROUTES } from '../constants/routes';

// Lazy-loaded gamification screens.
// These screens are created by Worker-3; safe fallbacks if not yet available.
let AchievementDetailScreen: React.FC = () => null;
let LeaderboardScreen: React.FC = () => null;
let QuestListScreen: React.FC = () => null;
let QuestDetailScreen: React.FC = () => null;
let RewardCatalogScreen: React.FC = () => null;
let RewardDetailScreen: React.FC = () => null;

try {
  const mod = require('../screens/gamification/AchievementDetail');
  AchievementDetailScreen = mod.AchievementDetailScreen || mod.default || AchievementDetailScreen;
} catch {
  // AchievementDetail screen not yet available
}

try {
  const mod = require('../screens/gamification/LeaderboardScreen');
  LeaderboardScreen = mod.LeaderboardScreen || mod.default || LeaderboardScreen;
} catch {
  // LeaderboardScreen not yet available
}

try {
  const mod = require('../screens/gamification/QuestList');
  QuestListScreen = mod.QuestListScreen || mod.default || QuestListScreen;
} catch {
  // QuestList screen not yet available
}

try {
  const mod = require('../screens/gamification/QuestDetail');
  QuestDetailScreen = mod.QuestDetailScreen || mod.default || QuestDetailScreen;
} catch {
  // QuestDetail screen not yet available
}

try {
  const mod = require('../screens/gamification/RewardCatalog');
  RewardCatalogScreen = mod.RewardCatalogScreen || mod.default || RewardCatalogScreen;
} catch {
  // RewardCatalog screen not yet available
}

try {
  const mod = require('../screens/gamification/RewardDetail');
  RewardDetailScreen = mod.RewardDetailScreen || mod.default || RewardDetailScreen;
} catch {
  // RewardDetail screen not yet available
}

const Stack = createStackNavigator();

/**
 * Stack navigator for the Gamification journey.
 * Nested inside the Achievements tab of the bottom tab navigator.
 * Provides navigation between achievements, leaderboard, quests, and rewards screens.
 */
export default function GamificationNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.GAMIFICATION_ACHIEVEMENTS}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.GAMIFICATION_ACHIEVEMENTS} component={Achievements} />
      <Stack.Screen name={ROUTES.GAMIFICATION_DETAIL} component={AchievementDetailScreen} />
      <Stack.Screen name={ROUTES.GAMIFICATION_LEADERBOARD} component={LeaderboardScreen} />
      <Stack.Screen name={ROUTES.GAMIFICATION_QUESTS} component={QuestListScreen} />
      <Stack.Screen name={ROUTES.GAMIFICATION_QUEST_DETAIL} component={QuestDetailScreen} />
      <Stack.Screen name={ROUTES.GAMIFICATION_REWARDS} component={RewardCatalogScreen} />
      <Stack.Screen name={ROUTES.GAMIFICATION_REWARD_DETAIL} component={RewardDetailScreen} />
    </Stack.Navigator>
  );
}
