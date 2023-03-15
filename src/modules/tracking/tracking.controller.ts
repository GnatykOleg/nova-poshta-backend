import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseFilters,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingParamsDTO } from './dto/tracking.dto';
import { HttpExceptionFilter } from '../../common/http-exception.filter';

// Main path for tracking
@Controller('api/tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // Get by tracking value im params
  @Get(':trackingNumber')

  // Build-in errors handler
  @UseFilters(HttpExceptionFilter)

  // Get tracking status from tracking service
  async getTrackingStatusController(@Param() params: TrackingParamsDTO) {
    const trackingStatus = await this.trackingService.getTrackingStatusService(
      params.trackingNumber,
    );

    // If trackingStatus return from service null, its mean this tracking number doesn't exist in Nova Poshta
    if (!trackingStatus)
      throw new NotFoundException('ТТН з таким номером не знайдено в базі');

    // If trackingStatus true, return tracking data
    return trackingStatus;
  }
}
