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
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';
import { PrioridadService } from './prioridad.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('prioridades')
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.prioridadService.findAll(user.institucion_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.findOne(id, user.institucion_id);
  }

  @Post()
  create(@Body() dto: CreatePrioridadDto, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePrioridadDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.prioridadService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.remove(id, user.institucion_id);
  }
}
