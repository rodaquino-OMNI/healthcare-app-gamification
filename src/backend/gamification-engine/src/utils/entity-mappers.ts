import { Achievement } from '../achievements/entities/achievement.entity';
import { UserAchievement } from '../achievements/entities/user-achievement.entity';
import { GameProfile } from '../profiles/entities/game-profile.entity';

// Define types based on Prisma schema
type PrismaGameProfile = {
    id: string;
    userId: string;
    level: number;
    xp: number;
    createdAt: Date;
    updatedAt: Date;
};

type PrismaAchievement = {
    id: string;
    title: string;
    description: string;
    journey: string;
    icon: string;
    xpReward: number;
};

type PrismaUserAchievement = {
    profileId: string;
    achievementId: string;
    progress: number;
    unlocked: boolean;
    unlockedAt: Date | null;
};

/**
 * Maps a Prisma GameProfile to a domain GameProfile entity
 */
export function mapToDomainGameProfile(
    prismaProfile: PrismaGameProfile & {
        achievements?: (PrismaUserAchievement & { achievement?: PrismaAchievement })[];
    }
): GameProfile {
    return {
        id: prismaProfile.id,
        userId: prismaProfile.userId,
        level: prismaProfile.level,
        xp: prismaProfile.xp,
        achievements: prismaProfile.achievements?.map(mapToDomainUserAchievement) || [],
        createdAt: prismaProfile.createdAt,
        updatedAt: prismaProfile.updatedAt,
    } as GameProfile;
}

/**
 * Maps a Prisma UserAchievement to a domain UserAchievement entity
 */
export function mapToDomainUserAchievement(
    prismaUserAchievement: PrismaUserAchievement & { achievement?: PrismaAchievement }
): UserAchievement {
    const userAchievement = new UserAchievement();
    userAchievement.profileId = prismaUserAchievement.profileId;
    userAchievement.achievementId = prismaUserAchievement.achievementId;
    userAchievement.progress = prismaUserAchievement.progress;
    userAchievement.unlocked = prismaUserAchievement.unlocked;
    // Handle the null vs undefined type issue
    userAchievement.unlockedAt = prismaUserAchievement.unlockedAt ?? undefined;

    if (prismaUserAchievement.achievement) {
        userAchievement.achievement = mapToDomainAchievement(prismaUserAchievement.achievement);
    }

    return userAchievement;
}

/**
 * Maps a Prisma Achievement to a domain Achievement entity
 */
export function mapToDomainAchievement(prismaAchievement: PrismaAchievement): Achievement {
    const achievement = new Achievement();
    achievement.id = prismaAchievement.id;
    achievement.title = prismaAchievement.title;
    achievement.description = prismaAchievement.description;
    achievement.journey = prismaAchievement.journey;
    achievement.icon = prismaAchievement.icon;
    achievement.xpReward = prismaAchievement.xpReward;

    return achievement;
}
