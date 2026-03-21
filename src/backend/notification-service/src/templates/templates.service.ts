import { JOURNEY_IDS } from '@app/shared/constants/journey.constants';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { NotificationTemplate } from './entities/notification-template.entity';

/**
 * Provides functionality for managing notification templates.
 * Handles CRUD operations, template versioning, and retrieval by various criteria
 * such as templateId, language, and journey context.
 */
@Injectable()
export class TemplatesService {
    /**
     * Initializes the TemplatesService with required dependencies.
     * @param prisma PrismaService for database operations
     * @param logger Logger service for logging operations
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Finds a template by its ID.
     * @param id The template ID to find
     * @returns The found template or null if not found
     */
    findById(id: string): Promise<NotificationTemplate | null> {
        this.logger.log(`Finding template by ID: ${id}`, 'TemplatesService');
        return this.prisma.notificationTemplate.findUnique({
            where: { id },
        }) as unknown as Promise<NotificationTemplate | null>;
    }

    /**
     * Finds a template by its code/templateId.
     * @param code The template code (same as templateId) to find
     * @returns The found template or null if not found
     */
    findByCode(code: string): Promise<NotificationTemplate | null> {
        this.logger.log(`Finding template by code: ${code}`, 'TemplatesService');
        return this.prisma.notificationTemplate.findFirst({
            where: { templateId: code },
        }) as unknown as Promise<NotificationTemplate | null>;
    }

    /**
     * Finds templates by their templateId, optionally filtered by language.
     * @param templateId The template identifier to find
     * @param language Optional language filter (e.g., 'pt-BR', 'en-US')
     * @returns Array of matching templates
     */
    findByTemplateId(templateId: string, language?: string): Promise<NotificationTemplate[]> {
        this.logger.log(
            `Finding templates by templateId: ${templateId}, language: ${language || 'any'}`,
            'TemplatesService'
        );

        const filter: Record<string, unknown> = { templateId };

        if (language) {
            filter.language = language;
        }

        return this.prisma.notificationTemplate.findMany({
            where: filter,
        }) as unknown as Promise<NotificationTemplate[]>;
    }

    /**
     * Finds templates associated with a specific journey.
     * Assumes templates follow a naming convention that indicates journey association.
     *
     * @param journey The journey identifier (health, care, plan)
     * @param language Optional language filter
     * @returns Array of templates for the specified journey
     */
    async findByJourney(journey: string, language?: string): Promise<NotificationTemplate[]> {
        this.logger.log(
            `Finding templates by journey: ${journey}, language: ${language || 'any'}`,
            'TemplatesService'
        );

        // Validate that the journey is a valid journey type
        if (!Object.values(JOURNEY_IDS).includes(journey)) {
            this.logger.error(`Invalid journey type: ${journey}`, undefined, 'TemplatesService');
            throw new Error(`Invalid journey type: ${journey}`);
        }

        // Get all templates
        const allTemplates = await this.findAll();

        // Filter templates by journey
        // Assumption: Templates follow a naming convention that includes the journey
        const journeyTemplates = allTemplates.filter((template) => {
            return template.templateId.toLowerCase().includes(journey.toLowerCase());
        });

        // Apply language filter if specified
        if (language) {
            return journeyTemplates.filter((template) => template.language === language);
        }

        return journeyTemplates;
    }

    /**
     * Finds all templates, optionally filtered.
     * @param filter Optional filter criteria
     * @returns Array of templates matching the filter
     */
    findAll(filter?: Record<string, unknown>): Promise<NotificationTemplate[]> {
        this.logger.log(
            `Finding all templates with filter: ${filter ? JSON.stringify(filter) : 'none'}`,
            'TemplatesService'
        );

        return this.prisma.notificationTemplate.findMany({
            where: filter,
        }) as unknown as Promise<NotificationTemplate[]>;
    }

    /**
     * Creates a new notification template.
     * @param template The template data to create
     * @returns The created template
     */
    create(template: Omit<NotificationTemplate, 'id'>): Promise<NotificationTemplate> {
        this.logger.log(
            `Creating template with templateId: ${template.templateId}`,
            'TemplatesService'
        );

        return this.prisma.notificationTemplate.create({
            data: template as unknown as Prisma.NotificationTemplateCreateInput,
        }) as unknown as Promise<NotificationTemplate>;
    }

    /**
     * Updates an existing notification template.
     * @param id The ID of the template to update
     * @param template The updated template data
     * @returns The updated template
     */
    update(id: string, template: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
        this.logger.log(`Updating template with ID: ${id}`, 'TemplatesService');

        return this.prisma.notificationTemplate.update({
            where: { id },
            data: template as unknown as Prisma.NotificationTemplateUpdateInput,
        }) as unknown as Promise<NotificationTemplate>;
    }

    /**
     * Deletes a notification template by ID.
     * @param id The ID of the template to delete
     * @returns True if the template was deleted, false otherwise
     */
    async delete(id: string): Promise<boolean> {
        this.logger.log(`Deleting template with ID: ${id}`, 'TemplatesService');

        try {
            await this.prisma.notificationTemplate.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Gets the appropriate template for a notification based on templateId, language, and journey.
     * Uses a fallback strategy to find the best matching template.
     *
     * @param templateId The template identifier
     * @param language The preferred language
     * @param journey The journey context (optional)
     * @returns The best matching template for the notification
     */
    async getTemplateForNotification(
        templateId: string,
        language: string,
        journey?: string
    ): Promise<NotificationTemplate> {
        this.logger.log(
            `Getting template for notification - templateId: ${templateId}, language: ${language}, journey: ${journey || 'any'}`,
            'TemplatesService'
        );

        let template: NotificationTemplate | null = null;

        // Try to find a template matching all criteria
        if (journey) {
            const journeyTemplates = await this.findByJourney(journey, language);
            const matchingTemplates = journeyTemplates.filter((t) => t.templateId === templateId);

            if (matchingTemplates.length > 0) {
                template = matchingTemplates[0];
            }
        }

        // If no journey-specific template found, try to find one with language match
        if (!template) {
            const languageTemplates = await this.findByTemplateId(templateId, language);

            if (languageTemplates.length > 0) {
                template = languageTemplates[0];
            }
        }

        // If still no template found, try to find any template with matching templateId
        if (!template) {
            const anyTemplates = await this.findByTemplateId(templateId);

            if (anyTemplates.length > 0) {
                template = anyTemplates[0];
            }
        }

        // If no template found at all, throw an error
        if (!template) {
            this.logger.error(
                `No template found for templateId: ${templateId}`,
                undefined,
                'TemplatesService'
            );
            throw new Error(`No template found for templateId: ${templateId}`);
        }

        return template;
    }

    /**
     * Formats a template by replacing placeholders with actual data.
     * Handles placeholders in the format {{variableName}} in both title and body.
     *
     * @param template The template to format
     * @param data The data to use for placeholder replacement
     * @returns Formatted template with placeholders replaced by actual data
     */
    formatTemplateWithData(template: NotificationTemplate, data: Record<string, unknown>): object {
        this.logger.log(`Formatting template ${template.templateId} with data`, 'TemplatesService');

        // Create a copy of the template to avoid modifying the original
        const formattedTemplate = { ...template };

        // Replace placeholders in title and body
        formattedTemplate.title = this.replacePlaceholders(template.title, data);
        formattedTemplate.body = this.replacePlaceholders(template.body, data);

        return formattedTemplate;
    }

    /**
     * Helper method to replace placeholders in a string with actual data.
     * @param text Text containing placeholders like {{variable}}
     * @param data Object containing the replacement values
     * @returns Text with placeholders replaced
     * @private
     */
    private replacePlaceholders(text: string, data: Record<string, unknown>): string {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
            return data[key] !== undefined ? String(data[key]) : match;
        });
    }
}
