import { IsString, Length, Matches } from 'class-validator';

export class TrackingParamsDTO {
  // Is param is a string
  @IsString()

  // Is param lenght 14 symbols
  @Length(14, 14, { message: 'trackingNumber must be 14 characters long' })

  // Is param string contain only numbers
  @Matches(/^[0-9]+$/, { message: 'trackingNumber must contain only digits' })

  // Param
  trackingNumber: string;
}
