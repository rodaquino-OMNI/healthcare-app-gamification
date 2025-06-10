import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity representing a notification template for dynamic content generation
 */
@Entity('notification_templates')
export class NotificationTemplate {
  /**
   * Unique identifier for the template
   * @example "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   */
  @ApiProperty({
    description: 'Unique template ID',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Template identifier used for lookup
   * @example "appointment-reminder"
   */
  @ApiProperty({
    description: 'Template identifier used for lookup',
    example: 'appointment-reminder'
  })
  @Column({ name: 'template_id' })
  templateId!: string;

  /**
   * Language code for the template
   * @example "pt-BR"
   */
  @ApiProperty({
    description: 'Language code for the template',
    example: 'pt-BR'
  })
  @Column({ default: 'pt-BR' })
  language!: string;

  /**
   * Template for the notification title
   * Can include variable placeholders like {{variable}}
   * @example "Lembrete de Consulta"
   */
  @ApiProperty({
    description: 'Template for notification title (can include variable placeholders)',
    example: 'Lembrete de Consulta com {{doctorName}}'
  })
  @Column()
  title!: string;

  /**
   * Template for the notification body
   * Can include variable placeholders like {{variable}}
   * @example "Sua consulta com {{doctorName}} está agendada para {{date}} às {{time}}."
   */
  @ApiProperty({
    description: 'Template for notification body (can include variable placeholders)',
    example: 'Sua consulta com {{doctorName}} está agendada para {{date}} às {{time}}.'
  })
  @Column({ type: 'text' })
  body!: string;

  /**
   * Supported notification channels for this template
   * Comma-separated list: "push,email,sms"
   * @example "push,email,sms"
   */
  @ApiProperty({
    description: 'Supported notification channels (comma-separated)',
    example: 'push,email,sms'
  })
  @Column()
  channels!: string;

  /**
   * Timestamp of when the template was created
   */
  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp of when the template was last updated
   */
  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Associated journey for styling
   * @example "care"
   */
  @ApiProperty({
    description: 'Associated journey for styling',
    enum: ['health', 'care', 'plan'],
    required: false
  })
  @Column({ nullable: true })
  journey?: string;

  /**
   * Additional template metadata
   */
  @ApiProperty({
    description: 'Additional template metadata',
    required: false
  })
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}