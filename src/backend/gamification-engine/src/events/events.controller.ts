import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { Controller, Post, Body, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProcessEventDto } from './dto/process-event.dto';
import { EventsService } from './events.service';

/**
 * Controller for handling incoming events from various parts of the AUSTA SuperApp
 * and dispatching them to the EventsService for processing.
 */
@ApiTags('events')
@Controller('events')
export class EventsController {
    /**
     * Injects the EventsService.
     */
    constructor(private readonly eventsService: EventsService) {}

    /**
     * Handles incoming POST requests to process events.
     *
     * @param processEventDto - The event data to process
     * @returns A promise that resolves with the result of event processing
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseFilters(AllExceptionsFilter)
    @ApiOperation({ summary: 'Process a gamification event' })
    @ApiResponse({ status: 201, description: 'Event processed successfully' })
    async processEvent(@Body() processEventDto: ProcessEventDto): Promise<unknown> {
        return this.eventsService.processEvent(processEventDto);
    }
}
