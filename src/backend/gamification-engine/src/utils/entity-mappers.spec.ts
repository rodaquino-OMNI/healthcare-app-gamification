import { mapToDomainGameProfile, mapToDomainUserAchievement, mapToDomainAchievement } from './entity-mappers';

describe('Entity Mappers', () => {
    describe('mapToDomainAchievement', () => {
        it('should map prisma achievement to domain achievement', () => {
            const prisma = {
                id: 'ach-1',
                title: 'First Steps',
                description: 'Walk 1000 steps',
                journey: 'health',
                icon: 'steps',
                xpReward: 100,
            };

            const result = mapToDomainAchievement(prisma);

            expect(result.id).toBe('ach-1');
            expect(result.title).toBe('First Steps');
            expect(result.description).toBe('Walk 1000 steps');
            expect(result.journey).toBe('health');
            expect(result.icon).toBe('steps');
            expect(result.xpReward).toBe(100);
        });
    });

    describe('mapToDomainUserAchievement', () => {
        it('should map prisma user achievement to domain user achievement', () => {
            const prisma = {
                profileId: 'profile-1',
                achievementId: 'ach-1',
                progress: 50,
                unlocked: false,
                unlockedAt: null,
            };

            const result = mapToDomainUserAchievement(prisma);

            expect(result.profileId).toBe('profile-1');
            expect(result.achievementId).toBe('ach-1');
            expect(result.progress).toBe(50);
            expect(result.unlocked).toBe(false);
            expect(result.unlockedAt).toBeUndefined();
        });

        it('should include achievement when present', () => {
            const prisma = {
                profileId: 'profile-1',
                achievementId: 'ach-1',
                progress: 100,
                unlocked: true,
                unlockedAt: new Date('2024-01-01'),
                achievement: {
                    id: 'ach-1',
                    title: 'First Steps',
                    description: 'Walk 1000 steps',
                    journey: 'health',
                    icon: 'steps',
                    xpReward: 100,
                },
            };

            const result = mapToDomainUserAchievement(prisma);

            expect(result.achievement).toBeDefined();
            expect(result.achievement!.title).toBe('First Steps');
            expect(result.unlockedAt).toEqual(new Date('2024-01-01'));
        });
    });

    describe('mapToDomainGameProfile', () => {
        it('should map prisma game profile to domain game profile', () => {
            const prisma = {
                id: 'profile-1',
                userId: 'user-1',
                level: 5,
                xp: 500,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-15'),
            };

            const result = mapToDomainGameProfile(prisma);

            expect(result.id).toBe('profile-1');
            expect(result.userId).toBe('user-1');
            expect(result.level).toBe(5);
            expect(result.xp).toBe(500);
        });

        it('should map achievements when present', () => {
            const prisma = {
                id: 'profile-1',
                userId: 'user-1',
                level: 5,
                xp: 500,
                createdAt: new Date(),
                updatedAt: new Date(),
                achievements: [
                    {
                        profileId: 'profile-1',
                        achievementId: 'ach-1',
                        progress: 100,
                        unlocked: true,
                        unlockedAt: new Date(),
                        achievement: {
                            id: 'ach-1',
                            title: 'First Steps',
                            description: 'Walk 1000 steps',
                            journey: 'health',
                            icon: 'steps',
                            xpReward: 100,
                        },
                    },
                ],
            };

            const result = mapToDomainGameProfile(prisma);

            expect(result.achievements).toHaveLength(1);
        });

        it('should default to empty achievements when none present', () => {
            const prisma = {
                id: 'profile-1',
                userId: 'user-1',
                level: 1,
                xp: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = mapToDomainGameProfile(prisma);

            expect(result.achievements).toEqual([]);
        });
    });
});
