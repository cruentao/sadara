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
import { CreateMotorReglasDto } from './dto/create-motor-reglas.dto';
import { UpdateMotorReglasDto } from './dto/update-motor-reglas.dto';
import { ReglaInstitucionEntity } from './entities/motor-reglas.entity';
import { MotorReglasService } from './motor-reglas.service';

@ApiTags('motor-reglas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('motor-reglas')
export class MotorReglasController {
  constructor(private readonly motorReglasService: MotorReglasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reglas de negocio de la institución' })
  @ApiResponse({ status: 200, type: [ReglaInstitucionEntity] })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.motorReglasService.findAll(user.institucion_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una regla por ID' })
  @ApiResponse({ status: 200, type: ReglaInstitucionEntity })
  @ApiResponse({ status: 404, description: 'Regla no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.findOne(id, user.institucion_id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva regla de negocio' })
  @ApiResponse({ status: 201, type: ReglaInstitucionEntity })
  create(@Body() dto: CreateMotorReglasDto, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una regla',
    description: 'Permite modificar la configuración, prioridad o estado habilitado de una regla.',
  })
  @ApiResponse({ status: 200, type: ReglaInstitucionEntity })
  @ApiResponse({ status: 404, description: 'Regla no encontrada' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMotorReglasDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.motorReglasService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una regla de negocio' })
  @ApiResponse({ status: 200, type: ReglaInstitucionEntity, description: 'Regla eliminada' })
  @ApiResponse({ status: 404, description: 'Regla no encontrada' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.remove(id, user.institucion_id);
  }
}
