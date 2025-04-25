import { pascalCase, camelCase } from 'change-case'; // change-case v4.1.2

/**
 * Generates the content for a NestJS entity file based on the provided service name.
 * @param serviceName - The name of the service
 * @returns The content of the entity file
 */
export function generateEntityTemplate(serviceName: string): string {
  // Convert service name to proper cases
  const entityName = pascalCase(serviceName);
  const serviceNameCamel = camelCase(serviceName);
  
  // Construct the entity file content
  return `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entity representing a ${serviceNameCamel} in the system
 */
@Entity('${serviceNameCamel}s')
export class ${entityName} {
  /**
   * Unique identifier for the ${serviceNameCamel}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of the ${serviceNameCamel}
   */
  @Column({ length: 100 })
  name: string;

  /**
   * Description of the ${serviceNameCamel}
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Whether the ${serviceNameCamel} is active
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Timestamp when the ${serviceNameCamel} was created
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the ${serviceNameCamel} was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
`;
}