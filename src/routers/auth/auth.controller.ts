import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { AuthTypes } from './auth.type';
import type { SignInRequest, SignInResponse, SignUpRequest } from './auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseInterceptors(ZodSerializerInterceptor)
  @ZodSerializerDto(AuthTypes.SignInResponse)
  signin(@Body() body: SignInRequest): Promise<SignInResponse> {
    return this.authService.signin(body);
  }

  // --- SIGN UP ---
  @Post('signup')
  signup(@Body() body: SignUpRequest): Promise<{ message: string }> {
    return this.authService.signup(body);
  }
}
