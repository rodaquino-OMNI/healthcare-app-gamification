/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

/**
 * Service responsible for managing documents within the Plan service.
 * Handles document creation, retrieval, and deletion operations.
 */
@Injectable()
export class DocumentsService {
  /**
   * Creates an instance of the DocumentsService.
   * 
   * @param prisma - The Prisma service for database access
   * @param logger - The logger service for logging
   * @param tracingService - The tracing service for distributed tracing
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService
  ) {}
  
  /**
   * Creates a new document record in the database.
   * 
   * @param entityId - ID of the entity this document is associated with
   * @param entityType - Type of entity (e.g., 'claim', 'coverage')
   * @param type - Type of document (e.g., 'receipt', 'medical_report')
   * @param file_path - Path to the stored file
   * @returns The newly created document
   */
  async create(
    entityId: string,
    entityType: string,
    type: string,
    file_path: string
  ): Promise<Document> {
    return this.tracingService.createSpan('documents.create', async () => {
      this.logger.log(`Creating document for ${entityType} with ID ${entityId}`, 'DocumentsService');
      
      try {
        const document = await this.prisma.document.create({
          data: {
            entityId,
            entityType,
            type,
            filePath: file_path,
          },
        });
        
        this.logger.log(`Document created with ID ${document.id}`, 'DocumentsService');
        
        return document as Document;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        this.logger.error(`Failed to create document: ${errorMessage}`, errorStack, 'DocumentsService');
        throw error as any;
      }
    });
  }
  
  /**
   * Retrieves all documents associated with a specific entity.
   * 
   * @param entityId - ID of the entity to find documents for
   * @param entityType - Type of entity (e.g., 'claim', 'coverage')
   * @returns An array of documents
   */
  async findAll(entityId: string, entityType: string): Promise<Document[]> {
    return this.tracingService.createSpan('documents.findAll', async () => {
      this.logger.log(`Finding all documents for ${entityType} with ID ${entityId}`, 'DocumentsService');
      
      try {
        const documents = await this.prisma.document.findMany({
          where: {
            entityId,
            entityType,
          },
        });
        
        this.logger.log(`Found ${documents.length} documents`, 'DocumentsService');
        
        return documents as Document[];
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        this.logger.error(`Failed to find documents: ${errorMessage}`, errorStack, 'DocumentsService');
        throw error as any;
      }
    });
  }
  
  /**
   * Retrieves a specific document by its ID.
   * 
   * @param id - The ID of the document to retrieve
   * @returns The document if found, null otherwise
   */
  async findOne(id: string): Promise<Document | null> {
    return this.tracingService.createSpan('documents.findOne', async () => {
      this.logger.log(`Finding document with ID ${id}`, 'DocumentsService');
      
      try {
        const document = await this.prisma.document.findUnique({
          where: { id },
        });
        
        if (!document) {
          this.logger.log(`Document with ID ${id} not found`, 'DocumentsService');
          return null;
        }
        
        return document as Document;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        this.logger.error(`Failed to find document: ${errorMessage}`, errorStack, 'DocumentsService');
        throw error as any;
      }
    });
  }
  
  /**
   * Deletes a document from the database.
   * 
   * @param id - The ID of the document to delete
   */
  async delete(id: string): Promise<void> {
    return this.tracingService.createSpan('documents.delete', async () => {
      this.logger.log(`Deleting document with ID ${id}`, 'DocumentsService');
      
      try {
        await this.prisma.document.delete({
          where: { id },
        });
        
        this.logger.log(`Document with ID ${id} deleted`, 'DocumentsService');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        this.logger.error(`Failed to delete document: ${errorMessage}`, errorStack, 'DocumentsService');
        throw error as any;
      }
    });
  }
}