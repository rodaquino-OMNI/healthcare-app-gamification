import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    UseGuards,
    NotFoundException,
    Logger,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common'; // @nestjs/common ^9.0.0
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { QuestsService } from './quests.service';

// Define the DTO interfaces locally since imports are failing
interface PaginationDto {
    page?: number;
    limit?: number;
}

interface FilterDto {
    orderBy?: Record<string, string>;
    where?: Record<string, unknown>;
    journey?: string;
}

// Create the CurrentUser decorator locally
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user: Record<string, unknown> }>();
        const user = request.user;
        return data ? user?.[data] : user;
    }
);

/**
 * Controller for managing quests.
 */
@ApiTags('quests')
@Controller('quests')
export class QuestsController {
    private logger = new Logger(QuestsController.name);

    /**
     * Injects the QuestsService.
     */
    constructor(private readonly questsService: QuestsService) {}

    /**
     * Retrieves all quests.
     */
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'List all quests' })
    @ApiResponse({ status: 200, description: 'Returns list of all quests' })
    async findAll(
        @Query() _pagination: PaginationDto,
        @Query() _filter: FilterDto
    ): Promise<unknown[]> {
        this.logger.log('Finding all quests');
        const quests = await this.questsService.findAll();
        this.logger.log(`Found ${quests.length} quests`);
        return quests;
    }

    /**
     * Retrieves a single quest by its ID.
     */
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get quest by ID' })
    @ApiResponse({ status: 200, description: 'Returns the quest' })
    async findOne(@Param('id') id: string): Promise<unknown> {
        this.logger.log(`Finding quest with ID: ${id}`);
        const quest = await this.questsService.findOne(id);

        if (!quest) {
            throw new NotFoundException(`Quest with ID ${id} not found`);
        }

        this.logger.log(`Found quest with ID: ${id}`);
        return quest;
    }

    /**
     * Starts a quest for a user.
     */
    @Post(':id/start')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Start a quest for the current user' })
    @ApiResponse({ status: 201, description: 'Quest started successfully' })
    async startQuest(
        @Param('id') id: string,
        @CurrentUser() user: { id: string }
    ): Promise<unknown> {
        this.logger.log(`Starting quest ${id} for user ${user.id}`);
        const userQuest = await this.questsService.startQuest(user.id, id);
        this.logger.log(`Started quest ${id} for user ${user.id}`);
        return userQuest;
    }

    /**
     * Completes a quest for a user.
     */
    @Post(':id/complete')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Complete a quest for the current user' })
    @ApiResponse({ status: 201, description: 'Quest completed successfully' })
    async completeQuest(
        @Param('id') id: string,
        @CurrentUser() user: { id: string }
    ): Promise<unknown> {
        this.logger.log(`Completing quest ${id} for user ${user.id}`);
        const userQuest = await this.questsService.completeQuest(user.id, id);
        this.logger.log(`Completed quest ${id} for user ${user.id}`);
        return userQuest;
    }
}
