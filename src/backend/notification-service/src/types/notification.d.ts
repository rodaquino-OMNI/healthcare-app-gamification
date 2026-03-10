/**
 * Type declarations for notifications and templates
 */

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    journey?: string;
    isRead: boolean;
    data?: Record<string, unknown>;
    channel: string;
    sentAt: Date;
    readAt?: Date;
    expireAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationTemplate {
    id: string;
    code: string;
    name: string;
    description?: string;
    title: string;
    message: string;
    channels: string;
    journey?: string;
    isActive: boolean;
    priority: number;
    data?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface SendNotificationDto {
    userId: string;
    templateCode: string;
    data?: Record<string, unknown>;
    journey?: string;
}
