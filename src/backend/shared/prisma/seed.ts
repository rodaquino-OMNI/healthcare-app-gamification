/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Seeds the database with initial data.
 *
 * @returns A promise that resolves when the database is seeded.
 */
async function seed(): Promise<void> {
    console.log('Starting database seeding...');

    // Create a standard PrismaClient for data operations
    const prisma = new PrismaClient();

    try {
        // Clean the database first to ensure a consistent state
        console.log('Cleaning database...');
        // Note: cleanDatabase is handled by PrismaService in test context; skip in seed

        // Create permissions
        console.log('Creating permissions...');
        await seedPermissions(prisma);

        // Create roles
        console.log('Creating roles...');
        await seedRoles(prisma);

        // Create users
        console.log('Creating users...');
        await seedUsers(prisma);

        // Create journey-specific data
        console.log('Creating journey-specific data...');
        await seedJourneyData(prisma);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error as any;
    } finally {
        // Close the database connection
        await prisma.$disconnect();
    }
}

/**
 * Seeds permissions for all journeys.
 *
 * @param prisma - The Prisma client instance
 */
async function seedPermissions(prisma: PrismaClient): Promise<void> {
    // Health journey permissions
    const healthPermissions = [
        { name: 'health:metrics:read', description: 'View health metrics' },
        { name: 'health:metrics:write', description: 'Record health metrics' },
        { name: 'health:history:read', description: 'View medical history' },
        { name: 'health:history:write', description: 'Update medical history' },
        { name: 'health:goals:read', description: 'View health goals' },
        { name: 'health:goals:write', description: 'Set health goals' },
        { name: 'health:devices:read', description: 'View connected devices' },
        { name: 'health:devices:write', description: 'Manage device connections' },
    ];

    // Care journey permissions
    const carePermissions = [
        { name: 'care:appointments:read', description: 'View appointments' },
        { name: 'care:appointments:write', description: 'Manage appointments' },
        { name: 'care:telemedicine:read', description: 'View telemedicine sessions' },
        { name: 'care:telemedicine:write', description: 'Manage telemedicine sessions' },
        { name: 'care:medications:read', description: 'View medications' },
        { name: 'care:medications:write', description: 'Manage medications' },
        { name: 'care:treatments:read', description: 'View treatment plans' },
        { name: 'care:treatments:write', description: 'Manage treatment plans' },
    ];

    // Plan journey permissions
    const planPermissions = [
        { name: 'plan:coverage:read', description: 'View coverage information' },
        { name: 'plan:claims:read', description: 'View claims' },
        { name: 'plan:claims:write', description: 'Submit and manage claims' },
        { name: 'plan:benefits:read', description: 'View benefits' },
        { name: 'plan:documents:read', description: 'View insurance documents' },
        { name: 'plan:documents:write', description: 'Upload insurance documents' },
        { name: 'plan:payments:read', description: 'View payment information' },
        { name: 'plan:simulator:use', description: 'Use cost simulator' },
    ];

    // Gamification permissions
    const gamificationPermissions = [
        { name: 'game:achievements:read', description: 'View achievements' },
        { name: 'game:progress:read', description: 'View progress' },
        { name: 'game:rewards:read', description: 'View rewards' },
        { name: 'game:rewards:redeem', description: 'Redeem rewards' },
        { name: 'game:leaderboard:read', description: 'View leaderboards' },
    ];

    const allPermissions = [...healthPermissions, ...carePermissions, ...planPermissions, ...gamificationPermissions];

    // Create all permissions in the database
    console.log(`Creating ${allPermissions.length} permissions...`);
    for (const permission of allPermissions) {
        try {
            // Check if the permission already exists by name
            const existing = await prisma.permission.findFirst({
                where: { name: permission.name },
            });
            if (!existing) {
                await prisma.permission.create({ data: permission });
            }
        } catch (error) {
            // If creation fails due to unique constraint, just log and continue
            if ((error as any).code === 'P2002') {
                console.log(`Permission ${permission.name} already exists, skipping...`);
            } else {
                // For other errors, re-throw
                throw error as any;
            }
        }
    }
}

/**
 * Seeds roles and assigns permissions to them.
 *
 * @param prisma - The Prisma client instance
 */
async function seedRoles(prisma: PrismaClient): Promise<void> {
    // Get all permissions
    const permissions = await prisma.permission.findMany();
    const permissionsByName = new Map();

    // Create a map of permission names to IDs
    permissions.forEach((permission) => {
        permissionsByName.set(permission.name, permission);
    });

    // Define roles with their permissions
    const roles = [
        {
            name: 'User',
            description: 'Standard user with access to all journeys',
            isDefault: true,
            journey: null,
            permissions: [
                // Health journey - basic access
                'health:metrics:read',
                'health:metrics:write',
                'health:history:read',
                'health:goals:read',
                'health:goals:write',
                'health:devices:read',
                'health:devices:write',

                // Care journey - basic access
                'care:appointments:read',
                'care:appointments:write',
                'care:telemedicine:read',
                'care:telemedicine:write',
                'care:medications:read',
                'care:medications:write',
                'care:treatments:read',

                // Plan journey - basic access
                'plan:coverage:read',
                'plan:claims:read',
                'plan:claims:write',
                'plan:benefits:read',
                'plan:documents:read',
                'plan:documents:write',
                'plan:payments:read',
                'plan:simulator:use',

                // Gamification
                'game:achievements:read',
                'game:progress:read',
                'game:rewards:read',
                'game:rewards:redeem',
                'game:leaderboard:read',
            ],
        },
        {
            name: 'Caregiver',
            description: "User with delegated access to another user's health data",
            isDefault: false,
            journey: null,
            permissions: [
                'health:metrics:read',
                'health:history:read',
                'health:goals:read',
                'care:appointments:read',
                'care:appointments:write',
                'care:medications:read',
                'care:treatments:read',
            ],
        },
        {
            name: 'Provider',
            description: 'Healthcare provider with access to patient data',
            isDefault: false,
            journey: 'care',
            permissions: [
                'health:metrics:read',
                'health:history:read',
                'health:history:write',
                'care:appointments:read',
                'care:appointments:write',
                'care:telemedicine:read',
                'care:telemedicine:write',
                'care:medications:read',
                'care:medications:write',
                'care:treatments:read',
                'care:treatments:write',
            ],
        },
        {
            name: 'Administrator',
            description: 'System administrator with full access',
            isDefault: false,
            journey: null,
            permissions: permissions.map((p) => p.name), // All permissions
        },
    ];

    // Create roles and assign permissions
    console.log(`Creating ${roles.length} roles...`);
    for (const role of roles) {
        try {
            const { permissions: permissionNames, ...roleData } = role;

            // Create the role
            const createdRole = await prisma.role.upsert({
                where: { name: roleData.name },
                update: roleData,
                create: roleData,
            });

            // Get valid permissions to connect
            const permissionConnections = [];
            for (const name of permissionNames) {
                const permission = permissionsByName.get(name);
                if (permission) {
                    permissionConnections.push({ id: permission.id });
                } else {
                    console.warn(`Permission not found: ${name}`);
                }
            }

            // Connect permissions to the role
            if (permissionConnections.length > 0) {
                await prisma.role.update({
                    where: { id: createdRole.id },
                    data: {
                        permissions: {
                            connect: permissionConnections,
                        },
                    },
                });
            }

            console.log(`Created role: ${roleData.name} with ${permissionConnections.length} permissions`);
        } catch (error) {
            console.error(`Error creating role: ${(error as any).message}`);
            throw error as any;
        }
    }
}

/**
 * Seeds default users.
 *
 * @param prisma - The Prisma client instance
 */
async function seedUsers(prisma: PrismaClient): Promise<void> {
    try {
        // Create admin user
        const adminPwd = process.env.SEED_ADMIN_PASSWORD || faker.internet.password({ length: 16 });
        const adminCpf = process.env.SEED_ADMIN_CPF || faker.string.numeric(11);
        const adminPassword = await bcrypt.hash(adminPwd, 10);
        const adminUser = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@austa.com.br',
                password: adminPassword,
                phone: '+5511999999999',
                cpf: adminCpf,
            },
        });

        // Get the admin role
        const adminRole = await prisma.role.findUnique({
            where: { name: 'Administrator' },
        });

        if (adminRole) {
            // Assign admin role to admin user
            await prisma.user.update({
                where: { id: adminUser.id },
                data: {
                    roles: {
                        connect: { id: adminRole.id },
                    },
                },
            });
            console.log(`Created admin user: ${adminUser.email} with Administrator role`);
        }

        // Create regular test user
        const userPwd = process.env.SEED_USER_PASSWORD || faker.internet.password({ length: 16 });
        const userCpf = process.env.SEED_USER_CPF || faker.string.numeric(11);
        const userPassword = await bcrypt.hash(userPwd, 10);
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'user@austa.com.br',
                password: userPassword,
                phone: '+5511888888888',
                cpf: userCpf,
            },
        });

        // Get the default user role
        const userRole = await prisma.role.findFirst({
            where: { isDefault: true },
        });

        if (userRole) {
            // Assign user role to test user
            await prisma.user.update({
                where: { id: testUser.id },
                data: {
                    roles: {
                        connect: { id: userRole.id },
                    },
                },
            });
            console.log(`Created test user: ${testUser.email} with ${userRole.name} role`);
        }
        console.log('Seed passwords set via SEED_ADMIN_PASSWORD / SEED_USER_PASSWORD env vars (or random)');
    } catch (error) {
        console.error(`Error creating users: ${(error as any).message}`);
        throw error as any;
    }
}

/**
 * Seeds journey-specific data.
 *
 * @param prisma - The Prisma client instance
 */
async function seedJourneyData(_prisma: PrismaClient): Promise<void> {
    // Models healthMetricType, deviceType, providerSpecialty, insurancePlanType,
    // claimType, and achievementType were removed from the schema.
    // Their data is now handled via enums and string fields on existing models.
    console.log('Journey-specific seed data: no additional seeding required (models consolidated into enums/fields).');
}

// Run the seed function
seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
