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
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { User } from './entities/user.entity';

/**
 * Controller for managing users.
 */
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
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves the current user's profile.
   * @returns The current user's profile.
   */
  @Get('me')
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
  findAll(
    @Query() paginationDto: PaginationDto, 
    @Query() filterDto: FilterDto
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findAll(paginationDto, filterDto);
  }

  /**
   * Retrieves a user by their ID.
   * @param id The user ID
   * @returns The user if found.
   */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Updates an existing user.
   * @param id The user ID
   * @param updateUserDto Data for updating the user
   * @returns The updated user.
   */
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by their ID.
   * @param id The user ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}