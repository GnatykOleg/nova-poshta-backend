import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackingDocument = HydratedDocument<Tracking>;

// All data is saved in the PascalCase format, as it was originally for NovaPoshta, in order to avoid unnecessary code

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Tracking {
  @Prop({ required: true })
  Number: string;

  // For NovaPoshta, sometimes some fields is empty,
  // in order to maintain the same structure, we check and save data with a 'Дані відсутні' value
  @Prop({
    required: true,
    set: (value: string) => (value === '' ? 'Дані відсутні' : value),
  })
  Status: string;

  @Prop({
    required: true,
    set: (value: string) => (value === '' ? 'Дані відсутні' : value),
  })
  WarehouseRecipient: string;

  @Prop({
    required: true,
    set: (value: string) => (value === '' ? 'Дані відсутні' : value),
  })
  CityRecipient: string;

  @Prop({
    required: true,
    set: (value: string) => (value === '' ? 'Дані відсутні' : value),
  })
  WarehouseSender: string;

  @Prop({ required: true })
  CitySender: string;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
