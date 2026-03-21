/**
 * Gamification API default export
 *
 * Provides a single default export object containing all gamification functions
 * for backwards compatibility with `import gamification from './gamification'`.
 */

import {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    getJourneyAchievements,
    acknowledgeAchievement,
    triggerGamificationEvent,
    updateGameProfile,
    getAchievementDetail,
    getQuestDetail,
    getRewardDetail,
    acknowledgeReward,
    getAchievementProgress,
} from './gamification-achievements';
import {
    getLeaderboard,
    updateQuestProgress,
    completeQuest,
    redeemReward,
    getRewardHistory,
    getStreakStatus,
    updateStreak,
    getXpHistory,
    getLevelProgress,
    getJourneyQuests,
    getDailyChallenge,
    getWeeklyChallenge,
} from './gamification-challenges';

export default {
    getGameProfile,
    getUserAchievements,
    getUserQuests,
    getUserRewards,
    getJourneyAchievements,
    acknowledgeAchievement,
    triggerGamificationEvent,
    updateGameProfile,
    getLeaderboard,
    updateQuestProgress,
    completeQuest,
    redeemReward,
    getRewardHistory,
    getStreakStatus,
    updateStreak,
    getAchievementDetail,
    getQuestDetail,
    getRewardDetail,
    getXpHistory,
    getLevelProgress,
    getJourneyQuests,
    acknowledgeReward,
    getAchievementProgress,
    getDailyChallenge,
    getWeeklyChallenge,
};
