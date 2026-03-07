/* eslint-disable */
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common'; // v10.0.0+
import { ConfigService } from '@nestjs/config'; // v10.0.0+
import * as admin from 'firebase-admin'; // v11.0.0+

interface PushPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
    android?: admin.messaging.AndroidConfig;
    apns?: admin.messaging.ApnsConfig;
    webpush?: admin.messaging.WebpushConfig;
}

/**
 * Service responsible for sending push notifications using Firebase Cloud Messaging (FCM).
 * Provides an abstraction layer for interacting with the FCM API and handles all
 * the necessary configuration and error handling.
 */
@Injectable()
export class PushService {
    private readonly apiKey: string;
    private readonly logger: LoggerService;

    /**
     * Initializes the PushService with the Firebase Admin SDK and the API key.
     * @param configService The NestJS config service for accessing configuration values
     * @param logger The logger service for logging events and errors
     */
    constructor(
        private readonly configService: ConfigService,
        logger: LoggerService
    ) {
        this.logger = logger;

        // Retrieve the push notification API key from the configuration
        this.apiKey = this.configService.get<string>('notification.push.apiKey', '');

        // Initialize Firebase Admin SDK
        this.initializeFirebaseAdmin();
    }

    /**
     * Initializes the Firebase Admin SDK for sending push notifications
     * @private
     */
    private initializeFirebaseAdmin(): void {
        if (!this.apiKey) {
            this.logger.warn('Push notification API key not configured', 'PushService');
            return;
        }

        // Only initialize if not already initialized
        // eslint-disable-next-line import/namespace
        if (admin.apps.length === 0) {
            try {
                // The API key could be a JSON string or a path to a service account file
                let serviceAccount;

                try {
                    // Try to parse as JSON string
                    serviceAccount = JSON.parse(this.apiKey);
                } catch (e) {
                    // If not valid JSON, assume it's a path to a service account file
                    serviceAccount = this.apiKey;
                }

                // eslint-disable-next-line import/namespace
                admin.initializeApp({
                    // eslint-disable-next-line import/namespace
                    credential: admin.credential.cert(serviceAccount),
                });

                this.logger.log('Firebase Cloud Messaging initialized successfully', 'PushService');
            } catch (error: unknown) {
                this.logger.error(
                    `Failed to initialize Firebase Cloud Messaging: ${error instanceof Error ? error.message : String(error)}`,
                    error instanceof Error ? error.stack : undefined,
                    'PushService'
                );
            }
        }
    }

    /**
     * Sends a push notification to a user's device using FCM.
     * @param token The device token to send the notification to
     * @param payload The notification payload containing title, body, and additional data
     * @returns A promise that resolves when the notification is sent successfully
     */
    async send(token: string, payload: PushPayload): Promise<void> {
        if (!token) {
            this.logger.warn('Cannot send push notification: No device token provided', 'PushService');
            return;
        }

        // eslint-disable-next-line import/namespace
        if (admin.apps.length === 0) {
            this.logger.error('Cannot send push notification: Firebase Cloud Messaging not initialized', 'PushService');
            throw new Error('Firebase Cloud Messaging not initialized');
        }

        try {
            // Construct the message payload with the provided title, body, and data
            const message: admin.messaging.Message = {
                token,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
            };

            // Add platform-specific configurations if provided
            if (payload.android) {
                message.android = payload.android;
            }
            if (payload.apns) {
                message.apns = payload.apns;
            }
            if (payload.webpush) {
                message.webpush = payload.webpush;
            }

            // Send the message to the specified device token using FCM
            // eslint-disable-next-line import/namespace
            await admin.messaging().send(message);

            // Logs the successful sending of the push notification
            this.logger.log(`Push notification sent successfully to ${token.substring(0, 8)}...`, 'PushService');
        } catch (error: unknown) {
            // Handles any errors that occur during the push notification sending process
            this.logger.error(
                `Failed to send push notification: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
                'PushService'
            );
            throw error;
        }
    }
}
