import { gql } from '@apollo/client'; // v3.7.17

/**
 * Mutation to claim a reward for a user
 */
export const CLAIM_REWARD = gql`
    mutation ClaimReward($rewardId: ID!) {
        claimReward(rewardId: $rewardId) {
            id
            title
            description
            icon
            type
            value
        }
    }
`;

/**
 * Mutation to complete a task within a quest for a user
 */
export const COMPLETE_QUEST_TASK = gql`
    mutation CompleteQuestTask($questId: ID!, $taskId: ID!) {
        completeQuestTask(questId: $questId, taskId: $taskId) {
            id
            title
            description
            journey
            progress
            total
            completed
        }
    }
`;

/**
 * Mutation to acknowledge an achievement by a user
 */
export const ACKNOWLEDGE_ACHIEVEMENT = gql`
    mutation AcknowledgeAchievement($achievementId: ID!) {
        acknowledgeAchievement(achievementId: $achievementId) {
            id
            title
            description
            icon
            progress
            total
            unlocked
            journey
        }
    }
`;
