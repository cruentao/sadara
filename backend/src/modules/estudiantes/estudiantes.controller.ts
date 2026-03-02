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
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EnrollCarreraDto } from './dto/enroll-carrera.dto';
import { UpdateEstudianteCarreraDto } from './dto/update-estudiante-carrera.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { EstudianteEntity } from './entities/estudiante.entity';
import { EstudiantesService } from './estudiantes.service';

@ApiTags('estudiantes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar estudiantes de la institución' })
  @ApiResponse({ status: 200, type: [EstudianteEntity] })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.estudiantesService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estudiante con sus matrículas' })
  @ApiResponse({ status: 200, type: EstudianteEntity })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.estudiantesService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un estudiante',
    description: 'Crea atómicamente una CuentaUsuario (rol estudiante) y el perfil Estudiante.',
  })
  @ApiResponse({ status: 201, type: EstudianteEntity })
  @ApiResponse({ status: 409, description: 'Email o código de estudiante ya están en uso' })
  create(@Body() dto: CreateEstudianteDto, @CurrentUser() user: JwtPayload) {
    return this.estudiantesService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos del estudiante' })
  @ApiResponse({ status: 200, type: EstudianteEntity })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEstudianteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.estudiantesService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Desactivar un estudiante',
    description: 'Soft-delete: desactiva el estudiante y su cuenta de usuario. No elimina datos históricos.',
  })
  @ApiResponse({ status: 204, description: 'Estudiante desactivado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    await this.estudiantesService.remove(id, user.institucion_id);
  }

  // --- EstudianteCarrera ---

  @Post(':id/carreras')
  @ApiOperation({ summary: 'Matricular estudiante en una carrera' })
  @ApiResponse({ status: 201, description: 'Matrícula creada' })
  @ApiResponse({ status: 404, description: 'Carrera o malla no encontrada' })
  @ApiResponse({ status: 409, description: 'Estudiante ya matriculado en esa carrera' })
  enrollCarrera(
    @Param('id') id: string,
    @Body() dto: EnrollCarreraDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.estudiantesService.enrollCarrera(id, dto, user.institucion_id);
  }

  @Patch(':id/carreras/:carreraId')
  @ApiOperation({ summary: 'Actualizar estado de la matrícula' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Matrícula no encontrada' })
  updateCarreraEstado(
    @Param('id') id: string,
    @Param('carreraId') carreraId: string,
    @Body() dto: UpdateEstudianteCarreraDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.estudiantesService.updateCarreraEstado(id, carreraId, dto, user.institucion_id);
  }

  @Delete(':id/carreras/:carreraId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar matrícula de una carrera' })
  @ApiResponse({ status: 204, description: 'Matrícula eliminada' })
  @ApiResponse({ status: 404, description: 'Matrícula no encontrada' })
  async removeCarrera(
    @Param('id') id: string,
    @Param('carreraId') carreraId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.estudiantesService.removeCarrera(id, carreraId, user.institucion_id);
  }
}
