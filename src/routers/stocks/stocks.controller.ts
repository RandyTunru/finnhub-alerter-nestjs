import { Controller, UsePipes } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { ZodSerializerDto, ZodValidationPipe } from 'nestjs-zod';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { ApiKeyGuard } from '../auth/apiKey.guard';
import { UseInterceptors, UseGuards, Get, Query } from '@nestjs/common';
import { SearchStockTypes } from './searchStock.type';
import type { SearchQuery, SearchResponse } from './searchStock.type';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('search')
  @UsePipes(new ZodValidationPipe(SearchStockTypes.SearchStockQuery))
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(ZodSerializerInterceptor)
  @ZodSerializerDto(SearchStockTypes.SearchStockResponse)
  async search(@Query() query: SearchQuery): Promise<SearchResponse> {
    return this.stocksService.searchStock(query);
  }
}
