import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiOperation({ summary: 'Send a notification' })
    @ApiResponse({ status: 201, description: 'The notification has been sent.' })
    async sendNotification(@Body() sendNotificationDto: SendNotificationDto): Promise<Notification> {
        return this.notificationsService.sendNotification(sendNotificationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all user notifications' })
    async findAll(@CurrentUser() userId: string, @Query('isRead') isRead?: boolean): Promise<Notification[]> {
        return this.notificationsService.findAllByUser(userId, isRead);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get a notification by ID' })
    async findOne(@Param('id') id: string, @CurrentUser() userId: string): Promise<Notification> {
        return this.notificationsService.findOne(id, userId);
    }

    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Mark a notification as read' })
    async markAsRead(@Param('id') id: string, @CurrentUser() userId: string): Promise<Notification> {
        return this.notificationsService.markAsRead(id, userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a notification' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.notificationsService.remove(id);
    }
}
