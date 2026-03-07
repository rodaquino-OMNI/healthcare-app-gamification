import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { Card } from '../../components/Card/Card';
import { AchievementBadge } from '../AchievementBadge/AchievementBadge';

/**
 * Props for the Leaderboard component
 */
export interface LeaderboardProps {
    /**
     * An array of objects containing user data for the leaderboard.
     */
    leaderboardData: Array<{
        userId: string;
        username: string;
        score: number;
        rank: number;
        isCurrentUser?: boolean;
        achievement?: {
            id: string;
            title: string;
            description: string;
            icon: string;
            progress: number;
            total: number;
            unlocked: boolean;
            journey: string;
        };
    }>;

    /**
     * The journey to which the leaderboard belongs (health, care, or plan).
     */
    journey: 'health' | 'care' | 'plan';
}

const LeaderboardHeader = styled.div`
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid ${colors.neutral.gray200};
`;

const LeaderboardTitle = styled.h2`
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray900};
    margin: 0;
`;

const LeaderboardList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const LeaderboardItem = styled.li<{ isCurrentUser?: boolean; journey?: string }>`
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    background-color: ${(props) =>
        props.isCurrentUser && props.journey
            ? colors.journeys[props.journey as keyof typeof colors.journeys].background
            : 'transparent'};

    &:hover {
        background-color: ${colors.neutral.gray100};
    }
`;

const Rank = styled.div`
    font-size: ${typography.fontSize.md};
    font-weight: ${typography.fontWeight.bold};
    width: 32px;
    text-align: center;
    color: ${colors.neutral.gray800};
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;

const Username = styled.div`
    font-size: ${typography.fontSize.md};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.neutral.gray900};
    margin-right: 8px;
`;

const Score = styled.div`
    font-size: ${typography.fontSize.md};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray800};
    margin-left: auto;
`;

/**
 * A component that displays a leaderboard with user rankings.
 * This component is part of the gamification system and shows users ranked by score or XP.
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboardData, journey }) => {
    return (
        <Card journey={journey}>
            <LeaderboardHeader>
                <LeaderboardTitle>Classificação</LeaderboardTitle>
            </LeaderboardHeader>

            <LeaderboardList aria-label="Leaderboard rankings">
                {leaderboardData.map((item) => (
                    <LeaderboardItem
                        key={item.userId}
                        isCurrentUser={item.isCurrentUser}
                        journey={journey}
                        aria-label={`Rank ${item.rank}, ${item.username}, Score ${item.score}`}
                    >
                        <Rank aria-hidden="true">{item.rank}</Rank>

                        <UserInfo>
                            <Username>{item.username}</Username>

                            {item.achievement && (
                                <AchievementBadge
                                    achievement={{
                                        ...item.achievement,
                                        journey,
                                    }}
                                    size="sm"
                                />
                            )}
                        </UserInfo>

                        <Score>{item.score} XP</Score>
                    </LeaderboardItem>
                ))}
            </LeaderboardList>
        </Card>
    );
};
