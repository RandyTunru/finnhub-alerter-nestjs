import { Controller, Get, Headers, Delete, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Post, Body, UseInterceptors } from '@nestjs/common';
import { ZodSerializerDto, ZodSerializerInterceptor } from 'nestjs-zod';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiKeyGuard } from '../auth/apiKey.guard';
import { UseGuards, UsePipes } from '@nestjs/common';
import {
  DeleteAlertTypes,
  GetAlertsTypes,
  PostAlertTypes,
} from './alerts.type';
import type {
  PostAlertRequest,
  PostAlertResponse,
  GetAlertsResponse,
  DeleteAlertResponse,
} from './alerts.type';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ZodValidationPipe(PostAlertTypes.PostAlertRequest))
  @UseInterceptors(ZodSerializerInterceptor)
  @ZodSerializerDto(PostAlertTypes.PostAlertResponse)
  async createAlert(
    @Headers() headers: Record<string, string>,
    @Body() dto: PostAlertRequest,
  ): Promise<PostAlertResponse> {
    return await this.alertsService.postAlert(headers, dto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(ZodSerializerInterceptor)
  @ZodSerializerDto(GetAlertsTypes.GetAlertsResponse)
  async getAlerts(
    @Headers() headers: Record<string, string>,
  ): Promise<GetAlertsResponse> {
    return await this.alertsService.getAlerts(headers);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(ZodSerializerInterceptor)
  @ZodSerializerDto(DeleteAlertTypes.DeleteAlertResponse)
  async deleteAlert(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ): Promise<DeleteAlertResponse> {
    return await this.alertsService.deleteAlert(headers, id);
  }
}
