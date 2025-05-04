import { GameProfile as PrismaGameProfile, Achievement as PrismaAchievement, UserAchievement as PrismaUserAchievement } from '@prisma/client';
import { GameProfile } from '../profiles/entities/game-profile.entity';
import { UserAchievement } from '../achievements/entities/user-achievement.entity';
import { Achievement } from '../achievements/entities/achievement.entity';

/**
 * Maps a Prisma GameProfile to a domain GameProfile entity
 */
export function mapToDomainGameProfile(
  prismaProfile: PrismaGameProfile & { 
    achievements?: PrismaUserAchievement[] & { achievement?: PrismaAchievement }[]
  }
): GameProfile {
  return {
    id: prismaProfile.id,
    userId: prismaProfile.userId,
    level: prismaProfile.level,
    xp: prismaProfile.xp,
    achievements: prismaProfile.achievements?.map(mapToDomainUserAchievement) || [],
    createdAt: prismaProfile.createdAt,
    updatedAt: prismaProfile.updatedAt
  };
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
  userAchievement.unlockedAt = prismaUserAchievement.unlockedAt;
  
  if (prismaUserAchievement.achievement) {
    userAchievement.achievement = mapToDomainAchievement(prismaUserAchievement.achievement);
  }
  
  return userAchievement;
}

/**
 * Maps a Prisma Achievement to a domain Achievement entity
 */
export function mapToDomainAchievement(
  prismaAchievement: PrismaAchievement
): Achievement {
  const achievement = new Achievement();
  achievement.id = prismaAchievement.id;
  achievement.title = prismaAchievement.title;
  achievement.description = prismaAchievement.description;
  achievement.journey = prismaAchievement.journey;
  achievement.icon = prismaAchievement.icon;
  achievement.xpReward = prismaAchievement.xpReward;
  
  return achievement;
}