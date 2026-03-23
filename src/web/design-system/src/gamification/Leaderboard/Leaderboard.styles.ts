import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { breakpoints } from '../../tokens/breakpoints';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

type JourneyType = 'health' | 'care' | 'plan';

/**
 * The main container for the leaderboard
 */
export const LeaderboardContainer = styled.div<{ journey?: JourneyType }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: ${colors.gray[0]};
    border-radius: ${borderRadius.md};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    padding: ${spacing.md};
    border-top: 4px solid ${({ journey }) => (journey ? colors.journeys[journey].primary : colors.brand.primary)};
`;

/**
 * The header section of the leaderboard
 */
export const LeaderboardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing.md};
`;

/**
 * The title of the leaderboard
 */
export const LeaderboardTitle = styled.h3<{ journey?: JourneyType }>`
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ journey }) => (journey ? colors.journeys[journey].primary : colors.brand.primary)};
    margin: 0;
`;

/**
 * The list containing leaderboard entries
 */
export const LeaderboardList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    max-height: 400px;
`;

/**
 * A single item in the leaderboard list
 */
export const LeaderboardItem = styled.li<{ isCurrentUser?: boolean; rank: number }>`
    display: flex;
    align-items: center;
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.xs};
    margin-bottom: ${spacing.xs};
    background-color: ${({ isCurrentUser }) => (isCurrentUser ? colors.gray[10] : 'transparent')};

    ${({ rank }) =>
        rank <= 3 &&
        `
    border-left: 4px solid ${
        rank === 1 ? colors.gamification.gold : rank === 2 ? colors.gamification.silver : colors.gamification.bronze
    };
  `}

    &:hover {
        background-color: ${colors.gray[10]};
    }

    @media (min-width: ${breakpoints.md}) {
        padding: ${spacing.md};
    }
`;

/**
 * The rank number of a leaderboard item
 */
export const Rank = styled.div<{ rank: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: ${sizing.component.sm};
    height: ${sizing.component.sm};
    border-radius: ${borderRadius.full};
    font-weight: ${typography.fontWeight.bold};
    font-size: ${typography.fontSize.sm};
    margin-right: ${spacing.md};

    ${({ rank }) => {
        if (rank === 1) {
            return `
        background-color: ${colors.gamification.goldBg};
        color: ${colors.gamification.goldText};
      `;
        } else if (rank === 2) {
            return `
        background-color: ${colors.gamification.silverBg};
        color: ${colors.gamification.silverText};
      `;
        } else if (rank === 3) {
            return `
        background-color: ${colors.gamification.bronzeBg};
        color: ${colors.gamification.bronzeText};
      `;
        }
        return `
      background-color: ${colors.gray[10]};
      color: ${colors.gray[80]};
    `;
    }}

    @media (min-width: ${breakpoints.md}) {
        min-width: ${sizing.component.md};
        height: ${sizing.component.md};
        font-size: ${typography.fontSize.md};
    }
`;

/**
 * Container for user information in a leaderboard item
 */
export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0; // This is needed for text-overflow to work
`;

/**
 * The username of a leaderboard item
 */
export const Username = styled.span`
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray900};
    margin-bottom: ${spacing.xs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

/**
 * The score of a leaderboard item
 */
export const Score = styled.span<{ journey?: JourneyType }>`
    display: flex;
    align-items: center;
    font-weight: ${typography.fontWeight.bold};
    color: ${({ journey }) => (journey ? colors.journeys[journey].primary : colors.brand.primary)};
    margin-left: auto;
    padding-left: ${spacing.md};
`;
