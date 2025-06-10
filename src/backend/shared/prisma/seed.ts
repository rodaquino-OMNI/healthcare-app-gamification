/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@app/shared/database/prisma.service';
import { UsersService } from '@app/auth/users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Seeds the database with initial data.
 * 
 * @returns A promise that resolves when the database is seeded.
 */
async function seed(): Promise<void> {
  console.log('Starting database seeding...');
  
  // Create an instance of PrismaService for database cleaning
  const prismaService = new PrismaService();
  // Create a standard PrismaClient for data operations
  const prisma = new PrismaClient();
  
  try {
    // Clean the database first to ensure a consistent state
    console.log('Cleaning database...');
    await prismaService.cleanDatabase();
    
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
  
  const allPermissions = [
    ...healthPermissions,
    ...carePermissions,
    ...planPermissions,
    ...gamificationPermissions,
  ];
  
  // Create all permissions in the database
  console.log(`Creating ${allPermissions.length} permissions...`);
  for (const permission of allPermissions) {
    try {
      // Try to create the permission, ignore if it already exists
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: permission,
      });
    } catch (error) {
      // If creation fails due to unique constraint, just log and continue
      if (error.code === 'P2002') {
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
  permissions.forEach(permission => {
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
      description: 'User with delegated access to another user\'s health data',
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
      permissions: permissions.map(p => p.name), // All permissions
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
    const adminPassword = await bcrypt.hash('Password123!', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@austa.com.br',
        password: adminPassword,
        phone: '+5511999999999',
        cpf: '12345678901',
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
    const userPassword = await bcrypt.hash('Password123!', 10);
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@austa.com.br',
        password: userPassword,
        phone: '+5511888888888',
        cpf: '98765432109',
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
async function seedJourneyData(prisma: PrismaClient): Promise<void> {
  // Health Journey sample data
  try {
    // Sample health metrics types
    const metricTypes = [
      { name: 'HEART_RATE', unit: 'bpm', normalRangeMin: 60, normalRangeMax: 100 },
      { name: 'BLOOD_PRESSURE', unit: 'mmHg', normalRangeMin: null, normalRangeMax: null },
      { name: 'BLOOD_GLUCOSE', unit: 'mg/dL', normalRangeMin: 70, normalRangeMax: 100 },
      { name: 'STEPS', unit: 'steps', normalRangeMin: 5000, normalRangeMax: null },
      { name: 'WEIGHT', unit: 'kg', normalRangeMin: null, normalRangeMax: null },
      { name: 'SLEEP', unit: 'hours', normalRangeMin: 7, normalRangeMax: 9 },
    ];

    for (const metricType of metricTypes) {
      await prisma.healthMetricType.upsert({
        where: { name: metricType.name },
        update: {},
        create: metricType,
      });
    }
    
    console.log(`Created ${metricTypes.length} health metric types`);
    
    // Sample device types
    const deviceTypes = [
      { name: 'Smartwatch', description: 'Wearable smartwatch device', manufacturer: 'Various' },
      { name: 'Blood Pressure Monitor', description: 'Blood pressure monitoring device', manufacturer: 'Various' },
      { name: 'Glucose Monitor', description: 'Blood glucose monitoring device', manufacturer: 'Various' },
      { name: 'Smart Scale', description: 'Weight and body composition scale', manufacturer: 'Various' },
    ];
    
    for (const deviceType of deviceTypes) {
      await prisma.deviceType.upsert({
        where: { name: deviceType.name },
        update: {},
        create: deviceType,
      });
    }
    
    console.log(`Created ${deviceTypes.length} device types`);
  } catch (error) {
    console.error(`Error seeding health journey data: ${(error as any).message}`);
  }
  
  // Care Journey sample data
  try {
    // Sample provider specialties
    const specialties = [
      { name: 'Cardiologia', description: 'Especialista em coração e sistema cardiovascular' },
      { name: 'Dermatologia', description: 'Especialista em pele, cabelo e unhas' },
      { name: 'Ortopedia', description: 'Especialista em sistema músculo-esquelético' },
      { name: 'Pediatria', description: 'Especialista em saúde infantil' },
      { name: 'Psiquiatria', description: 'Especialista em saúde mental' },
    ];
    
    for (const specialty of specialties) {
      await prisma.providerSpecialty.upsert({
        where: { name: specialty.name },
        update: {},
        create: specialty,
      });
    }
    
    console.log(`Created ${specialties.length} provider specialties`);
  } catch (error) {
    console.error(`Error seeding care journey data: ${(error as any).message}`);
  }
  
  // Plan Journey sample data
  try {
    // Sample plan types
    const planTypes = [
      { name: 'Básico', description: 'Plano com cobertura básica' },
      { name: 'Standard', description: 'Plano com cobertura intermediária' },
      { name: 'Premium', description: 'Plano com cobertura ampla' },
    ];
    
    for (const planType of planTypes) {
      await prisma.insurancePlanType.upsert({
        where: { name: planType.name },
        update: {},
        create: planType,
      });
    }
    
    console.log(`Created ${planTypes.length} insurance plan types`);
    
    // Sample claim types
    const claimTypes = [
      { name: 'Consulta Médica', description: 'Reembolso para consulta médica' },
      { name: 'Exame', description: 'Reembolso para exames médicos' },
      { name: 'Terapia', description: 'Reembolso para sessões terapêuticas' },
      { name: 'Internação', description: 'Reembolso para internação hospitalar' },
      { name: 'Medicamento', description: 'Reembolso para medicamentos prescritos' },
    ];
    
    for (const claimType of claimTypes) {
      await prisma.claimType.upsert({
        where: { name: claimType.name },
        update: {},
        create: claimType,
      });
    }
    
    console.log(`Created ${claimTypes.length} claim types`);
  } catch (error) {
    console.error(`Error seeding plan journey data: ${(error as any).message}`);
  }
  
  // Gamification sample data
  try {
    // Sample achievement types
    const achievementTypes = [
      { 
        name: 'health-check-streak', 
        title: 'Monitor de Saúde', 
        description: 'Registre suas métricas de saúde por dias consecutivos',
        journey: 'health',
        icon: 'heart-pulse',
        levels: 3
      },
      { 
        name: 'steps-goal', 
        title: 'Caminhante Dedicado', 
        description: 'Atinja sua meta diária de passos',
        journey: 'health',
        icon: 'footprints',
        levels: 3
      },
      { 
        name: 'appointment-keeper', 
        title: 'Compromisso com a Saúde', 
        description: 'Compareça às consultas agendadas',
        journey: 'care',
        icon: 'calendar-check',
        levels: 3
      },
      { 
        name: 'medication-adherence', 
        title: 'Aderência ao Tratamento', 
        description: 'Tome seus medicamentos conforme prescrito',
        journey: 'care',
        icon: 'pill',
        levels: 3
      },
      { 
        name: 'claim-master', 
        title: 'Mestre em Reembolsos', 
        description: 'Submeta solicitações de reembolso completas',
        journey: 'plan',
        icon: 'receipt',
        levels: 3
      },
    ];
    
    for (const achievement of achievementTypes) {
      await prisma.achievementType.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      });
    }
    
    console.log(`Created ${achievementTypes.length} achievement types`);
  } catch (error) {
    console.error(`Error seeding gamification data: ${(error as any).message}`);
  }
}

// Run the seed function
seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });