import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';
import { FacultadEntity } from './entities/facultad.entity';
import { FacultadesService } from './facultades.service';

@ApiTags('academico / facultades')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('academico/facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar facultades de la institución' })
  @ApiResponse({ status: 200, type: [FacultadEntity] })
  findAll(@CurrentUser() user: JwtPayload): Promise<FacultadEntity[]> {
    return this.facultadesService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una facultad' })
  @ApiResponse({ status: 200, type: FacultadEntity })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<FacultadEntity> {
    return this.facultadesService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una facultad' })
  @ApiResponse({ status: 201, type: FacultadEntity })
  @ApiResponse({ status: 409, description: 'Nombre de facultad ya existe' })
  create(@Body() dto: CreateFacultadDto, @CurrentUser() user: JwtPayload): Promise<FacultadEntity> {
    return this.facultadesService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una facultad' })
  @ApiResponse({ status: 200, type: FacultadEntity })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateFacultadDto, @CurrentUser() user: JwtPayload): Promise<FacultadEntity> {
    return this.facultadesService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una facultad' })
  @ApiResponse({ status: 204, description: 'Facultad eliminada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    await this.facultadesService.remove(id, user.institucion_id);
  }
}
