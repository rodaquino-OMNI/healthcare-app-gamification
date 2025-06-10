import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver()
export class PlanResolvers {
  private readonly planServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.planServiceUrl = this.configService.get<string>('services.plan.url', 'http://plan-service:3004');
  }

  @Query('getPlan')
  @UseGuards(JwtAuthGuard)
  async getPlan(
    @CurrentUser() user: any,
    @Args('planId') planId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.planServiceUrl}/plans/${planId}`),
    );
    return response.data;
  }

  @Query('getClaims')
  @UseGuards(JwtAuthGuard)
  async getClaims(
    @CurrentUser() user: any,
    @Args('planId') planId: string,
    @Args('status', { nullable: true }) status?: string,
  ) {
    const params = new URLSearchParams();
    params.append('planId', planId);
    if (status) params.append('status', status);

    const response = await lastValueFrom(
      this.httpService.get(`${this.planServiceUrl}/claims?${params}`),
    );
    return response.data;
  }

  @Mutation('submitClaim')
  @UseGuards(JwtAuthGuard)
  async submitClaim(
    @CurrentUser() user: any,
    @Args('planId') planId: string,
    @Args('type') type: string,
    @Args('procedureCode') procedureCode: string,
    @Args('providerName') providerName: string,
    @Args('serviceDate') serviceDate: string,
    @Args('amount') amount: number,
    @Args('documents', { nullable: true }) documents?: string[],
  ) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.planServiceUrl}/claims`, {
        planId,
        type,
        procedureCode,
        providerName,
        serviceDate,
        amount,
        documents: documents || [],
        userId: user.id,
      }),
    );
    return response.data;
  }

  @Mutation('uploadClaimDocument')
  @UseGuards(JwtAuthGuard)
  async uploadClaimDocument(
    @CurrentUser() user: any,
    @Args('claimId') claimId: string,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    // In a real implementation, this would handle file upload to S3 or similar
    // For now, we'll simulate the upload
    const { filename, mimetype, createReadStream } = await file;
    
    // Simulate file upload and return document info
    const documentUrl = `https://storage.austa.com/claims/${claimId}/${filename}`;
    
    const response = await lastValueFrom(
      this.httpService.post(`${this.planServiceUrl}/claims/${claimId}/documents`, {
        fileName: filename,
        fileType: mimetype,
        fileUrl: documentUrl,
      }),
    );
    return response.data;
  }

  @Mutation('updateClaim')
  @UseGuards(JwtAuthGuard)
  async updateClaim(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('additionalInfo', { nullable: true }) additionalInfo?: any,
  ) {
    const response = await lastValueFrom(
      this.httpService.patch(`${this.planServiceUrl}/claims/${id}`, {
        additionalInfo,
      }),
    );
    return response.data;
  }

  @Mutation('cancelClaim')
  @UseGuards(JwtAuthGuard)
  async cancelClaim(
    @CurrentUser() user: any,
    @Args('id') id: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.patch(`${this.planServiceUrl}/claims/${id}`, {
        status: 'CANCELLED',
      }),
    );
    return response.data;
  }
}