import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { CarreraEntity } from './entities/carrera.entity';

@ApiTags('academico / carreras')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('academico/carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar carreras de la institución' })
  @ApiResponse({ status: 200, type: [CarreraEntity] })
  findAll(@CurrentUser() user: JwtPayload): Promise<CarreraEntity[]> {
    return this.carrerasService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una carrera' })
  @ApiResponse({ status: 200, type: CarreraEntity })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<CarreraEntity> {
    return this.carrerasService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una carrera' })
  @ApiResponse({ status: 201, type: CarreraEntity })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 409, description: 'Código de carrera ya existe en esa facultad' })
  create(@Body() dto: CreateCarreraDto, @CurrentUser() user: JwtPayload): Promise<CarreraEntity> {
    return this.carrerasService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una carrera' })
  @ApiResponse({ status: 200, type: CarreraEntity })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateCarreraDto, @CurrentUser() user: JwtPayload): Promise<CarreraEntity> {
    return this.carrerasService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una carrera' })
  @ApiResponse({ status: 204, description: 'Carrera eliminada' })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    await this.carrerasService.remove(id, user.institucion_id);
  }
}
