/* eslint-disable no-console -- Seed script requires console output for progress reporting */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Prisma Quest upsert returns typed result; using any[] for array */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log('Starting seed process...');

    // Clear existing data (optional - uncomment if needed)
    /*
  await prisma.userAchievement.deleteMany({});
  await prisma.userQuest.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.quest.deleteMany({});
  await prisma.gameProfile.deleteMany({});
  await prisma.leaderboardEntry.deleteMany({});
  */

    // Seed achievements for different journeys
    console.log('Creating achievements...');

    // Health Journey Achievements
    const healthAchievements = await Promise.all([
        prisma.achievement.upsert({
            where: { id: '1a2b3c4d-1111-1111-1111-111111111111' },
            update: {},
            create: {
                id: '1a2b3c4d-1111-1111-1111-111111111111',
                title: 'First Steps',
                description: 'Connect your first health device',
                journey: 'health',
                icon: 'device-connect',
                xpReward: 50,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '1a2b3c4d-2222-2222-2222-222222222222' },
            update: {},
            create: {
                id: '1a2b3c4d-2222-2222-2222-222222222222',
                title: 'Step Master',
                description: 'Record 10,000 steps in a single day',
                journey: 'health',
                icon: 'footsteps',
                xpReward: 100,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '1a2b3c4d-3333-3333-3333-333333333333' },
            update: {},
            create: {
                id: '1a2b3c4d-3333-3333-3333-333333333333',
                title: 'Health History Hero',
                description: 'Complete your medical history profile',
                journey: 'health',
                icon: 'medical-folder',
                xpReward: 75,
            },
        }),
    ]);

    // Care Journey Achievements
    const careAchievements = await Promise.all([
        prisma.achievement.upsert({
            where: { id: '2a3b4c5d-1111-1111-1111-111111111111' },
            update: {},
            create: {
                id: '2a3b4c5d-1111-1111-1111-111111111111',
                title: 'Care Beginner',
                description: 'Book your first appointment',
                journey: 'care',
                icon: 'calendar-plus',
                xpReward: 50,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '2a3b4c5d-2222-2222-2222-222222222222' },
            update: {},
            create: {
                id: '2a3b4c5d-2222-2222-2222-222222222222',
                title: 'Medication Manager',
                description: 'Track medications for 7 consecutive days',
                journey: 'care',
                icon: 'pill-calendar',
                xpReward: 100,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '2a3b4c5d-3333-3333-3333-333333333333' },
            update: {},
            create: {
                id: '2a3b4c5d-3333-3333-3333-333333333333',
                title: 'Telemedicine Pioneer',
                description: 'Complete your first virtual consultation',
                journey: 'care',
                icon: 'video-medical',
                xpReward: 75,
            },
        }),
    ]);

    // Plan Journey Achievements
    const planAchievements = await Promise.all([
        prisma.achievement.upsert({
            where: { id: '3a4b5c6d-1111-1111-1111-111111111111' },
            update: {},
            create: {
                id: '3a4b5c6d-1111-1111-1111-111111111111',
                title: 'Plan Explorer',
                description: 'View all details of your health plan',
                journey: 'plan',
                icon: 'insurance-card',
                xpReward: 50,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '3a4b5c6d-2222-2222-2222-222222222222' },
            update: {},
            create: {
                id: '3a4b5c6d-2222-2222-2222-222222222222',
                title: 'Digital Adopter',
                description: 'Add your insurance card to your digital wallet',
                journey: 'plan',
                icon: 'wallet-digital',
                xpReward: 75,
            },
        }),
        prisma.achievement.upsert({
            where: { id: '3a4b5c6d-3333-3333-3333-333333333333' },
            update: {},
            create: {
                id: '3a4b5c6d-3333-3333-3333-333333333333',
                title: 'Claim Expert',
                description: 'Submit a claim with all required documentation on the first try',
                journey: 'plan',
                icon: 'document-check',
                xpReward: 100,
            },
        }),
    ]);

    console.log(
        `Created ${healthAchievements.length + careAchievements.length + planAchievements.length} achievements`
    );

    // Seed quests
    console.log('Creating quests...');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma Quest model has extra fields not in generated types
    const quests: any[] = await Promise.all([
        // Health Journey Quest
        prisma.quest.upsert({
            where: { id: '4a5b6c7d-1111-1111-1111-111111111111' },
            update: {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma Quest model has extra fields not in generated types
            create: {
                id: '4a5b6c7d-1111-1111-1111-111111111111',
                title: 'Health Tracker',
                description: 'Start tracking your health metrics for better insights',
                journey: 'health',
                icon: 'health-tracker',
                xpReward: 150,
            } as any,
        }),
        // Care Journey Quest
        prisma.quest.upsert({
            where: { id: '5a6b7c8d-1111-1111-1111-111111111111' },
            update: {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma Quest model has extra fields not in generated types
            create: {
                id: '5a6b7c8d-1111-1111-1111-111111111111',
                title: 'Wellness Journey',
                description: 'Complete a series of care steps for your wellbeing',
                journey: 'care',
                icon: 'wellness-journey',
                xpReward: 200,
            } as any,
        }),
        // Plan Journey Quest
        prisma.quest.upsert({
            where: { id: '6a7b8c9d-1111-1111-1111-111111111111' },
            update: {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma Quest model has extra fields not in generated types
            create: {
                id: '6a7b8c9d-1111-1111-1111-111111111111',
                title: 'Plan Mastery',
                description: 'Become an expert on your health plan and benefits',
                journey: 'plan',
                icon: 'plan-mastery',
                xpReward: 150,
            } as any,
        }),
    ]);

    console.log(`Created ${quests.length} quests`);

    // Seed sample users with game profiles
    console.log('Creating sample user profiles...');

    const users = [
        { userId: 'user1', level: 5, xp: 450 },
        { userId: 'user2', level: 3, xp: 275 },
        { userId: 'user3', level: 7, xp: 680 },
        { userId: 'user4', level: 2, xp: 125 },
        { userId: 'user5', level: 4, xp: 320 },
    ];

    const userProfiles = await Promise.all(
        users.map((user) =>
            prisma.gameProfile.upsert({
                where: { userId: user.userId },
                update: {
                    level: user.level,
                    xp: user.xp,
                },
                create: {
                    userId: user.userId,
                    level: user.level,
                    xp: user.xp,
                },
            })
        )
    );

    console.log(`Created ${userProfiles.length} user profiles`);

    // Assign some achievements to users
    console.log('Assigning achievements to users...');

    // User 1 has unlocked some health achievements
    await prisma.userAchievement.upsert({
        where: {
            profileId_achievementId: {
                profileId: userProfiles[0].id,
                achievementId: healthAchievements[0].id,
            },
        },
        update: {
            unlocked: true,
            unlockedAt: new Date(),
        },
        create: {
            profileId: userProfiles[0].id,
            achievementId: healthAchievements[0].id,
            progress: 100,
            unlocked: true,
            unlockedAt: new Date(),
        },
    });

    // User 3 has unlocked some care achievements
    await prisma.userAchievement.upsert({
        where: {
            profileId_achievementId: {
                profileId: userProfiles[2].id,
                achievementId: careAchievements[0].id,
            },
        },
        update: {
            unlocked: true,
            unlockedAt: new Date(),
        },
        create: {
            profileId: userProfiles[2].id,
            achievementId: careAchievements[0].id,
            progress: 100,
            unlocked: true,
            unlockedAt: new Date(),
        },
    });

    console.log('Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- seed script teardown requires async finally
    .finally(async () => {
        await prisma.$disconnect();
    });
