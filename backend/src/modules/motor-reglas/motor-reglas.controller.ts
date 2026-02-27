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
import { CreateMotorReglasDto } from './dto/create-motor-reglas.dto';
import { UpdateMotorReglasDto } from './dto/update-motor-reglas.dto';
import { MotorReglasService } from './motor-reglas.service';

@ApiTags('motor-reglas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('motor-reglas')
export class MotorReglasController {
  constructor(private readonly motorReglasService: MotorReglasService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.motorReglasService.findAll(user.institucion_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.findOne(id, user.institucion_id);
  }

  @Post()
  create(@Body() dto: CreateMotorReglasDto, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMotorReglasDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.motorReglasService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.motorReglasService.remove(id, user.institucion_id);
  }
}
