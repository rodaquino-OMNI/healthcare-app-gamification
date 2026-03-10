import { Controller, Get, Post, Delete, Query, Param, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';

import { DocumentsService } from './documents.service';

/**
 * Handles document-related requests within the Plan service.
 * Exposes endpoints for creating, retrieving, and deleting documents
 * associated with claims or other entities.
 */
@Controller('documents')
export class DocumentsController {
    private readonly logger = new Logger(DocumentsController.name);

    /**
     * Initializes the DocumentsController.
     */
    constructor(private readonly documentsService: DocumentsService) {
        this.logger.log('DocumentsController initialized');
    }

    /**
     * Creates a new document record.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body('entityId') entityId: string,
        @Body('entityType') entityType: string,
        @Body('type') type: string,
        @Body('file_path') file_path: string
    ): Promise<Record<string, unknown>> {
        this.logger.log(`Creating document for ${entityType} with ID ${entityId}`);

        const document = await this.documentsService.create(entityId, entityType, type, file_path);

        return {
            id: document.id,
            message: 'Document created successfully',
        };
    }

    /**
     * Retrieves all documents for a given entity.
     */
    @Get()
    async findAll(@Query('entityId') entityId: string, @Query('entityType') entityType: string): Promise<unknown[]> {
        this.logger.log(`Finding all documents for ${entityType} with ID ${entityId}`);
        return this.documentsService.findAll(entityId, entityType);
    }

    /**
     * Retrieves a single document by its ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<unknown> {
        this.logger.log(`Finding document with ID ${id}`);
        const document = await this.documentsService.findOne(id);

        if (!document) {
            throw new Error('PLAN_DOCUMENT_NOT_FOUND');
        }

        return document;
    }

    /**
     * Deletes a document by its ID.
     */
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        this.logger.log(`Deleting document with ID ${id}`);
        await this.documentsService.delete(id);
    }
}
