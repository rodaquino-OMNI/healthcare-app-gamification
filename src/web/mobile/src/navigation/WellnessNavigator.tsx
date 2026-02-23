import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16
import type { WellnessStackParamList } from './types';
import { ROUTES } from '../constants/routes';

// Lazy-loaded wellness screens.
// These screens are created by Worker-3; safe fallbacks if not yet available.
let CompanionChatScreen: React.FC = () => null;
let CompanionChatActiveScreen: React.FC = () => null;
let CompanionQuickRepliesScreen: React.FC = () => null;
let CompanionMoodCheckInScreen: React.FC = () => null;
let CompanionWellnessTipScreen: React.FC = () => null;
let CompanionBreathingScreen: React.FC = () => null;
let CompanionMeditationScreen: React.FC = () => null;
let CompanionDailyPlanScreen: React.FC = () => null;
let CompanionInsightsScreen: React.FC = () => null;
let CompanionGoalsScreen: React.FC = () => null;
let CompanionJournalScreen: React.FC = () => null;
let CompanionJournalHistoryScreen: React.FC = () => null;
let CompanionChallengesScreen: React.FC = () => null;
let CompanionChallengeDetailScreen: React.FC = () => null;
let CompanionStreaksScreen: React.FC = () => null;

try {
  const mod = require('../screens/wellness/CompanionChat');
  CompanionChatScreen = mod.CompanionChatScreen || mod.default || CompanionChatScreen;
} catch {
  // CompanionChat screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionChatActive');
  CompanionChatActiveScreen = mod.CompanionChatActiveScreen || mod.default || CompanionChatActiveScreen;
} catch {
  // CompanionChatActive screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionQuickReplies');
  CompanionQuickRepliesScreen = mod.CompanionQuickRepliesScreen || mod.default || CompanionQuickRepliesScreen;
} catch {
  // CompanionQuickReplies screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionMoodCheckIn');
  CompanionMoodCheckInScreen = mod.CompanionMoodCheckInScreen || mod.default || CompanionMoodCheckInScreen;
} catch {
  // CompanionMoodCheckIn screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionWellnessTip');
  CompanionWellnessTipScreen = mod.CompanionWellnessTipScreen || mod.default || CompanionWellnessTipScreen;
} catch {
  // CompanionWellnessTip screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionBreathing');
  CompanionBreathingScreen = mod.CompanionBreathingScreen || mod.default || CompanionBreathingScreen;
} catch {
  // CompanionBreathing screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionMeditation');
  CompanionMeditationScreen = mod.CompanionMeditationScreen || mod.default || CompanionMeditationScreen;
} catch {
  // CompanionMeditation screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionDailyPlan');
  CompanionDailyPlanScreen = mod.CompanionDailyPlanScreen || mod.default || CompanionDailyPlanScreen;
} catch {
  // CompanionDailyPlan screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionInsights');
  CompanionInsightsScreen = mod.CompanionInsightsScreen || mod.default || CompanionInsightsScreen;
} catch {
  // CompanionInsights screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionGoals');
  CompanionGoalsScreen = mod.CompanionGoalsScreen || mod.default || CompanionGoalsScreen;
} catch {
  // CompanionGoals screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionJournal');
  CompanionJournalScreen = mod.CompanionJournalScreen || mod.default || CompanionJournalScreen;
} catch {
  // CompanionJournal screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionJournalHistory');
  CompanionJournalHistoryScreen = mod.CompanionJournalHistoryScreen || mod.default || CompanionJournalHistoryScreen;
} catch {
  // CompanionJournalHistory screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionChallenges');
  CompanionChallengesScreen = mod.CompanionChallengesScreen || mod.default || CompanionChallengesScreen;
} catch {
  // CompanionChallenges screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionChallengeDetail');
  CompanionChallengeDetailScreen = mod.CompanionChallengeDetailScreen || mod.default || CompanionChallengeDetailScreen;
} catch {
  // CompanionChallengeDetail screen not yet available
}

try {
  const mod = require('../screens/wellness/CompanionStreaks');
  CompanionStreaksScreen = mod.CompanionStreaksScreen || mod.default || CompanionStreaksScreen;
} catch {
  // CompanionStreaks screen not yet available
}

const Stack = createStackNavigator<WellnessStackParamList>();

/**
 * Stack navigator for the AI Wellness Companion (Module 06).
 * Nested inside the Wellness tab of the bottom tab navigator.
 * Provides navigation between chat, mood, breathing, meditation,
 * journal, goals, challenges, and streaks screens.
 */
export default function WellnessNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.WELLNESS_CHAT}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.WELLNESS_CHAT} component={CompanionChatScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_CHAT_ACTIVE} component={CompanionChatActiveScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_QUICK_REPLIES} component={CompanionQuickRepliesScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_MOOD_CHECK_IN} component={CompanionMoodCheckInScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_TIP_DETAIL} component={CompanionWellnessTipScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_BREATHING} component={CompanionBreathingScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_MEDITATION} component={CompanionMeditationScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_DAILY_PLAN} component={CompanionDailyPlanScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_INSIGHTS} component={CompanionInsightsScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_GOALS} component={CompanionGoalsScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_JOURNAL} component={CompanionJournalScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_JOURNAL_HISTORY} component={CompanionJournalHistoryScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_CHALLENGES} component={CompanionChallengesScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_CHALLENGE_DETAIL} component={CompanionChallengeDetailScreen} />
      <Stack.Screen name={ROUTES.WELLNESS_STREAKS} component={CompanionStreaksScreen} />
    </Stack.Navigator>
  );
}
