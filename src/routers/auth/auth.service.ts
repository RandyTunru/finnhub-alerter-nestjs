import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpRequest, SignInRequest, SignInResponse } from './auth.type';
import { SecurityService } from 'src/utils/security.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private securityService: SecurityService,
  ) {}

  async signup(dto: SignUpRequest): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const apiKey = this.securityService.generateApiKey();
    const apiKeyCreatedAt = new Date();
    const apiKeyExpiresAt = this.securityService.apiKeyExpirationDate(
      apiKeyCreatedAt,
      5,
    );

    const user = this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: await this.securityService.hashPassword(dto.password),
      apiKeyEncrypted: this.securityService.encryptApiKey(apiKey),
      apiKeyCreatedAt: apiKeyCreatedAt,
      apiKeyExpiresAt: apiKeyExpiresAt,
    });

    await this.usersRepository.save(user);

    return { message: 'Signup successful' };
  }

  async signin(dto: SignInRequest): Promise<SignInResponse> {
    const user = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.securityService.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        apiKey: this.securityService.decryptApiKey(user.apiKeyEncrypted),
      },
    };
  }
}
