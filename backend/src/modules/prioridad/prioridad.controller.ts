import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';
import { PrioridadInscripcionEntity } from './entities/prioridad.entity';
import { PrioridadService } from './prioridad.service';

@ApiTags('prioridades')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('prioridades')
export class PrioridadController {
  constructor(private readonly prioridadService: PrioridadService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las prioridades de inscripción de la institución' })
  @ApiResponse({ status: 200, type: [PrioridadInscripcionEntity] })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.prioridadService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una prioridad por ID' })
  @ApiResponse({ status: 200, type: PrioridadInscripcionEntity })
  @ApiResponse({ status: 404, description: 'Prioridad no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Asignar prioridad de inscripción a un estudiante en un período' })
  @ApiResponse({ status: 201, type: PrioridadInscripcionEntity })
  @ApiResponse({ status: 404, description: 'Período o matrícula de carrera no encontrados' })
  @ApiResponse({ status: 409, description: 'Ya existe una prioridad para este estudiante en este período' })
  create(@Body() dto: CreatePrioridadDto, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar puntaje o ventana de inscripción de una prioridad' })
  @ApiResponse({ status: 200, type: PrioridadInscripcionEntity })
  @ApiResponse({ status: 404, description: 'Prioridad no encontrada' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePrioridadDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.prioridadService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una prioridad de inscripción' })
  @ApiResponse({ status: 200, type: PrioridadInscripcionEntity, description: 'Prioridad eliminada' })
  @ApiResponse({ status: 404, description: 'Prioridad no encontrada' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.prioridadService.remove(id, user.institucion_id);
  }
}
