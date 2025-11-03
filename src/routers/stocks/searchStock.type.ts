import { z } from 'zod';

export const FinnhubStockItem = z.object({
  symbol: z.string(),
  description: z.string(),
  displaySymbol: z.string(),
  type: z.string(),
});

export const StockItem = z.object({
  symbol: z.string(),
  description: z.string(),
});

export const SearchStockTypes = {
  SearchStockQuery: z.object({
    q: z.string().min(1).max(100),
  }),
  SearchStockResponse: z.object({
    result: z.array(StockItem),
  }),
};

export type FinnhubStockItem = z.infer<typeof FinnhubStockItem>;
export type StockItem = z.infer<typeof StockItem>;
export type SearchQuery = z.infer<typeof SearchStockTypes.SearchStockQuery>;
export type SearchResponse = z.infer<
  typeof SearchStockTypes.SearchStockResponse
>;
