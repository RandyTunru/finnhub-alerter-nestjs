import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { SecurityService } from 'src/utils/security.service';
import { ApiKeyGuard } from './apiKey.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, SecurityService, ApiKeyGuard],
  exports: [ApiKeyGuard, TypeOrmModule.forFeature([User]), SecurityService],
})
export class AuthModule {}
