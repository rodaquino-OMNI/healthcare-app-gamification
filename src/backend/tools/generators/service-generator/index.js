#!/usr/bin/env node

const { pascalCase, camelCase, paramCase } = require('change-case');
const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// Create a simple logger since we can't use the NestJS LoggerService directly in this script
class Logger {
  log(message, context = 'ServiceGenerator') {
    console.log(`[${context}] ${message}`);
  }

  error(message, trace, context = 'ServiceGenerator') {
    console.error(`[${context}] ERROR: ${message}`);
    if (trace) console.error(trace);
  }
}

const logger = new Logger();

// Define CLI command
program
  .name('service-generator')
  .description('Generate NestJS service components (controller, service, entity, DTOs)')
  .version('1.0.0')
  .argument('<name>', 'Service name (e.g., "health-metric")')
  .option('-o, --output <directory>', 'Output directory', './src')
  .option('-j, --journey <journey>', 'Journey name (health, care, plan)', '')
  .action((name, options) => {
    try {
      generateService(name, options.output, options.journey);
    } catch (error) {
      logger.error(`Failed to generate service: ${error.message}`, error.stack);
      process.exit(1);
    }
  });

program.parse();

/**
 * Generates a complete service with all required components
 * @param {string} name - Service name
 * @param {string} outputDir - Base output directory
 * @param {string} journey - Optional journey name
 */
function generateService(name, outputDir, journey) {
  logger.log(`Generating service: ${name}${journey ? ` for ${journey} journey` : ''}`);
  
  // Determine target directory based on journey
  let serviceDir;
  if (journey) {
    serviceDir = path.join(outputDir, `${journey}-service`, 'src', 'modules', paramCase(name));
  } else {
    serviceDir = path.join(outputDir, 'modules', paramCase(name));
  }
  
  // Create directory structure
  const controllersDir = path.join(serviceDir, 'controllers');
  const servicesDir = path.join(serviceDir, 'services');
  const dtosDir = path.join(serviceDir, 'dtos');

  createDirectoryIfNotExists(serviceDir);
  createDirectoryIfNotExists(controllersDir);
  createDirectoryIfNotExists(servicesDir);
  createDirectoryIfNotExists(dtosDir);

  // Generate files
  generateControllerFile(name, controllersDir);
  generateServiceFile(name, servicesDir);
  generateDtoFiles(name, dtosDir);
  generateModuleFile(name, serviceDir);
  
  logger.log(`Service ${name} generated successfully at ${serviceDir}`);
  logger.log(`Don't forget to add ${pascalCase(name)}Module to your app.module.ts imports!`);
}

/**
 * Creates a directory if it doesn't exist
 * @param {string} dir - Directory path
 */
function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.log(`Created directory: ${dir}`);
  }
}

/**
 * Generates controller file
 * @param {string} name - Service name
 * @param {string} dir - Output directory
 */
function generateControllerFile(name, dir) {
  const filename = `${paramCase(name)}.controller.ts`;
  const filePath = path.join(dir, filename);
  
  // Read controller template
  const templatePath = path.join(__dirname, 'templates', 'controller.template.ts');
  let template;
  
  try {
    template = fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    logger.error(`Failed to read controller template: ${error.message}`, error.stack);
    throw new Error(`Failed to read controller template: ${error.message}`);
  }
  
  // Process template with service name
  const content = processTemplate(template, name);
  
  try {
    fs.writeFileSync(filePath, content);
    logger.log(`Generated controller: ${filePath}`);
  } catch (error) {
    logger.error(`Failed to write controller file: ${error.message}`, error.stack);
    throw new Error(`Failed to write controller file: ${error.message}`);
  }
}

/**
 * Generates service file
 * @param {string} name - Service name
 * @param {string} dir - Output directory
 */
function generateServiceFile(name, dir) {
  const filename = `${paramCase(name)}.service.ts`;
  const filePath = path.join(dir, filename);
  
  // Read service template
  const templatePath = path.join(__dirname, 'templates', 'service.template.ts');
  let template;
  
  try {
    template = fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    logger.error(`Failed to read service template: ${error.message}`, error.stack);
    throw new Error(`Failed to read service template: ${error.message}`);
  }
  
  // Process template with service name
  const content = processTemplate(template, name);
  
  try {
    fs.writeFileSync(filePath, content);
    logger.log(`Generated service: ${filePath}`);
  } catch (error) {
    logger.error(`Failed to write service file: ${error.message}`, error.stack);
    throw new Error(`Failed to write service file: ${error.message}`);
  }
}

/**
 * Generates DTO files
 * @param {string} name - Service name
 * @param {string} dir - Output directory
 */
function generateDtoFiles(name, dir) {
  const createDtoFilename = `create-${paramCase(name)}.dto.ts`;
  const updateDtoFilename = `update-${paramCase(name)}.dto.ts`;
  
  const createDtoContent = generateCreateDtoContent(name);
  const updateDtoContent = generateUpdateDtoContent(name);
  
  try {
    fs.writeFileSync(path.join(dir, createDtoFilename), createDtoContent);
    fs.writeFileSync(path.join(dir, updateDtoFilename), updateDtoContent);
    logger.log(`Generated DTOs: ${createDtoFilename}, ${updateDtoFilename}`);
  } catch (error) {
    logger.error(`Failed to write DTO files: ${error.message}`, error.stack);
    throw new Error(`Failed to write DTO files: ${error.message}`);
  }
}

/**
 * Generates module file
 * @param {string} name - Service name
 * @param {string} dir - Output directory
 */
function generateModuleFile(name, dir) {
  const filename = `${paramCase(name)}.module.ts`;
  const filePath = path.join(dir, filename);
  
  const pascalCaseName = pascalCase(name);
  const paramCaseName = paramCase(name);
  
  const content = `import { Module } from '@nestjs/common';
import { ${pascalCaseName}Controller } from './controllers/${paramCaseName}.controller';
import { ${pascalCaseName}Service } from './services/${paramCaseName}.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';

@Module({
  controllers: [${pascalCaseName}Controller],
  providers: [${pascalCaseName}Service, LoggerService],
  exports: [${pascalCaseName}Service],
})
export class ${pascalCaseName}Module {}
`;
  
  try {
    fs.writeFileSync(filePath, content);
    logger.log(`Generated module: ${filePath}`);
  } catch (error) {
    logger.error(`Failed to write module file: ${error.message}`, error.stack);
    throw new Error(`Failed to write module file: ${error.message}`);
  }
}

/**
 * Processes a template by replacing placeholders
 * @param {string} template - Template content
 * @param {string} name - Service name
 * @returns {string} Processed template
 */
function processTemplate(template, name) {
  let content = template;
  
  // Replace placeholders with actual values
  content = content.replace(/{{ pascalCase name }}/g, pascalCase(name));
  content = content.replace(/{{ camelCase name }}/g, camelCase(name));
  content = content.replace(/{{ dashCase name }}/g, paramCase(name));
  
  return content;
}

/**
 * Generates content for Create DTO
 * @param {string} name - Service name
 * @returns {string} DTO content
 */
function generateCreateDtoContent(name) {
  const pascalCaseName = pascalCase(name);
  const camelCaseName = camelCase(name);
  
  return `import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO for creating a new ${pascalCaseName}
 */
export class Create${pascalCaseName}Dto {
  /**
   * Name of the ${camelCaseName}
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Description of the ${camelCaseName}
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Whether the ${camelCaseName} is active
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}`;
}

/**
 * Generates content for Update DTO
 * @param {string} name - Service name
 * @returns {string} DTO content
 */
function generateUpdateDtoContent(name) {
  const pascalCaseName = pascalCase(name);
  const camelCaseName = camelCase(name);
  
  return `import { IsOptional, IsString, IsBoolean } from 'class-validator';

/**
 * DTO for updating an existing ${pascalCaseName}
 */
export class Update${pascalCaseName}Dto {
  /**
   * Name of the ${camelCaseName}
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Description of the ${camelCaseName}
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Whether the ${camelCaseName} is active
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}`;
}