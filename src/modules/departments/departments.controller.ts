import { Controller, Get, Query } from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { DepartmentsQueryDTO } from './dto/departments.dto';

// Main path for departments
@Controller('api/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // Get deparments by queris, options in DepartmentsQueryDTO
  @Get('?')

  // Get departments status from departments service
  async getDepartmentsController(@Query() query: DepartmentsQueryDTO) {
    const departments = await this.departmentsService.getDepartmentsService(
      query,
    );

    return departments;
  }
}
