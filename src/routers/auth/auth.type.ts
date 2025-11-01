import { z } from 'zod';

export const AuthTypes = {
  SignUpRequest: z.object({
    email: z.email(),
    name: z.string().min(2).max(100),
    password: z.string().min(8),
  }),
  SignInRequest: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
  SignInResponse: z.object({
    user: z.object({
      id: z.uuid(),
      name: z.string(),
      apiKey: z.string(),
    }),
  }),
};
export type SignUpRequest = z.infer<typeof AuthTypes.SignUpRequest>;
export type SignInRequest = z.infer<typeof AuthTypes.SignInRequest>;
export type SignInResponse = z.infer<typeof AuthTypes.SignInResponse>;
