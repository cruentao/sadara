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
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { EstudiantesService } from './estudiantes.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.estudiantesService.findAll(user.institucion_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.estudiantesService.findOne(id, user.institucion_id);
  }

  @Post()
  create(@Body() dto: CreateEstudianteDto, @CurrentUser() user: JwtPayload) {
    return this.estudiantesService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEstudianteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.estudiantesService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.estudiantesService.remove(id, user.institucion_id);
  }
}
