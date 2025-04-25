import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Get, 
  UseFilters,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';

/**
 * Controller class for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController {
  /**
   * Initializes the AuthController.
   * @param authService Service for authentication operations
   */
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user.
   * @param createUserDto Data transfer object containing user information
   * @returns The newly created user.
   */
  @Post('register')
  @UseFilters(new AllExceptionsFilter())
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.register(createUserDto);
  }

  /**
   * Logs in an existing user and returns a JWT token.
   * Uses the LocalAuthGuard to authenticate the user and
   * then generates a JWT token using the AuthService.
   * 
   * @returns An object containing the JWT token.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new AllExceptionsFilter())
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.body.email, req.body.password);
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   * Uses the JwtAuthGuard to ensure the request is authenticated.
   * 
   * @returns The user profile.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user): any {
    return user;
  }
}