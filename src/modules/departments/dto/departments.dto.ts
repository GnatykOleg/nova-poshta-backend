import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class DepartmentsQueryDTO {
  @Expose()
  @IsString()
  @IsDefined()
  city: string;
  page: string;
}
