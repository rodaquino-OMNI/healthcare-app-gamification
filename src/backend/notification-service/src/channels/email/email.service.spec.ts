/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Mock nodemailer before importing the service under test.
// ---------------------------------------------------------------------------
const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn().mockReturnValue({
  sendMail: mockSendMail,
});

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

describe('EmailService', () => {
  let service: EmailService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Provide default config values used during construction
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, any> = {
        'email.host': 'smtp.example.com',
        'email.port': 587,
        'email.secure': false,
        'email.user': 'mock-user',
        'email.password': 'mock-password',
        'email.from': 'no-reply@example.com',
      };
      return config[key];
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize the nodemailer transporter on construction', () => {
    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
      }),
    );
  });

  // -------------------------------------------------------------------------
  // sendEmail
  // -------------------------------------------------------------------------
  describe('sendEmail', () => {
    it('should call transporter.sendMail with the correct options', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'mock-message-id' });

      await service.sendEmail(
        'recipient@example.com',
        'Test Subject',
        '<p>Hello</p>',
      );

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'no-reply@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Hello</p>',
      });
    });

    it('should resolve without error on successful delivery', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'mock-message-id' });

      await expect(
        service.sendEmail('test@example.com', 'Subject', '<p>Body</p>'),
      ).resolves.toBeUndefined();
    });

    it('should throw AppException (EXTERNAL / NOTIFICATION_001) when sendMail fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP connection refused'));

      await expect(
        service.sendEmail('test@example.com', 'Subject', '<p>Body</p>'),
      ).rejects.toThrow(AppException);

      try {
        await service.sendEmail('test@example.com', 'Subject', '<p>Body</p>');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe('NOTIFICATION_001');
      }
    });

    it('should include the recipient address in the error details', async () => {
      mockSendMail.mockRejectedValue(new Error('Connection timeout'));

      try {
        await service.sendEmail('recipient@example.com', 'Subject', '<p>Body</p>');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.metadata).toEqual(
          expect.objectContaining({ recipient: 'recipient@example.com' }),
        );
      }
    });

    it('should log an error message when sendMail fails', async () => {
      mockSendMail.mockRejectedValue(new Error('Auth failed'));

      try {
        await service.sendEmail('test@example.com', 'Subject', '<p>Body</p>');
      } catch {
        // expected
      }

      expect(mockLoggerService.error).toHaveBeenCalled();
    });

    it('should use the from address from config', async () => {
      mockSendMail.mockResolvedValue({});
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'email.from') return 'custom@example.com';
        return 'mock-value';
      });

      // Re-instantiate to pick up new config mock
      const module = await Test.createTestingModule({
        providers: [
          EmailService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: LoggerService, useValue: mockLoggerService },
        ],
      }).compile();
      const freshService = module.get<EmailService>(EmailService);

      await freshService.sendEmail('to@example.com', 'Subject', '<p>Body</p>');

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: 'custom@example.com' }),
      );
    });
  });
});
