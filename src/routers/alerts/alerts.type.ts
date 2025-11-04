import { z } from 'zod';
import { Condition, AlertStatus } from '../../entities/alert.entity';

export const AlertItem = z.object({
  id: z.string().uuid(),
  stockSymbol: z.string().min(1).max(10),
  targetPrice: z.number().positive(),
  condition: z.enum(Condition),
  status: z.enum(AlertStatus),
});

export type AlertItem = z.infer<typeof AlertItem>;

export const PostAlertTypes = {
  PostAlertRequest: z.object({
    stockSymbol: z.string().min(1).max(10),
    targetPrice: z.number().positive(),
    condition: z.enum(Condition),
    status: z.enum(AlertStatus).optional(),
  }),

  PostAlertResponse: z.object({
    message: z.string(),
    item: AlertItem,
  }),
};

export type PostAlertRequest = z.infer<typeof PostAlertTypes.PostAlertRequest>;
export type PostAlertResponse = z.infer<
  typeof PostAlertTypes.PostAlertResponse
>;

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

export const DeleteAlertTypes = {
  DeleteAlertResponse: z.object({
    message: z.string(),
    item: AlertItem,
  }),
};

export type DeleteAlertResponse = z.infer<
  typeof DeleteAlertTypes.DeleteAlertResponse
>;
