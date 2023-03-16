import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../config/configuration';

import { TrackingModule } from '../tracking/tracking.module';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    DepartmentsModule,
    TrackingModule,
  ],
})
export class AppModule {}
