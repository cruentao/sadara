import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { InstitucionService } from './institucion.service';

// All routes require super_admin role — instituciones are platform-level resources
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
@Controller('instituciones')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Get()
  findAll() {
    return this.institucionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institucionService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInstitucionDto) {
    return this.institucionService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInstitucionDto) {
    return this.institucionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.institucionService.remove(id);
  }
}
