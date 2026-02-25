import { NestFactory } from '@nestjs/core'; // @nestjs/core@10.0.0
import { Logger } from '@nestjs/common'; // @nestjs/common@10.0.0
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { RoleService } from 'src/backend/auth-service/src/roles/roles.service';
import { PermissionService } from 'src/backend/auth-service/src/permissions/permissions.service';
import { UsersService } from 'src/backend/auth-service/src/users/users.service';
import { CreateUserDto } from 'src/backend/auth-service/src/users/dto/create-user.dto';
import { defaultAdminUser } from 'src/backend/auth-service/src/config/configuration';

/**
 * Seeds the database with initial data, including roles, permissions, and a default admin user.
 * This function is used for development and testing purposes.
 * @returns {Promise<void>} A promise that resolves when the database seeding is complete
 */
async function seedDatabase() {
  const logger = new Logger('SeedDatabase');
  logger.log('Starting database seeding process');
  
  let app;
  try {
    // In a real implementation, you would import the actual AppModule here
    // For demonstration purposes, we dynamically import it
    const { AppModule } = await import('src/backend/auth-service/src/app.module');
    
    // Create a NestJS application context
    app = await NestFactory.createApplicationContext(AppModule);
    
    // Get service instances
    const prismaService = app.get(PrismaService);
    const roleService = app.get(RoleService);
    const permissionService = app.get(PermissionService);
    const usersService = app.get(UsersService);
    
    // Step 1: Seed initial roles
    logger.log('Seeding initial roles...');
    
    const roles = [
      { name: 'Administrator', description: 'System administrator with full access', isDefault: false },
      { name: 'User', description: 'Standard user access to own data', isDefault: true },
      { name: 'Caregiver', description: 'Delegated access to specific user health data', isDefault: false },
      { name: 'Provider', description: 'Healthcare provider access', isDefault: false },
      { name: 'Health Viewer', description: 'Read-only access to health data', isDefault: false, journey: 'health' },
      { name: 'Health Manager', description: 'Can update health goals and connect devices', isDefault: false, journey: 'health' },
      { name: 'Care Scheduler', description: 'Can book appointments', isDefault: false, journey: 'care' },
      { name: 'Care Provider', description: 'Can conduct telemedicine sessions', isDefault: false, journey: 'care' },
      { name: 'Plan Viewer', description: 'Can view coverage and benefits', isDefault: false, journey: 'plan' },
      { name: 'Claim Submitter', description: 'Can submit and track claims', isDefault: false, journey: 'plan' }
    ];
    
    for (const role of roles) {
      try {
        const existingRole = await prismaService.role.findFirst({ where: { name: role.name } });
        if (!existingRole) {
          await roleService.create(role);
          logger.log(`Created role: ${role.name}`);
        } else {
          logger.log(`Role already exists: ${role.name}`);
        }
      } catch (error) {
        logger.warn(`Error processing role ${role.name}: ${error.message}`);
      }
    }
    
    // Step 2: Seed initial permissions
    logger.log('Seeding initial permissions...');
    
    const permissions = [
      // Health journey permissions
      'health:metrics:read',
      'health:metrics:write',
      'health:history:read',
      'health:history:write',
      'health:goals:manage',
      'health:devices:connect',
      
      // Care journey permissions
      'care:appointment:read',
      'care:appointment:create',
      'care:appointment:cancel',
      'care:telemedicine:initiate',
      'care:telemedicine:join',
      'care:medication:manage',
      
      // Plan journey permissions
      'plan:coverage:read',
      'plan:claims:read',
      'plan:claims:create',
      'plan:claims:appeal',
      'plan:benefits:read',
      
      // System permissions
      'system:users:read',
      'system:users:create',
      'system:users:update',
      'system:users:delete',
      'system:roles:manage',
      'system:permissions:manage'
    ];
    
    for (const permission of permissions) {
      try {
        const existingPermission = await prismaService.permission.findFirst({ where: { name: permission } });
        if (!existingPermission) {
          await permissionService.create(permission);
          logger.log(`Created permission: ${permission}`);
        } else {
          logger.log(`Permission already exists: ${permission}`);
        }
      } catch (error) {
        logger.warn(`Error processing permission ${permission}: ${error.message}`);
      }
    }
    
    // Step 3: Create default admin user if not exists
    logger.log('Checking for default admin user...');
    
    // Use the admin email from configuration or fallback to default
    const adminEmail = defaultAdminUser?.email || 'admin@austa.com.br';
    
    try {
      // Try to find admin user by email
      await usersService.findByEmail(adminEmail);
      logger.log('Default admin user already exists, skipping creation');
    } catch (error) {
      // Admin user doesn't exist, create it
      logger.log('Creating default admin user...');
      
      const seedPassword = process.env.SEED_ADMIN_PASSWORD;
      if (!seedPassword) {
        throw new Error('SEED_ADMIN_PASSWORD environment variable required for seeding');
      }

      const adminData = new CreateUserDto();
      adminData.name = defaultAdminUser?.name || 'System Administrator';
      adminData.email = adminEmail;
      adminData.password = defaultAdminUser?.password || seedPassword;
      adminData.phone = defaultAdminUser?.phone;
      adminData.cpf = defaultAdminUser?.cpf;
      
      const admin = await usersService.create(adminData);
      
      // Assign Administrator role to the new admin user
      try {
        const adminRole = await prismaService.role.findFirst({
          where: { name: 'Administrator' }
        });
        
        if (adminRole) {
          await usersService.assignRole(admin.id, adminRole.id.toString());
          logger.log(`Assigned Administrator role to user with ID: ${admin.id}`);
        }
      } catch (roleError) {
        logger.error(`Failed to assign Administrator role: ${roleError.message}`);
      }
      
      logger.log(`Created default admin user with ID: ${admin.id}`);
    }
    
    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`, error.stack);
  } finally {
    // Close the application context to release resources
    if (app) {
      await app.close();
    }
  }
}

// Execute the seed function
seedDatabase()
  .then(() => {
    Logger.log('Seed script execution completed successfully', 'SeedDatabase');
    process.exit(0);
  })
  .catch((error) => {
    Logger.error(`Seed script execution failed: ${error.message}`, 'SeedDatabase');
    process.exit(1);
  });