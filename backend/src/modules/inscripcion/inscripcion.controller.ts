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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InscripcionService } from './inscripcion.service';

@ApiTags('inscripciones')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
@Controller('inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.inscripcionService.findAllForEstudiante(user.sub, user.institucion_id);
  }

  @Post()
  create(@Body() dto: CreateInscripcionDto, @CurrentUser() user: JwtPayload) {
    return this.inscripcionService.create(dto, user.sub, user.institucion_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInscripcionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscripcionService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.inscripcionService.cancel(id, user.sub);
  }
}
