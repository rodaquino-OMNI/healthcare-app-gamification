import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

const mockDocumentsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('DocumentsController', () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (POST /documents)', () => {
    it('should create a document and return its id with a message', async () => {
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
      };

      mockDocumentsService.create.mockResolvedValue(createdDocument);

      const result = await controller.create(entityId, entityType, type, filePath);

      expect(result).toEqual({
        id: 'test-doc-id',
        message: 'Document created successfully',
      });
      expect(mockDocumentsService.create).toHaveBeenCalledWith(entityId, entityType, type, filePath);
    });

    it('should propagate service errors during document creation', async () => {
      mockDocumentsService.create.mockRejectedValue(new Error('Storage error'));

      await expect(
        controller.create('entity-id', 'claim', 'receipt', '/path/file.pdf')
      ).rejects.toThrow('Storage error');
    });
  });

  describe('findAll (GET /documents)', () => {
    it('should return all documents for an entity', async () => {
      const entityId = 'test-claim-id';
      const entityType = 'claim';
      const documents = [
        { id: 'doc-1', entity_id: entityId, entity_type: entityType, type: 'receipt' },
        { id: 'doc-2', entity_id: entityId, entity_type: entityType, type: 'medical_report' },
      ];

      mockDocumentsService.findAll.mockResolvedValue(documents);

      const result = await controller.findAll(entityId, entityType);

      expect(result).toEqual(documents);
      expect(mockDocumentsService.findAll).toHaveBeenCalledWith(entityId, entityType);
    });

    it('should return empty array when no documents found', async () => {
      mockDocumentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll('entity-id', 'claim');

      expect(result).toEqual([]);
    });

    it('should propagate service errors during findAll', async () => {
      mockDocumentsService.findAll.mockRejectedValue(new Error('DB read error'));

      await expect(controller.findAll('entity-id', 'claim')).rejects.toThrow('DB read error');
    });
  });

  describe('findOne (GET /documents/:id)', () => {
    it('should return the document when found', async () => {
      const document = {
        id: 'test-doc-id',
        entity_id: 'test-entity-id',
        entity_type: 'claim',
        type: 'receipt',
        file_path: '/path/file.pdf',
      };

      mockDocumentsService.findOne.mockResolvedValue(document);

      const result = await controller.findOne('test-doc-id');

      expect(result).toEqual(document);
      expect(mockDocumentsService.findOne).toHaveBeenCalledWith('test-doc-id');
    });

    it('should throw an error when document is not found', async () => {
      mockDocumentsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow();
    });

    it('should propagate service errors', async () => {
      mockDocumentsService.findOne.mockRejectedValue(new Error('DB error'));

      await expect(controller.findOne('test-id')).rejects.toThrow('DB error');
    });
  });

  describe('delete (DELETE /documents/:id)', () => {
    it('should delete a document successfully', async () => {
      mockDocumentsService.delete.mockResolvedValue(undefined);

      await expect(controller.delete('test-doc-id')).resolves.toBeUndefined();
      expect(mockDocumentsService.delete).toHaveBeenCalledWith('test-doc-id');
    });

    it('should propagate service errors during deletion', async () => {
      mockDocumentsService.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.delete('test-doc-id')).rejects.toThrow('Delete failed');
    });
  });
});
