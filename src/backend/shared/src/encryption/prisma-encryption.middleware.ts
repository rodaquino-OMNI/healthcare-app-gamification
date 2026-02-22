import { Prisma } from '@prisma/client';
import { EncryptionService } from './encryption.service';

/**
 * PHI field definitions: maps Prisma model names to their sensitive fields
 * that must be encrypted at rest per LGPD Art.46.
 *
 * Add new models/fields here as the schema evolves.
 */
const PHI_FIELDS: Record<string, string[]> = {
  HealthMetric: ['value', 'notes'],
  HealthGoal: ['targetValue', 'currentValue'],
  Claim: ['procedureCode', 'amount'],
  Document: ['filename'],
  User: ['cpf', 'phone', 'email'],
  Medication: ['name', 'notes'],
  Notification: ['body'],
  Appointment: ['notes'],
  DeviceConnection: ['authToken', 'refreshToken'],
};

/** Prisma actions that write data to the database. */
const WRITE_ACTIONS = ['create', 'update', 'upsert', 'createMany', 'updateMany'];

/** Prisma actions that read data from the database. */
const READ_ACTIONS = ['findUnique', 'findFirst', 'findMany'];

/**
 * Encrypts the specified PHI fields in a data object before writing to the DB.
 */
function encryptFields(
  data: Record<string, any>,
  fields: string[],
  encryptionService: EncryptionService,
): void {
  for (const field of fields) {
    if (data[field] != null) {
      const value = String(data[field]);
      // Skip if already encrypted (idempotent)
      if (!encryptionService.isEncrypted(value)) {
        data[field] = encryptionService.encrypt(value);
      }
    }
  }
}

/**
 * Decrypts the specified PHI fields in a result object after reading from the DB.
 * Gracefully handles legacy unencrypted data by checking format first.
 */
function decryptFields(
  record: Record<string, any>,
  fields: string[],
  encryptionService: EncryptionService,
): void {
  for (const field of fields) {
    if (record[field] != null && typeof record[field] === 'string') {
      if (encryptionService.isEncrypted(record[field])) {
        try {
          record[field] = encryptionService.decrypt(record[field]);
        } catch {
          // If decryption fails, leave the value as-is to avoid data loss.
          // This can happen with corrupted data or key rotation scenarios.
        }
      }
    }
  }
}

/**
 * Decrypts PHI fields in a query result, handling both single records and arrays.
 */
function decryptResult(
  result: any,
  fields: string[],
  encryptionService: EncryptionService,
): any {
  if (result == null) return result;

  if (Array.isArray(result)) {
    for (const record of result) {
      decryptFields(record, fields, encryptionService);
    }
  } else if (typeof result === 'object') {
    decryptFields(result, fields, encryptionService);
  }

  return result;
}

/**
 * Creates Prisma middleware that automatically encrypts PHI fields on write
 * and decrypts them on read. Attach to PrismaService via $use().
 *
 * Usage in PrismaService.onModuleInit():
 *   this.$use(createEncryptionMiddleware(encryptionService));
 */
export function createEncryptionMiddleware(
  encryptionService: EncryptionService,
): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    const model = params.model;
    if (!model || !PHI_FIELDS[model]) {
      return next(params);
    }

    const fields = PHI_FIELDS[model];

    // Encrypt on write
    if (params.action && WRITE_ACTIONS.includes(params.action)) {
      const args = params.args as any;

      if (args?.data) {
        encryptFields(args.data, fields, encryptionService);
      }

      // Handle upsert which has both create and update data
      if (params.action === 'upsert') {
        if (args?.create) {
          encryptFields(args.create, fields, encryptionService);
        }
        if (args?.update) {
          encryptFields(args.update, fields, encryptionService);
        }
      }

      // Handle createMany with array of data
      if (params.action === 'createMany' && Array.isArray(args?.data)) {
        for (const item of args.data) {
          encryptFields(item, fields, encryptionService);
        }
      }
    }

    const result = await next(params);

    // Decrypt on read
    if (params.action && READ_ACTIONS.includes(params.action)) {
      return decryptResult(result, fields, encryptionService);
    }

    // Also decrypt results from write operations (they return the written record)
    if (params.action && ['create', 'update', 'upsert'].includes(params.action)) {
      return decryptResult(result, fields, encryptionService);
    }

    return result;
  };
}
