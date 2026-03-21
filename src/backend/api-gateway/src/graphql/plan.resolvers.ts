import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { lastValueFrom } from 'rxjs';

import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthenticatedUser {
    id: string;
    email?: string;
    [key: string]: unknown;
}

// graphql-upload types inlined to avoid missing dependency at build time
const GraphQLUpload = 'Upload';
interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => NodeJS.ReadableStream;
}

@Resolver()
export class PlanResolvers {
    private readonly planServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.planServiceUrl = this.configService.get<string>(
            'services.plan.url',
            'http://plan-service:3004'
        );
    }

    @Query('getPlan')
    @UseGuards(JwtAuthGuard)
    async getPlan(
        @CurrentUser() user: AuthenticatedUser,
        @Args('planId') planId: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            this.httpService.get<unknown>(`${this.planServiceUrl}/plans/${planId}`)
        );
        return response.data;
    }

    @Query('getClaims')
    @UseGuards(JwtAuthGuard)
    async getClaims(
        @CurrentUser() user: AuthenticatedUser,
        @Args('planId') planId: string,
        @Args('status', { nullable: true }) status?: string
    ): Promise<unknown> {
        const params = new URLSearchParams();
        params.append('planId', planId);
        if (status) {
            params.append('status', status);
        }

        const response = await lastValueFrom(
            this.httpService.get<unknown>(`${this.planServiceUrl}/claims?${String(params)}`)
        );
        return response.data;
    }

    @Mutation('submitClaim')
    @UseGuards(JwtAuthGuard)
    async submitClaim(
        @CurrentUser() user: AuthenticatedUser,
        @Args('planId') planId: string,
        @Args('type') type: string,
        @Args('procedureCode') procedureCode: string,
        @Args('providerName') providerName: string,
        @Args('serviceDate') serviceDate: string,
        @Args('amount') amount: number,
        @Args('documents', { nullable: true }) documents?: string[]
    ): Promise<unknown> {
        const response = await lastValueFrom(
            this.httpService.post<unknown>(`${this.planServiceUrl}/claims`, {
                planId,
                type,
                procedureCode,
                providerName,
                serviceDate,
                amount,
                documents: documents || [],
                userId: user.id,
            })
        );
        return response.data;
    }

    @Mutation('uploadClaimDocument')
    @UseGuards(JwtAuthGuard)
    async uploadClaimDocument(
        @CurrentUser() user: AuthenticatedUser,
        @Args('claimId') claimId: string,
        @Args('file', { type: () => GraphQLUpload }) file: FileUpload
    ): Promise<unknown> {
        // In a real implementation, this would handle file upload to S3 or similar
        // For now, we'll simulate the upload
        const { filename, mimetype } = file;

        // Simulate file upload and return document info
        const documentUrl = `https://storage.austa.com/claims/${claimId}/${filename}`;

        const response = await lastValueFrom(
            this.httpService.post<unknown>(`${this.planServiceUrl}/claims/${claimId}/documents`, {
                fileName: filename,
                fileType: mimetype,
                fileUrl: documentUrl,
            })
        );
        return response.data;
    }

    @Mutation('updateClaim')
    @UseGuards(JwtAuthGuard)
    async updateClaim(
        @CurrentUser() user: AuthenticatedUser,
        @Args('id') id: string,
        @Args('additionalInfo', { nullable: true }) additionalInfo?: unknown
    ): Promise<unknown> {
        const response = await lastValueFrom(
            this.httpService.patch<unknown>(`${this.planServiceUrl}/claims/${id}`, {
                additionalInfo,
            })
        );
        return response.data;
    }

    @Mutation('cancelClaim')
    @UseGuards(JwtAuthGuard)
    async cancelClaim(
        @CurrentUser() user: AuthenticatedUser,
        @Args('id') id: string
    ): Promise<unknown> {
        const response = await lastValueFrom(
            this.httpService.patch<unknown>(`${this.planServiceUrl}/claims/${id}`, {
                status: 'CANCELLED',
            })
        );
        return response.data;
    }
}
