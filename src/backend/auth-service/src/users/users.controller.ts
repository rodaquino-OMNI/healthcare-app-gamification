import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    UseFilters,
    Query,
    Patch,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controller for managing users.
 */
@ApiTags('users')
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
    /**
     * Initializes the UsersController.
     * @param usersService Service for handling user operations
     */
    constructor(private readonly usersService: UsersService) {}

    /**
     * Creates a new user.
     * @param createUserDto Data for creating a new user
     * @returns The newly created user.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto) as unknown as Promise<User>;
    }

    /**
     * Retrieves the current user's profile.
     * @returns The current user's profile.
     */
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns the current user' })
    getMe(@CurrentUser() user: User): Promise<User> {
        return Promise.resolve(user);
    }

    /**
     * Retrieves all users, with optional filtering and pagination.
     * @param paginationDto Pagination parameters
     * @param filterDto Filtering parameters
     * @returns A paginated list of users.
     */
    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List all users (admin only)' })
    @ApiResponse({ status: 200, description: 'Returns paginated list of users' })
    findAll(
        @Query() paginationDto: PaginationDto,
        @Query() filterDto: UserFilterDto
    ): Promise<PaginatedResponse<User>> {
        return this.usersService.findAll(paginationDto, filterDto) as unknown as Promise<PaginatedResponse<User>>;
    }

    /**
     * Retrieves a user by their ID.
     * @param id The user ID
     * @returns The user if found.
     */
    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get user by ID (admin only)' })
    @ApiResponse({ status: 200, description: 'Returns the user' })
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id) as unknown as Promise<User>;
    }

    /**
     * Updates an existing user.
     * @param id The user ID
     * @param updateUserDto Data for updating the user
     * @returns The updated user.
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto) as unknown as Promise<User>;
    }

    /**
     * Deletes a user by their ID.
     * @param id The user ID
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 204, description: 'User deleted successfully' })
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
