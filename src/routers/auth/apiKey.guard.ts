import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import type { Request, Response } from 'express';
import { SecurityService } from 'src/utils/security.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private securityService: SecurityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;
    const userId = request.headers['user-id'] as string;

    if (!apiKey || !userId) {
      throw new UnauthorizedException('Missing API Key or User ID');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid User ID');
    }

    if (this.securityService.decryptApiKey(user.apiKeyEncrypted) !== apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
