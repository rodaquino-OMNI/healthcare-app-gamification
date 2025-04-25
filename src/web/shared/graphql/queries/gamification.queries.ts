import { gql } from '@apollo/client'; // v3.7.17
import {
  AchievementFragment,
  QuestFragment,
  RewardFragment,
  GamificationProfileFragment
} from '../fragments/gamification.fragments';
import { JOURNEY_IDS } from '../../constants/journeys';

/**
 * Query to retrieve a user's gamification profile including level, XP,
 * achievements, and quests.
 */
export const GET_GAME_PROFILE = gql`
  query GetGameProfile($userId: ID!) {
    gameProfile(userId: $userId) {
      ...GamificationProfileFragment
    }
  }
  ${GamificationProfileFragment}
`;

/**
 * Query to retrieve achievements for a user with optional
 * filtering by journey (health, care, plan).
 */
export const GET_ACHIEVEMENTS = gql`
  query GetAchievements($userId: ID!, $journey: String) {
    achievements(userId: $userId, journey: $journey) {
      ...AchievementFragment
    }
  }
  ${AchievementFragment}
`;

/**
 * Query to retrieve quests for a user with optional
 * filtering by journey and completion status.
 */
export const GET_QUESTS = gql`
  query GetQuests($userId: ID!, $journey: String, $completed: Boolean) {
    quests(userId: $userId, journey: $journey, completed: $completed) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

/**
 * Query to retrieve rewards for a user with optional
 * filtering by journey.
 */
export const GET_REWARDS = gql`
  query GetRewards($userId: ID!, $journey: String) {
    rewards(userId: $userId, journey: $journey) {
      ...RewardFragment
    }
  }
  ${RewardFragment}
`;

/**
 * Query to retrieve leaderboard data with optional
 * filtering by journey, time period, and limit on number of results.
 */
export const GET_LEADERBOARD = gql`
  query GetLeaderboard($journey: String, $period: String, $limit: Int) {
    leaderboard(journey: $journey, period: $period, limit: $limit) {
      userId
      username
      avatar
      level
      xp
      position
    }
  }
`;

/**
 * Query to retrieve a user's progress in a specific journey,
 * including statistics on achievements, quests, and XP earned.
 */
export const GET_JOURNEY_PROGRESS = gql`
  query GetJourneyProgress($userId: ID!, $journey: String!) {
    journeyProgress(userId: $userId, journey: $journey) {
      journey
      completedAchievements
      totalAchievements
      completedQuests
      totalQuests
      xpEarned
    }
  }
`;