import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { Controller, Post, Body, UseGuards, Request, Get, UseFilters, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LockoutGuard } from './guards/lockout.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

/**
 * Controller class for handling authentication-related requests.
 */
@ApiTags('auth')
@Controller('auth')
@UseFilters(AllExceptionsFilter)
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
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
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
    @UseGuards(LockoutGuard, LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in an existing user' })
    @ApiResponse({ status: 200, description: 'Login successful, returns JWT token' })
    async login(@Request() req: any): Promise<any> {
        return this.authService.login(req.body.email, req.body.password);
    }

    /**
     * Refreshes access and refresh tokens using a valid refresh token.
     * @param refreshTokenDto DTO containing the refresh token
     * @returns New access and refresh tokens.
     */
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiResponse({ status: 200, description: 'New tokens generated successfully' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refresh_token);
    }

    /**
     * Logs out the authenticated user by revoking their refresh token.
     * @param refreshTokenDto DTO containing the refresh token to revoke
     * @returns Confirmation message.
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    async logout(@Body() refreshTokenDto: RefreshTokenDto) {
        await this.authService.revokeRefreshToken(refreshTokenDto.refresh_token);
        return { message: 'Logged out successfully' };
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     * Uses the JwtAuthGuard to ensure the request is authenticated.
     *
     * @returns The user profile.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns the authenticated user profile' })
    getProfile(@CurrentUser() user: any): any {
        return user;
    }
}
