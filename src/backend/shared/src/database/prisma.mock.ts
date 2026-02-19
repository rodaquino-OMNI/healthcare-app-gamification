/**
 * Mock implementation of PrismaService that provides model access patterns
 * compatible with our service implementation.
 * 
 * This helps bridge the gap between our code's expectations and the actual Prisma client.
 */
export class PrismaMock {
  // User model operations
  user = {
    findUnique: async (args: any) => {
      return { id: '1', email: 'user@example.com', name: 'Test User', roles: [] };
    },
    findFirst: async (args: any) => {
      return { id: '1', email: 'user@example.com', name: 'Test User', roles: [] };
    },
    findMany: async (args: any) => {
      return [{ id: '1', email: 'user@example.com', name: 'Test User', roles: [] }];
    },
    create: async (args: any) => {
      return { id: '1', ...args.data, roles: [] };
    },
    update: async (args: any) => {
      return { id: args.where.id, ...args.data, roles: [] };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
    count: async (args: any) => {
      return 1;
    },
  };

  // Role model operations
  role = {
    findUnique: async (args: any) => {
      return { id: 1, name: 'user', description: 'Regular user role', permissions: [] };
    },
    findFirst: async (args: any) => {
      return { id: 1, name: 'user', description: 'Regular user role', permissions: [] };
    },
    findMany: async (args: any) => {
      return [{ id: 1, name: 'user', description: 'Regular user role', permissions: [] }];
    },
    create: async (args: any) => {
      return { id: 1, ...args.data };
    },
    update: async (args: any) => {
      return { id: args.where.id, ...args.data };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
  };
  
  // Permission model operations
  permission = {
    findUnique: async (args: any) => {
      return { id: 1, name: 'read', description: 'Read permission' };
    },
    findMany: async (args: any) => {
      return [{ id: 1, name: 'read', description: 'Read permission' }];
    },
    create: async (args: any) => {
      return { id: 1, ...args.data };
    },
    update: async (args: any) => {
      return { id: args.where.id, ...args.data };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
  };

  // UserRole model operations for many-to-many relationships
  userRole = {
    create: async (args: any) => {
      return { userId: args.data.userId, roleId: args.data.roleId };
    },
    deleteMany: async (args: any) => {
      return { count: 1 };
    },
  };

  // Claim model operations
  claim = {
    findUnique: async (args: any) => {
      return { 
        id: '1', 
        userId: 'user-1',
        planId: 'plan-1',
        type: 'MEDICAL',
        amount: 100.0,
        status: 'SUBMITTED',
        procedureCode: 'CODE123',
        documents: []
      };
    },
    findMany: async (args: any) => {
      return [{ 
        id: '1', 
        userId: 'user-1',
        planId: 'plan-1',
        type: 'MEDICAL',
        amount: 100.0,
        status: 'SUBMITTED',
        procedureCode: 'CODE123',
        documents: []
      }];
    },
    create: async (args: any) => {
      return { 
        id: '1', 
        ...args.data,
        documents: [] 
      };
    },
    update: async (args: any) => {
      return { 
        id: args.where.id, 
        ...args.data,
        documents: [] 
      };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
  };

  // Document model operations
  document = {
    findUnique: async (args: any) => {
      return { 
        id: '1', 
        userId: 'user-1',
        type: 'MEDICAL_RECEIPT',
        filename: 'receipt.pdf',
        entity_id: null,
        entity_type: null
      };
    },
    findMany: async (args: any) => {
      return [{ 
        id: '1', 
        userId: 'user-1',
        type: 'MEDICAL_RECEIPT',
        filename: 'receipt.pdf',
        entity_id: null,
        entity_type: null
      }];
    },
    create: async (args: any) => {
      return { 
        id: '1', 
        ...args.data 
      };
    },
    update: async (args: any) => {
      return { 
        id: args.where.id, 
        ...args.data 
      };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
  };

  // HealthMetric model operations
  healthMetric = {
    findUnique: async (args: any) => {
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
    findMany: async (args: any) => {
      return [{
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
      }];
    },
    create: async (args: any) => {
      return {
        id: '1',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    update: async (args: any) => {
      return {
        id: args.where.id,
        ...args.data,
        updatedAt: new Date(),
      };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
    count: async (args: any) => {
      return 1;
    },
  };

  // HealthGoal model operations
  healthGoal = {
    findUnique: async (args: any) => {
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
    findMany: async (args: any) => {
      return [{
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
      }];
    },
    create: async (args: any) => {
      return {
        id: '1',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    update: async (args: any) => {
      return {
        id: args.where.id,
        ...args.data,
        updatedAt: new Date(),
      };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    },
  };

  // AuditLog model operations
  auditLog = {
    create: async (args: any) => {
      return {
        id: '1',
        ...args.data,
        createdAt: new Date(),
      };
    },
    findMany: async (args: any) => {
      return [];
    },
    count: async (args: any) => {
      return 0;
    },
  };
}