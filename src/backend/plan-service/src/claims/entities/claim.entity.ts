import { Document } from '../../documents/entities/document.entity';

/**
 * Status history item for tracking claim status changes
 */
export class StatusHistoryItem {
    status!: string;
    timestamp!: Date;
    note?: string;

    constructor(status: string, note?: string) {
        this.status = status;
        this.timestamp = new Date();
        if (note) {
            this.note = note;
        }
    }
}

/**
 * Enum for claim status values to ensure consistency
 */
export enum ClaimStatus {
    SUBMITTED = 'submitted',
    UNDER_REVIEW = 'under_review',
    INFORMATION_REQUIRED = 'information_required',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PAID = 'paid',
}

/**
 * Represents an insurance claim.
 * This entity is used for storing and tracking insurance claims submitted by users
 * in the Plan journey of the AUSTA SuperApp.
 */
export class Claim {
    /**
     * Unique identifier for the claim
     */
    id!: string;

    /**
     * ID of the user who submitted the claim
     */
    userId!: string;

    /**
     * ID of the plan this claim is associated with
     */
    planId!: string;

    /**
     * Type of claim (e.g., 'medical_visit', 'procedure', 'medication', 'exam')
     */
    type!: string;

    /**
     * Claim amount in the local currency (BRL)
     */
    amount!: number;

    /**
     * Current status of the claim
     * Uses values from the ClaimStatus enum
     */
    status!: string;

    /**
     * Date when the claim was submitted
     */
    submittedAt!: Date;

    /**
     * Date when the claim was approved
     */
    approvedAt?: Date;

    /**
     * Date when the claim was rejected
     */
    rejectedAt?: Date;

    /**
     * Date when the claim was paid
     */
    paidAt?: Date;

    /**
     * Date when the claim was last processed or updated
     */
    processedAt!: Date;

    /**
     * Procedure code related to the claim
     */
    procedureCode?: string;

    /**
     * Diagnosis code related to the claim
     */
    diagnosisCode?: string;

    /**
     * Service date for the claim
     */
    serviceDate?: Date;

    /**
     * Provider name performing the service
     */
    providerName?: string;

    /**
     * Provider tax ID
     */
    providerTaxId?: string;

    /**
     * Procedure description
     */
    procedureDescription?: string;

    /**
     * URL to the receipt document
     */
    receiptUrl?: string;

    /**
     * Additional document URLs
     */
    additionalDocumentUrls?: string[];

    /**
     * History of status changes
     */
    statusHistory?: StatusHistoryItem[];

    /**
     * Notes about the claim
     */
    notes?: string;

    /**
     * Date when the entity was created
     */
    createdAt!: Date;

    /**
     * Date when the entity was last updated
     */
    updatedAt!: Date;

    /**
     * Relationship with the Plan entity
     */
    plan!: Record<string, unknown>;

    /**
     * Documents associated with this claim (e.g., receipts, prescriptions)
     */
    documents!: Document[];
}
