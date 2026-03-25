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

/**
 * Encrypts the specified PHI fields in a data object before writing to the DB.
 */
function encryptFields(
    data: Record<string, unknown>,
    fields: string[],
    encryptionService: EncryptionService
): void {
    for (const field of fields) {
        if (data[field] !== null && data[field] !== undefined) {
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
    record: Record<string, unknown>,
    fields: string[],
    encryptionService: EncryptionService
): void {
    for (const field of fields) {
        if (
            record[field] !== null &&
            record[field] !== undefined &&
            typeof record[field] === 'string'
        ) {
            const fieldValue = record[field] as string;
            if (encryptionService.isEncrypted(fieldValue)) {
                try {
                    record[field] = encryptionService.decrypt(fieldValue);
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
    result: unknown,
    fields: string[],
    encryptionService: EncryptionService
): unknown {
    if (result === null || result === undefined) {
        return result;
    }

    if (Array.isArray(result)) {
        for (const record of result as Record<string, unknown>[]) {
            decryptFields(record, fields, encryptionService);
        }
    } else if (typeof result === 'object') {
        decryptFields(result as Record<string, unknown>, fields, encryptionService);
    }

    return result;
}

/** Shape of $extends $allModels query hook arguments. */
interface ExtensionQueryArgs {
    model: string;
    args: Record<string, unknown>;
    query: (args: Record<string, unknown>) => Promise<unknown>;
}

/** Return type for createEncryptionExtension — a Prisma $extends config object. */
interface PrismaEncryptionExtension {
    query: {
        $allModels: Record<string, (args: ExtensionQueryArgs) => Promise<unknown>>;
    };
}

/**
 * Creates a Prisma $extends query extension that automatically encrypts PHI
 * fields on write and decrypts them on read.
 *
 * Usage in PrismaService.onModuleInit():
 *   this.extendedClient = this.$extends(createEncryptionExtension(encryptionService));
 */
export function createEncryptionExtension(
    encryptionService: EncryptionService
): PrismaEncryptionExtension {
    return {
        query: {
            $allModels: {
                async create({ model, args, query }: ExtensionQueryArgs) {
                    const fields = PHI_FIELDS[model];
                    if (fields && args.data) {
                        encryptFields(
                            args.data as Record<string, unknown>,
                            fields,
                            encryptionService
                        );
                    }
                    const result = await query(args);
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },

                async update({ model, args, query }: ExtensionQueryArgs) {
                    const fields = PHI_FIELDS[model];
                    if (fields && args.data) {
                        encryptFields(
                            args.data as Record<string, unknown>,
                            fields,
                            encryptionService
                        );
                    }
                    const result = await query(args);
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },

                async upsert({ model, args, query }: ExtensionQueryArgs) {
                    const fields = PHI_FIELDS[model];
                    if (fields) {
                        if (args.create) {
                            encryptFields(
                                args.create as Record<string, unknown>,
                                fields,
                                encryptionService
                            );
                        }
                        if (args.update) {
                            encryptFields(
                                args.update as Record<string, unknown>,
                                fields,
                                encryptionService
                            );
                        }
                    }
                    const result = await query(args);
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },

                async createMany({ model, args, query }: ExtensionQueryArgs) {
                    const fields = PHI_FIELDS[model];
                    if (fields && Array.isArray(args.data)) {
                        for (const item of args.data as Record<string, unknown>[]) {
                            encryptFields(item, fields, encryptionService);
                        }
                    }
                    // createMany returns a count, not records — no decryption needed
                    return query(args);
                },

                async findMany({ model, args, query }: ExtensionQueryArgs) {
                    const result = await query(args);
                    const fields = PHI_FIELDS[model];
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },

                async findFirst({ model, args, query }: ExtensionQueryArgs) {
                    const result = await query(args);
                    const fields = PHI_FIELDS[model];
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },

                async findUnique({ model, args, query }: ExtensionQueryArgs) {
                    const result = await query(args);
                    const fields = PHI_FIELDS[model];
                    return fields ? decryptResult(result, fields, encryptionService) : result;
                },
            },
        },
    };
}
