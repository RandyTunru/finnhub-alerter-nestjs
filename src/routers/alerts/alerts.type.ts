import { z } from 'zod';
import { Condition, AlertStatus } from '../../entities/alert.entity';

export const PostAlertTypes = {
  PostAlertRequest: z.object({
    stockSymbol: z.string().min(1).max(10),
    targetPrice: z.number().positive(),
    condition: z.enum(Condition),
    status: z.enum(AlertStatus).optional(),
  }),

  PostAlertResponse: z.object({
    id: z.string().uuid(),
    stockSymbol: z.string().min(1).max(10),
    targetPrice: z.number().positive(),
    condition: z.enum(Condition),
  }),
};

export type PostAlertRequest = z.infer<typeof PostAlertTypes.PostAlertRequest>;

export const AlertItem = z.object({
  id: z.string().uuid(),
  stockSymbol: z.string().min(1).max(10),
  targetPrice: z.number().positive(),
  condition: z.enum(Condition),
  status: z.enum(AlertStatus),
});

export const GetAlertsTypes = {
  GetAlertsResponse: z.object({
    count: z.number().nonnegative(),
    alerts: z.array(AlertItem),
  }),
};

export type AlertItemType = z.infer<typeof AlertItem>;
export type GetAlertsResponse = z.infer<
  typeof GetAlertsTypes.GetAlertsResponse
>;
