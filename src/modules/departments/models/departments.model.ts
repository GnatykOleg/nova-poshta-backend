import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

// All data is saved in the PascalCase format, as it was originally for NovaPoshta, in order to avoid unnecessary code

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Department {
  @Prop()
  CityRef: string;

  @Prop()
  CityName: string;

  @Prop()
  Page: string;

  @Prop()
  Departments: [];

  @Prop()
  TotalCountForCity: number;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
