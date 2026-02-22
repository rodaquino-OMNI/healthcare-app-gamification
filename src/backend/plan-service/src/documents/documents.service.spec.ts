import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

const mockPrismaService = {
  document: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockLoggerService = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const mockTracingService = {
  createSpan: jest.fn().mockImplementation((_name, fn) => fn()),
};

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: TracingService, useValue: mockTracingService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new document', async () => {
      const entityId = 'test-claim-id';
      const entityType = 'claim';
      const type = 'receipt';
      const filePath = '/uploads/documents/receipt.pdf';

      const createdDocument = {
        id: 'test-doc-id',
        entity_id: entityId,
        entity_type: entityType,
        type,
        file_path: filePath,
        createdAt: new Date(),
      };

      mockPrismaService.document.create.mockResolvedValue(createdDocument);

      const result = await service.create(entityId, entityType, type, filePath);

      expect(result).toEqual(createdDocument);
      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: {
          entity_id: entityId,
          entity_type: entityType,
          type,
          file_path: filePath,
        },
      });
    });

    it('should log document creation', async () => {
      const createdDocument = {
        id: 'test-doc-id',
        entity_id: 'test-entity-id',
        entity_type: 'claim',
        type: 'receipt',
        file_path: '/path/to/file.pdf',
      };

      mockPrismaService.document.create.mockResolvedValue(createdDocument);

      await service.create('test-entity-id', 'claim', 'receipt', '/path/to/file.pdf');

      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should throw an error when database create fails', async () => {
      const dbError = new Error('DB write error');
      mockPrismaService.document.create.mockRejectedValue(dbError);

      await expect(
        service.create('entity-id', 'claim', 'receipt', '/path/file.pdf')
      ).rejects.toThrow('DB write error');
    });

    it('should log error on creation failure', async () => {
      mockPrismaService.document.create.mockRejectedValue(new Error('DB error'));

      await expect(
        service.create('entity-id', 'claim', 'receipt', '/path/file.pdf')
      ).rejects.toThrow();

      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all documents for an entity', async () => {
      const entityId = 'test-claim-id';
      const entityType = 'claim';
      const documents = [
        { id: 'doc-1', entity_id: entityId, entity_type: entityType, type: 'receipt' },
        { id: 'doc-2', entity_id: entityId, entity_type: entityType, type: 'medical_report' },
      ];

      mockPrismaService.document.findMany.mockResolvedValue(documents);

      const result = await service.findAll(entityId, entityType);

      expect(result).toEqual(documents);
      expect(mockPrismaService.document.findMany).toHaveBeenCalledWith({
        where: { entity_id: entityId, entity_type: entityType },
      });
    });

    it('should return empty array when no documents found', async () => {
      mockPrismaService.document.findMany.mockResolvedValue([]);

      const result = await service.findAll('no-entity', 'claim');

      expect(result).toEqual([]);
    });

    it('should throw an error when database query fails', async () => {
      mockPrismaService.document.findMany.mockRejectedValue(new Error('DB read error'));

      await expect(service.findAll('entity-id', 'claim')).rejects.toThrow('DB read error');
    });

    it('should log error on query failure', async () => {
      mockPrismaService.document.findMany.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll('entity-id', 'claim')).rejects.toThrow();

      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const document = {
        id: 'test-doc-id',
        entity_id: 'test-entity-id',
        entity_type: 'claim',
        type: 'receipt',
        file_path: '/path/file.pdf',
      };

      mockPrismaService.document.findUnique.mockResolvedValue(document);

      const result = await service.findOne('test-doc-id');

      expect(result).toEqual(document);
      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-doc-id' },
      });
    });

    it('should return null when document not found', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      mockPrismaService.document.findUnique.mockRejectedValue(new Error('DB read error'));

      await expect(service.findOne('test-id')).rejects.toThrow('DB read error');
    });

    it('should log error on query failure', async () => {
      mockPrismaService.document.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne('test-id')).rejects.toThrow();

      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document successfully', async () => {
      mockPrismaService.document.delete.mockResolvedValue({ id: 'test-doc-id' });

      await expect(service.delete('test-doc-id')).resolves.toBeUndefined();
      expect(mockPrismaService.document.delete).toHaveBeenCalledWith({
        where: { id: 'test-doc-id' },
      });
    });

    it('should log successful deletion', async () => {
      mockPrismaService.document.delete.mockResolvedValue({ id: 'test-doc-id' });

      await service.delete('test-doc-id');

      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should throw an error when database delete fails', async () => {
      mockPrismaService.document.delete.mockRejectedValue(new Error('DB delete error'));

      await expect(service.delete('test-doc-id')).rejects.toThrow('DB delete error');
    });

    it('should log error on delete failure', async () => {
      mockPrismaService.document.delete.mockRejectedValue(new Error('DB error'));

      await expect(service.delete('test-doc-id')).rejects.toThrow();

      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
