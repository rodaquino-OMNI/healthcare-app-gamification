#!/usr/bin/env node
/**
 * AUSTA SuperApp Migration Generator Script
 * 
 * This utility automates the process of creating Prisma database migrations
 * with descriptive names and ensures consistent migration practices across
 * the development team.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');
const chalk = require('chalk'); // chalk version ^4.1.2

// Global constants
const PRISMA_SCHEMA_PATH = path.resolve(__dirname, '../../shared/prisma/schema.prisma');
const MIGRATIONS_DIR = path.resolve(__dirname, '../../shared/prisma/migrations');

// Journey-specific information
const JOURNEY_INFO = {
  health: {
    description: 'Health Journey: Health metrics, medical history, device connections',
    examples: ['health-add-metrics', 'health-update-medical-history', 'health-device-connection']
  },
  care: {
    description: 'Care Journey: Appointments, medications, telemedicine sessions',
    examples: ['care-appointment-status', 'care-medication-tracking', 'care-telemedicine-fields']
  },
  plan: {
    description: 'Plan Journey: Insurance plans, claims, benefits',
    examples: ['plan-add-claim-fields', 'plan-update-structure', 'plan-benefit-types']
  },
  game: {
    description: 'Gamification: Achievements, quests, rewards',
    examples: ['game-achievement-types', 'game-quest-structure', 'game-reward-fields']
  }
};

/**
 * Validates that the migration name follows the project's naming conventions
 * @param {string} name - The migration name to validate
 * @returns {boolean} - True if the name is valid, false otherwise
 */
function validateMigrationName(name) {
  // Check if the name is not empty
  if (!name || name.trim() === '') {
    console.error(chalk.red('Error: Migration name cannot be empty'));
    return false;
  }

  // Verify the name contains only alphanumeric characters, hyphens, and underscores
  const validNameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!validNameRegex.test(name)) {
    console.error(chalk.red('Error: Migration name can only contain alphanumeric characters, hyphens, and underscores'));
    return false;
  }

  // Ensure the name is descriptive (minimum length)
  if (name.length < 5) {
    console.error(chalk.red('Error: Migration name should be descriptive (at least 5 characters)'));
    return false;
  }

  // Suggest journey prefixes for migration names
  const journeyPrefixes = ['health', 'care', 'plan', 'game'];
  const hasJourneyPrefix = journeyPrefixes.some(prefix => 
    name.toLowerCase().startsWith(`${prefix}-`) || 
    name.toLowerCase().includes(`-${prefix}-`)
  );
  
  if (!hasJourneyPrefix) {
    console.log(chalk.yellow('\nSuggestion: Consider prefixing your migration with a journey identifier'));
    console.log(chalk.yellow('Examples:'));
    Object.values(JOURNEY_INFO).forEach(journey => {
      journey.examples.forEach(example => {
        console.log(chalk.yellow(`  - ${example}`));
      });
    });
    // This is just a suggestion, not a validation error
  }

  return true;
}

/**
 * Prompts the user for a migration name and validates it
 * @returns {Promise<string>} A promise that resolves to the validated migration name
 */
function getMigrationName() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(chalk.cyan('\nMigration names should be descriptive and indicate the purpose of the change.'));
    console.log(chalk.cyan('Consider which journey this migration impacts:'));
    
    Object.entries(JOURNEY_INFO).forEach(([key, info]) => {
      console.log(chalk.cyan(`- ${info.description}`));
    });

    function askForName() {
      rl.question(chalk.cyan('\nEnter a descriptive name for the migration: '), (name) => {
        const trimmedName = name.trim();
        
        if (validateMigrationName(trimmedName)) {
          rl.close();
          resolve(trimmedName);
        } else {
          askForName(); // Ask again if validation failed
        }
      });
    }

    askForName();
  });
}

/**
 * Checks if the Prisma schema file exists
 * @returns {boolean} True if the schema file exists, false otherwise
 */
function checkPrismaSchema() {
  if (!fs.existsSync(PRISMA_SCHEMA_PATH)) {
    console.error(chalk.red(`Error: Prisma schema file not found at ${PRISMA_SCHEMA_PATH}`));
    return false;
  }
  return true;
}

/**
 * Ensures that the migrations directory exists
 */
function ensureMigrationsDir() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log(chalk.yellow(`Migrations directory not found. Creating at ${MIGRATIONS_DIR}`));
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }
}

/**
 * Asks the user for confirmation before proceeding
 * @param {string} message - The confirmation message to display
 * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise
 */
function confirmAction(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(chalk.yellow(message), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Generates a new Prisma migration with the provided name
 * @param {string} name - The name for the migration
 * @returns {Promise<boolean>} A promise that resolves to true if migration was successful
 */
async function generateMigration(name) {
  // Format the migration name to be kebab-case (for consistency)
  const formattedName = name.toLowerCase().replace(/_/g, '-');
  
  // Ask for confirmation
  const confirmed = await confirmAction(`Are you sure you want to create migration "${formattedName}"? [y/N]: `);
  
  if (!confirmed) {
    console.log(chalk.blue('Migration cancelled.'));
    return false;
  }
  
  console.log(chalk.blue(`\nGenerating migration: ${formattedName}...`));
  
  return new Promise((resolve) => {
    // Execute the Prisma migrate command
    exec(`npx prisma migrate dev --name ${formattedName} --schema ${PRISMA_SCHEMA_PATH}`, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`Error generating migration: ${error.message}`));
        console.error(stderr);
        resolve(false);
        return;
      }
      
      console.log(stdout);
      console.log(chalk.green('Migration generated successfully!'));
      resolve(true);
    });
  });
}

/**
 * Main function that orchestrates the migration generation process
 */
async function main() {
  try {
    console.log(chalk.blue('=== AUSTA SuperApp Migration Generator ==='));
    
    // Check if schema exists
    if (!checkPrismaSchema()) {
      return;
    }
    
    // Ensure migrations directory exists
    ensureMigrationsDir();
    
    // Get migration name from user
    const migrationName = await getMigrationName();
    
    // Generate the migration
    const success = await generateMigration(migrationName);
    
    if (success) {
      console.log(chalk.green('\nMigration process completed successfully.'));
      console.log(chalk.cyan('Remember to review the generated migration SQL for correctness.'));
      console.log(chalk.cyan('\nConsider the impact on the following journeys:'));
      
      Object.entries(JOURNEY_INFO).forEach(([key, info]) => {
        console.log(chalk.yellow(`- ${info.description}`));
      });
    } else {
      console.log(chalk.yellow('\nMigration process completed with issues.'));
      console.log(chalk.cyan('Please check the error messages above.'));
    }
  } catch (error) {
    console.error(chalk.red(`Unexpected error: ${error.message}`));
    console.error(error);
  }
}

// Execute if directly run
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

// Export for use in other scripts
module.exports = {
  main
};