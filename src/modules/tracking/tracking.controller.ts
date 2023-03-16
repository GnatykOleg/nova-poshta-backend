import { Controller, Get, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingParamsDTO } from './dto/tracking.dto';

// Main path for tracking
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // Get by tracking value im params
  @Get(':trackingNumber')

  // Get tracking status from tracking service
  async getTrackingStatusController(@Param() params: TrackingParamsDTO) {
    const trackingStatus = await this.trackingService.getTrackingStatusService(
      params.trackingNumber,
    );

    return trackingStatus;
  }
}
