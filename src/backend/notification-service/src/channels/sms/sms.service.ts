import { Injectable } from '@nestjs/common'; // v10.0.0+
import { ConfigService } from '@nestjs/config'; // v10.0.0+
import { Twilio } from 'twilio'; // v4.0.0+
import { notification } from '../config/configuration';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { SYS_INTERNAL_SERVER_ERROR } from '../../../shared/src/constants/error-codes.constants';

/**
 * Service responsible for sending SMS notifications using Twilio.
 * This service encapsulates the logic for interacting with the SMS provider's API,
 * including authentication, message formatting, and error handling.
 */
@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  /**
   * Initializes the SmsService with the Twilio client and configuration.
   * @param configService - The NestJS config service for accessing configuration
   * @param logger - The logger service for logging events and errors
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const accountSid = this.configService.get<string>('notification.sms.accountSid');
    const authToken = this.configService.get<string>('notification.sms.authToken');
    
    this.twilioClient = new Twilio(accountSid, authToken);
    this.logger.log('SMS Service initialized', 'SmsService');
  }

  /**
   * Sends an SMS message using the Twilio API.
   * @param phoneNumber - The recipient's phone number 
   * @param message - The message content to send
   * @returns A promise that resolves when the SMS message is sent successfully
   * @throws Error if the SMS fails to send
   */
  async sendSms(phoneNumber: string, message: string): Promise<void> {
    try {
      const defaultFrom = this.configService.get<string>('notification.sms.defaultFrom');

      await this.twilioClient.messages.create({
        body: message,
        from: defaultFrom,
        to: phoneNumber,
      });

      this.logger.log(`SMS sent to ${phoneNumber}`, 'SmsService');
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber}: ${error.message}`,
        error.stack,
        'SmsService'
      );
      throw new Error(`${SYS_INTERNAL_SERVER_ERROR}: Failed to send SMS: ${error.message}`);
    }
  }
}