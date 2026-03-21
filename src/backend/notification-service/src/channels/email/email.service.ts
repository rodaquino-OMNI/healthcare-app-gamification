import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Service responsible for sending email notifications.
 * Uses nodemailer to handle email delivery through a configured SMTP provider.
 */
@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    /**
     * Creates an instance of EmailService.
     * Initializes the nodemailer transporter with configuration from ConfigService.
     *
     * @param configService - NestJS ConfigService for accessing configuration settings
     * @param logger - Logger service for logging events
     */
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService
    ) {
        const emailConfig = {
            host: this.configService.get<string>('email.host'),
            port: this.configService.get<number>('email.port'),
            secure: this.configService.get<boolean>('email.secure', false),
            auth: {
                user: this.configService.get<string>('email.user'),
                pass: this.configService.get<string>('email.password'),
            },
        };

        this.transporter = nodemailer.createTransport(emailConfig);
        this.logger.log('Email service initialized', 'EmailService');
    }

    /**
     * Sends an email message using the configured Nodemailer transporter.
     *
     * @param to - Recipient email address
     * @param subject - Email subject
     * @param html - Email body in HTML format
     * @returns A promise that resolves when the email is sent successfully
     * @throws AppException if the email sending fails
     */
    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            this.logger.log(`Attempting to send email to ${to}`, 'EmailService');

            const from = this.configService.get<string>('email.from');

            const mailOptions = {
                from,
                to,
                subject,
                html,
            };

            await this.transporter.sendMail(mailOptions);

            this.logger.log(`Email sent successfully to ${to}`, 'EmailService');
        } catch (error: unknown) {
            this.logger.error(
                `Failed to send email to ${to}: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
                'EmailService'
            );

            throw new AppException(
                'Failed to send email notification',
                ErrorType.EXTERNAL,
                'NOTIFICATION_001',
                {
                    recipient: to,
                }
            );
        }
    }
}
