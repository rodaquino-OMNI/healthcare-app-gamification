import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConsentDto, ConsentType } from './dto/create-consent.dto';
import { ConsentStatus } from './dto/update-consent.dto';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

/**
 * Service for managing LGPD consent records.
 *
 * Handles the full lifecycle of user consent:
 * - Granting consent with purpose, data categories, and expiry
 * - Revoking individual or all consents (right to withdraw)
 * - Querying active consent status for authorization checks
 * - Bulk revocation for right-to-be-forgotten requests
 */
@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new consent record for a user.
   * Records IP address and user agent for LGPD auditability.
   *
   * @param userId - The ID of the user granting consent
   * @param dto - Consent details (type, purpose, categories, expiry)
   * @param ip - IP address of the request (for audit trail)
   * @param userAgent - User agent string (for audit trail)
   * @returns The created consent record
   */
  async createConsent(
    userId: string,
    dto: CreateConsentDto,
    ip?: string,
    userAgent?: string,
  ) {
    return this.prisma.consentRecord.create({
      data: {
        userId,
        consentType: dto.consentType,
        purpose: dto.purpose,
        dataCategories: dto.dataCategories,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        ipAddress: ip || null,
        userAgent: userAgent || null,
      },
    });
  }

  /**
   * Revokes a specific consent record.
   * Verifies the consent belongs to the requesting user before revoking.
   *
   * @param userId - The ID of the user revoking consent
   * @param consentId - The ID of the consent record to revoke
   * @returns The updated consent record with REVOKED status
   * @throws AppException if consent not found or does not belong to user
   */
  async revokeConsent(userId: string, consentId: string) {
    const consent = await this.prisma.consentRecord.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      throw new AppException(
        'Consent record not found',
        ErrorType.NOT_FOUND,
        'CONSENT_001',
        { consentId },
      );
    }

    if (consent.userId !== userId) {
      throw new AppException(
        'Cannot revoke consent belonging to another user',
        ErrorType.FORBIDDEN,
        'CONSENT_002',
        { consentId, userId },
      );
    }

    return this.prisma.consentRecord.update({
      where: { id: consentId },
      data: {
        status: ConsentStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Retrieves all consent records for a user, ordered by most recent first.
   *
   * @param userId - The ID of the user
   * @returns Array of consent records
   */
  async getUserConsents(userId: string) {
    return this.prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { grantedAt: 'desc' },
    });
  }

  /**
   * Retrieves the most recent active consent of a specific type for a user.
   *
   * @param userId - The ID of the user
   * @param consentType - The type of consent to check
   * @returns The active consent record, or null if none exists
   */
  async getActiveConsent(userId: string, consentType: ConsentType) {
    return this.prisma.consentRecord.findFirst({
      where: {
        userId,
        consentType,
        status: ConsentStatus.ACTIVE,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { grantedAt: 'desc' },
    });
  }

  /**
   * Checks whether a user has an active, non-expired consent of a specific type.
   *
   * @param userId - The ID of the user
   * @param consentType - The type of consent to verify
   * @returns True if active consent exists, false otherwise
   */
  async hasActiveConsent(userId: string, consentType: ConsentType): Promise<boolean> {
    const consent = await this.getActiveConsent(userId, consentType);
    return consent !== null;
  }

  /**
   * Revokes all active consents for a user.
   * Used for LGPD right-to-be-forgotten (direito ao esquecimento) requests.
   *
   * @param userId - The ID of the user requesting full revocation
   * @returns The number of consent records revoked
   */
  async revokeAllConsents(userId: string): Promise<number> {
    const result = await this.prisma.consentRecord.updateMany({
      where: {
        userId,
        status: ConsentStatus.ACTIVE,
      },
      data: {
        status: ConsentStatus.REVOKED,
        revokedAt: new Date(),
      },
    });

    return result.count;
  }
}
