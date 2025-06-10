import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Resolver()
export class HealthResolvers {
  private readonly healthServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.healthServiceUrl = this.configService.get<string>('services.health.url', 'http://health-service:3002');
  }

  @Query('getHealthMetrics')
  @UseGuards(JwtAuthGuard)
  async getHealthMetrics(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
    @Args('types', { nullable: true }) types?: string[],
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
    @Args('source', { nullable: true }) source?: string,
  ) {
    const params = new URLSearchParams();
    if (types) params.append('types', types.join(','));
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (source) params.append('source', source);

    const response = await lastValueFrom(
      this.httpService.get(`${this.healthServiceUrl}/metrics/${userId}?${params}`),
    );
    return response.data;
  }

  @Query('getHealthGoals')
  @UseGuards(JwtAuthGuard)
  async getHealthGoals(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('type', { nullable: true }) type?: string,
  ) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);

    const response = await lastValueFrom(
      this.httpService.get(`${this.healthServiceUrl}/goals/${userId}?${params}`),
    );
    return response.data;
  }

  @Query('getMedicalHistory')
  @UseGuards(JwtAuthGuard)
  async getMedicalHistory(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
    @Args('types', { nullable: true }) types?: string[],
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
    @Args('severity', { nullable: true }) severity?: string,
  ) {
    const params = new URLSearchParams();
    if (types) params.append('types', types.join(','));
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (severity) params.append('severity', severity);

    const response = await lastValueFrom(
      this.httpService.get(`${this.healthServiceUrl}/medical-history/${userId}?${params}`),
    );
    return response.data;
  }

  @Query('getConnectedDevices')
  @UseGuards(JwtAuthGuard)
  async getConnectedDevices(
    @CurrentUser() user: any,
    @Args('userId') userId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.healthServiceUrl}/devices/${userId}`),
    );
    return response.data;
  }

  @Mutation('createHealthMetric')
  @UseGuards(JwtAuthGuard)
  async createHealthMetric(
    @CurrentUser() user: any,
    @Args('recordId') recordId: string,
    @Args('createMetricDto') createMetricDto: any,
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.healthServiceUrl}/metrics/${recordId}`, createMetricDto),
    );
    return response.data;
  }
}