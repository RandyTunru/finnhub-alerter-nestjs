import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routers/auth/auth.module';
import { StocksModule } from './routers/stocks/stocks.module';
import { AlertsModule } from './routers/alerts/alerts.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.app',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('USER_DB_HOST'),
        port: configService.get<number>('USER_DB_PORT'),
        username: configService.get<string>('USER_DB_USERNAME'),
        password: configService.get<string>('USER_DB_PASSWORD'),
        database: configService.get<string>('USER_DB_DATABASE'),
        // TypeORM settings
        synchronize: false,
        migrationsRun: false,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    AuthModule,
    StocksModule,
    AlertsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
