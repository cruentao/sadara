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
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { InstitucionEntity } from './entities/institucion.entity';
import { InstitucionService } from './institucion.service';

@ApiTags('instituciones')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
@Controller('instituciones')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las instituciones' })
  @ApiResponse({ status: 200, type: [InstitucionEntity] })
  findAll(): Promise<InstitucionEntity[]> {
    return this.institucionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una institución por ID' })
  @ApiResponse({ status: 200, type: InstitucionEntity })
  @ApiResponse({ status: 404, description: 'Institución no encontrada' })
  findOne(@Param('id') id: string): Promise<InstitucionEntity> {
    return this.institucionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una institución' })
  @ApiResponse({ status: 201, type: InstitucionEntity })
  @ApiResponse({ status: 409, description: 'El slug ya está en uso' })
  create(@Body() dto: CreateInstitucionDto): Promise<InstitucionEntity> {
    return this.institucionService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una institución' })
  @ApiResponse({ status: 200, type: InstitucionEntity })
  @ApiResponse({ status: 404, description: 'Institución no encontrada' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInstitucionDto,
  ): Promise<InstitucionEntity> {
    return this.institucionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una institución' })
  @ApiResponse({ status: 204, description: 'Institución eliminada' })
  @ApiResponse({ status: 404, description: 'Institución no encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.institucionService.remove(id);
  }
}
