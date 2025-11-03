import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import type { SearchQuery, SearchResponse } from './searchStock.type';
import type { FinnhubStockItem } from './searchStock.type';

@Injectable()
export class StocksService {
  async searchStock(query: SearchQuery): Promise<SearchResponse> {
    try {
      const response = await axios.get('https://finnhub.io/api/v1/search', {
        headers: {
          'X-Finnhub-Token': process.env.FINNHUB_API_KEY || '',
        },
        params: {
          q: query.q,
        },
      });

      const data = response.data as {
        count: number;
        result: FinnhubStockItem[];
      };

      const result = data.result.map((item) => ({
        symbol: item.symbol,
        description: item.description,
      }));
      return { result };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching stock data from Finnhub:',
          error.response?.status || '',
          error.message,
          error.response?.data || '',
        );
        throw new HttpException(
          'Failed to fetch stock data from external service',
          502,
        );
      }
      console.error('Unexpected error:', error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
