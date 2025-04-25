import { Controller, Post, Body, UseGuards, UseFilters, Inject } from '@nestjs/common';
import { EventsService } from './events.service';
import { ProcessEventDto } from './dto/process-event.dto';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { JwtAuthGuard } from 'src/backend/auth-service/src/auth/guards/jwt-auth.guard';

/**
 * Controller for handling incoming events from various parts of the AUSTA SuperApp
 * and dispatching them to the EventsService for processing.
 */
@Controller('events')
export class EventsController {
  /**
   * Injects the EventsService.
   */
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Handles incoming POST requests to process events.
   * 
   * @param processEventDto The event to process containing type, userId, data, and optional journey
   * @returns A promise that resolves with the result of the event processing
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseFilters(AllExceptionsFilter)
  async processEvent(@Body() processEventDto: ProcessEventDto): Promise<any> {
    return this.eventsService.processEvent(processEventDto);
  }
}