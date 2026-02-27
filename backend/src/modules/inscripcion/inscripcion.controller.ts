import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { InscripcionEntity } from './entities/inscripcion.entity';
import { InscripcionService } from './inscripcion.service';

@ApiTags('inscripciones')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
@Controller('inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las inscripciones del estudiante autenticado' })
  @ApiResponse({ status: 200, type: [InscripcionEntity] })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.inscripcionService.findAll(user.sub, user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una inscripción por ID' })
  @ApiResponse({ status: 200, type: InscripcionEntity })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.inscripcionService.findOne(id, user.sub, user.institucion_id);
  }

  @Post()
  @ApiOperation({
    summary: 'Inscribirse en una sección',
    description:
      'Valida período activo, ventana de inscripción y cupos disponibles antes de crear la inscripción.',
  })
  @ApiResponse({ status: 201, type: InscripcionEntity })
  @ApiResponse({ status: 404, description: 'Sección o matrícula de carrera no encontrada' })
  @ApiResponse({ status: 409, description: 'Sin cupos, ventana cerrada o ya inscrito' })
  create(@Body() dto: CreateInscripcionDto, @CurrentUser() user: JwtPayload) {
    return this.inscripcionService.create(dto, user.sub, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retirarse de una sección',
    description: 'Soft-withdraw: cambia el estado de la inscripción a "retirado". Solo disponible durante la ventana de inscripción.',
  })
  @ApiResponse({ status: 200, type: InscripcionEntity, description: 'Inscripción retirada' })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya retirado o ventana cerrada' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.inscripcionService.remove(id, user.sub, user.institucion_id);
  }
}
