import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { AsignaturaEntity } from './entities/asignatura.entity';

@ApiTags('academico / asignaturas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('academico/asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar asignaturas de la institución' })
  @ApiResponse({ status: 200, type: [AsignaturaEntity] })
  findAll(@CurrentUser() user: JwtPayload): Promise<AsignaturaEntity[]> {
    return this.asignaturasService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asignatura' })
  @ApiResponse({ status: 200, type: AsignaturaEntity })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<AsignaturaEntity> {
    return this.asignaturasService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una asignatura' })
  @ApiResponse({ status: 201, type: AsignaturaEntity })
  @ApiResponse({ status: 409, description: 'Código de asignatura ya existe' })
  create(@Body() dto: CreateAsignaturaDto, @CurrentUser() user: JwtPayload): Promise<AsignaturaEntity> {
    return this.asignaturasService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una asignatura' })
  @ApiResponse({ status: 200, type: AsignaturaEntity })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateAsignaturaDto, @CurrentUser() user: JwtPayload): Promise<AsignaturaEntity> {
    return this.asignaturasService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una asignatura' })
  @ApiResponse({ status: 204, description: 'Asignatura eliminada' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    await this.asignaturasService.remove(id, user.institucion_id);
  }
}
