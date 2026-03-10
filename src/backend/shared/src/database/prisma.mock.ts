/**
 * Mock implementation of PrismaService that provides model access patterns
 * compatible with our service implementation.
 *
 * This helps bridge the gap between our code's expectations and the actual Prisma client.
 */

interface MockArgs {
    data?: Record<string, unknown>;
    where?: Record<string, unknown>;
    include?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
    take?: number;
    skip?: number;
}

export class PrismaMock {
    // User model operations
    user = {
        findUnique: async (_args: MockArgs) => {
            return { id: '1', email: 'user@example.com', name: 'Test User', roles: [] };
        },
        findFirst: async (_args: MockArgs) => {
            return { id: '1', email: 'user@example.com', name: 'Test User', roles: [] };
        },
        findMany: async (_args: MockArgs) => {
            return [{ id: '1', email: 'user@example.com', name: 'Test User', roles: [] }];
        },
        create: async (args: MockArgs) => {
            return { id: '1', ...args.data, roles: [] };
        },
        update: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id, ...args.data, roles: [] };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
        count: async (_args: MockArgs) => {
            return 1;
        },
    };

    // Role model operations
    role = {
        findUnique: async (_args: MockArgs) => {
            return { id: 1, name: 'user', description: 'Regular user role', permissions: [] };
        },
        findFirst: async (_args: MockArgs) => {
            return { id: 1, name: 'user', description: 'Regular user role', permissions: [] };
        },
        findMany: async (_args: MockArgs) => {
            return [{ id: 1, name: 'user', description: 'Regular user role', permissions: [] }];
        },
        create: async (args: MockArgs) => {
            return { id: 1, ...args.data };
        },
        update: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id, ...args.data };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
    };

    // Permission model operations
    permission = {
        findUnique: async (_args: MockArgs) => {
            return { id: 1, name: 'read', description: 'Read permission' };
        },
        findMany: async (_args: MockArgs) => {
            return [{ id: 1, name: 'read', description: 'Read permission' }];
        },
        create: async (args: MockArgs) => {
            return { id: 1, ...args.data };
        },
        update: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id, ...args.data };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
    };

    // UserRole model operations for many-to-many relationships
    userRole = {
        create: async (args: MockArgs) => {
            const data = args.data as Record<string, unknown>;
            return { userId: data?.userId, roleId: data?.roleId };
        },
        deleteMany: async (_args: MockArgs) => {
            return { count: 1 };
        },
    };

    // Plan model operations
    plan = {
        findUnique: async (_args: MockArgs) => {
            return {
                id: '1',
                userId: 'user-1',
                planNumber: 'PLAN-001',
                type: 'individual',
                validityStart: new Date(),
                validityEnd: new Date(),
                coverageDetails: {},
                journey: 'plan',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        },
        findMany: async (_args: MockArgs) => {
            return [
                {
                    id: '1',
                    userId: 'user-1',
                    planNumber: 'PLAN-001',
                    type: 'individual',
                    validityStart: new Date(),
                    validityEnd: new Date(),
                    coverageDetails: {},
                    journey: 'plan',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        },
        create: async (args: MockArgs) => {
            return { id: '1', ...args.data, createdAt: new Date(), updatedAt: new Date() };
        },
        update: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id, ...args.data, updatedAt: new Date() };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
        count: async (_args: MockArgs) => {
            return 1;
        },
    };

    // Claim model operations
    claim = {
        findUnique: async (_args: MockArgs) => {
            return {
                id: '1',
                userId: 'user-1',
                planId: 'plan-1',
                type: 'MEDICAL',
                amount: 100.0,
                status: 'SUBMITTED',
                procedureCode: 'CODE123',
                documents: [],
            };
        },
        findMany: async (_args: MockArgs) => {
            return [
                {
                    id: '1',
                    userId: 'user-1',
                    planId: 'plan-1',
                    type: 'MEDICAL',
                    amount: 100.0,
                    status: 'SUBMITTED',
                    procedureCode: 'CODE123',
                    documents: [],
                },
            ];
        },
        create: async (args: MockArgs) => {
            return {
                id: '1',
                ...args.data,
                documents: [],
            };
        },
        update: async (args: MockArgs) => {
            return {
                id: (args.where as Record<string, unknown>)?.id,
                ...args.data,
                documents: [],
            };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
    };

    // Document model operations
    document = {
        findUnique: async (_args: MockArgs) => {
            return {
                id: '1',
                userId: 'user-1',
                type: 'MEDICAL_RECEIPT',
                filename: 'receipt.pdf',
                entity_id: null,
                entity_type: null,
            };
        },
        findMany: async (_args: MockArgs) => {
            return [
                {
                    id: '1',
                    userId: 'user-1',
                    type: 'MEDICAL_RECEIPT',
                    filename: 'receipt.pdf',
                    entity_id: null,
                    entity_type: null,
                },
            ];
        },
        create: async (args: MockArgs) => {
            return {
                id: '1',
                ...args.data,
            };
        },
        update: async (args: MockArgs) => {
            return {
                id: (args.where as Record<string, unknown>)?.id,
                ...args.data,
            };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
    };

    // HealthMetric model operations
    healthMetric = {
        findUnique: async (_args: MockArgs) => {
            return {
                id: '1',
                userId: 'user-1',
                type: 'HEART_RATE',
                value: 72,
                unit: 'bpm',
                timestamp: new Date(),
                source: 'USER_INPUT',
                notes: null,
                anomaly: null,
                trend: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        },
        findMany: async (_args: MockArgs) => {
            return [
                {
                    id: '1',
                    userId: 'user-1',
                    type: 'HEART_RATE',
                    value: 72,
                    unit: 'bpm',
                    timestamp: new Date(),
                    source: 'USER_INPUT',
                    notes: null,
                    anomaly: null,
                    trend: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        },
        create: async (args: MockArgs) => {
            return {
                id: '1',
                ...args.data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        },
        update: async (args: MockArgs) => {
            return {
                id: (args.where as Record<string, unknown>)?.id,
                ...args.data,
                updatedAt: new Date(),
            };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
        count: async (_args: MockArgs) => {
            return 1;
        },
    };

    // HealthGoal model operations
    healthGoal = {
        findUnique: async (_args: MockArgs) => {
            return {
                id: '1',
                userId: 'user-1',
                type: 'STEPS',
                targetValue: 10000,
                currentValue: 5000,
                unit: 'steps',
                frequency: 'DAILY',
                status: 'ACTIVE',
                progress: 50,
                startDate: new Date(),
                endDate: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        },
        findMany: async (_args: MockArgs) => {
            return [
                {
                    id: '1',
                    userId: 'user-1',
                    type: 'STEPS',
                    targetValue: 10000,
                    currentValue: 5000,
                    unit: 'steps',
                    frequency: 'DAILY',
                    status: 'ACTIVE',
                    progress: 50,
                    startDate: new Date(),
                    endDate: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        },
        create: async (args: MockArgs) => {
            return {
                id: '1',
                ...args.data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        },
        update: async (args: MockArgs) => {
            return {
                id: (args.where as Record<string, unknown>)?.id,
                ...args.data,
                updatedAt: new Date(),
            };
        },
        delete: async (args: MockArgs) => {
            return { id: (args.where as Record<string, unknown>)?.id };
        },
    };

    // AuditLog model operations
    auditLog = {
        create: async (args: MockArgs) => {
            return {
                id: '1',
                ...args.data,
                createdAt: new Date(),
            };
        },
        findMany: async (_args: MockArgs) => {
            return [];
        },
        count: async (_args: MockArgs) => {
            return 0;
        },
    };
}
