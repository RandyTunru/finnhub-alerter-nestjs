import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './routers/auth/auth.module';

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
  ],
  providers: [],
})
export class AppModule {}
