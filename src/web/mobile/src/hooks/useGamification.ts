import { useQuery } from '@apollo/client'; // Version 3.0+
import { gql } from '@apollo/client';
import { GameProfile } from 'src/web/shared/types/gamification.types';
import { getGameProfile, getAchievements, getQuests, getRewards } from 'src/web/mobile/src/api/gamification';
import { useAuth } from 'src/web/mobile/src/context/AuthContext';

// GraphQL query to fetch a user's game profile
const GET_GAME_PROFILE = gql`
  query GetGameProfile($userId: ID!) {
    gameProfile(userId: $userId) {
      level
      xp
      achievements {
        id
        title
        description
        journey
        icon
        progress
        total
        unlocked
      }
      quests {
        id
        title
        description
        journey
        icon
        progress
        total
        completed
      }
    }
  }
`;

// GraphQL query to fetch a user's achievements
const GET_ACHIEVEMENTS = gql`
  query GetAchievements($userId: ID!) {
    achievements(userId: $userId) {
      id
      title
      description
      journey
      icon
      progress
      total
      unlocked
    }
  }
`;

// GraphQL query to fetch a user's quests
const GET_QUESTS = gql`
  query GetQuests($userId: ID!) {
    quests(userId: $userId) {
      id
      title
      description
      journey
      icon
      progress
      total
      completed
    }
  }
`;

// GraphQL query to fetch a user's rewards
const GET_REWARDS = gql`
  query GetRewards($userId: ID!) {
    rewards(userId: $userId) {
      id
      title
      description
      journey
      icon
      xp
    }
  }
`;

/**
 * Fetches and provides the game profile for the currently authenticated user.
 * @returns The user's game profile, or undefined if not loaded or an error occurred.
 */
export function useGameProfile(): GameProfile | undefined {
  const { userId } = useAuth();
  
  const { data } = useQuery(GET_GAME_PROFILE, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching game profile:', error);
    }
  });
  
  return data?.gameProfile;
}

/**
 * Fetches and provides the achievements for the currently authenticated user.
 * @returns The user's achievements, or undefined if not loaded or an error occurred.
 */
export function useAchievements() {
  const { userId } = useAuth();
  
  const { data } = useQuery(GET_ACHIEVEMENTS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching achievements:', error);
    }
  });
  
  return data?.achievements;
}

/**
 * Fetches and provides the quests for the currently authenticated user.
 * @returns The user's quests, or undefined if not loaded or an error occurred.
 */
export function useQuests() {
  const { userId } = useAuth();
  
  const { data } = useQuery(GET_QUESTS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching quests:', error);
    }
  });
  
  return data?.quests;
}

/**
 * Fetches and provides the rewards for the currently authenticated user.
 * @returns The user's rewards, or undefined if not loaded or an error occurred.
 */
export function useRewards() {
  const { userId } = useAuth();
  
  const { data } = useQuery(GET_REWARDS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching rewards:', error);
    }
  });
  
  return data?.rewards;
}