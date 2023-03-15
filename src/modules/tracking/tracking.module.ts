import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { Tracking, TrackingSchema } from './models/tracking.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
