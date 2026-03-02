import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AddAsignaturaMallaDto } from './dto/add-asignatura-malla.dto';
import { AddPrerrequisoDto } from './dto/add-prerrequisito.dto';
import { CreateMallaDto } from './dto/create-malla.dto';
import { UpdateMallaDto } from './dto/update-malla.dto';
import { MallaEntity } from './entities/malla.entity';
import { MallasService } from './mallas.service';

@ApiTags('academico / mallas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('academico/mallas')
export class MallasController {
  constructor(private readonly mallasService: MallasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mallas de una carrera' })
  @ApiQuery({ name: 'carreraId', required: true, description: 'ID de la carrera' })
  @ApiResponse({ status: 200, type: [MallaEntity] })
  findAll(@Query('carreraId') carreraId: string, @CurrentUser() user: JwtPayload) {
    return this.mallasService.findAllByCarrera(carreraId, user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una malla con todas sus asignaturas y prerrequisitos' })
  @ApiResponse({ status: 200, description: 'Malla con asignaturas y prerrequisitos' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.mallasService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una malla curricular' })
  @ApiResponse({ status: 201, type: MallaEntity })
  @ApiResponse({ status: 404, description: 'Carrera no encontrada' })
  @ApiResponse({ status: 409, description: 'Malla con ese año y versión ya existe' })
  create(@Body() dto: CreateMallaDto, @CurrentUser() user: JwtPayload): Promise<MallaEntity> {
    return this.mallasService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una malla curricular' })
  @ApiResponse({ status: 200, type: MallaEntity })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateMallaDto, @CurrentUser() user: JwtPayload): Promise<MallaEntity> {
    return this.mallasService.update(id, dto, user.institucion_id);
  }

  // --- MallaAsignatura ---

  @Post(':id/asignaturas')
  @ApiOperation({ summary: 'Agregar una asignatura a la malla' })
  @ApiResponse({ status: 201, description: 'Asignatura agregada a la malla' })
  @ApiResponse({ status: 409, description: 'La asignatura ya está en la malla' })
  addAsignatura(@Param('id') id: string, @Body() dto: AddAsignaturaMallaDto, @CurrentUser() user: JwtPayload) {
    return this.mallasService.addAsignatura(id, dto, user.institucion_id);
  }

  @Delete(':mallaId/asignaturas/:asignaturaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitar una asignatura de la malla' })
  @ApiResponse({ status: 204, description: 'Asignatura quitada de la malla' })
  async removeAsignatura(
    @Param('mallaId') mallaId: string,
    @Param('asignaturaId') asignaturaId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.mallasService.removeAsignatura(mallaId, asignaturaId, user.institucion_id);
  }

  // --- Prerrequisitos ---

  @Post('prerrequisitos')
  @ApiOperation({ summary: 'Agregar un prerrequisito a una asignatura de la malla' })
  @ApiResponse({ status: 201, description: 'Prerrequisito agregado' })
  addPrerrequisito(@Body() dto: AddPrerrequisoDto, @CurrentUser() user: JwtPayload) {
    return this.mallasService.addPrerrequisito(dto, user.institucion_id);
  }

  @Delete('prerrequisitos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un prerrequisito' })
  @ApiResponse({ status: 204, description: 'Prerrequisito eliminado' })
  async removePrerrequisito(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    await this.mallasService.removePrerrequisito(id, user.institucion_id);
  }
}
