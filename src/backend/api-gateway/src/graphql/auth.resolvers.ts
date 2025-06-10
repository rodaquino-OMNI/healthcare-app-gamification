import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Resolver()
export class AuthResolvers {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('services.auth.url', 'http://auth-service:3001');
  }

  @Query('getUser')
  @UseGuards(JwtAuthGuard)
  async getUser(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.authServiceUrl}/users/${id}`),
    );
    return response.data;
  }

  @Mutation('login')
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/login`, {
        email,
        password,
      }),
    );
    return response.data;
  }

  @Mutation('register')
  async register(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/register`, {
        name,
        email,
        password,
      }),
    );
    return response.data;
  }

  @Mutation('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/logout`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('refreshToken')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@CurrentUser() user: any) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/refresh`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('verifyMFA')
  @UseGuards(JwtAuthGuard)
  async verifyMFA(
    @CurrentUser() user: any,
    @Args('code') code: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/mfa/verify`, {
        userId: user.id,
        code,
      }),
    );
    return response.data;
  }

  @Mutation('requestPasswordReset')
  async requestPasswordReset(@Args('email') email: string) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/password/reset-request`, {
        email,
      }),
    );
    return response.data;
  }

  @Mutation('resetPassword')
  async resetPassword(
    @Args('token') token: string,
    @Args('password') password: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/password/reset`, {
        token,
        password,
      }),
    );
    return response.data;
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: any,
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.patch(`${this.authServiceUrl}/users/${user.id}`, {
        name,
        email,
      }),
    );
    return response.data;
  }

  @Mutation('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: any,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/password/change`, {
        userId: user.id,
        oldPassword,
        newPassword,
      }),
    );
    return response.data;
  }

  @Mutation('setupMFA')
  @UseGuards(JwtAuthGuard)
  async setupMFA(@CurrentUser() user: any) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/mfa/setup`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('disableMFA')
  @UseGuards(JwtAuthGuard)
  async disableMFA(@CurrentUser() user: any) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/mfa/disable`, {
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('socialLogin')
  async socialLogin(
    @Args('provider') provider: string,
    @Args('token') token: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/social/${provider}`, {
        token,
      }),
    );
    return response.data;
  }

  @Mutation('biometricLogin')
  async biometricLogin(@Args('biometricData') biometricData: string) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/biometric`, {
        biometricData,
      }),
    );
    return response.data;
  }
}