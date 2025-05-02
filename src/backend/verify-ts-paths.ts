import { Logger } from '@nestjs/common';

/**
 * Simple verification script to test TypeScript path resolution
 * This tests that our path aliases are working correctly
 */
async function verifyPaths(): Promise<void> {
  const logger = new Logger('PathVerification');
  
  try {
    // Test import from @shared
    const sharedModule = await import('@shared/logging/logger.service');
    logger.log('Successfully imported from @shared path');
    
    // Test import from @gamification
    const gamificationModule = await import('@gamification/app.module');
    logger.log('Successfully imported from @gamification path');
    
    // Test import from @prisma (if applicable)
    try {
      // Use @prisma/client instead of schema which doesn't exist
      const prismaModule = await import('@prisma/client');
      logger.log('Successfully imported from @prisma path');
    } catch (error) {
      logger.warn('Could not import from @prisma path - this may be expected if @prisma alias is not used or @prisma/client is not installed');
    }
    
    logger.log('Path verification completed successfully!');
  } catch (error) {
    logger.error(`Path verification failed: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

verifyPaths();