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
import { AcademicoService } from './academico.service';
import { CreateAcademicoDto } from './dto/create-academico.dto';
import { UpdateAcademicoDto } from './dto/update-academico.dto';

@ApiTags('academico')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion')
@Controller('academico')
export class AcademicoController {
  constructor(private readonly academicoService: AcademicoService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    // institucion_id always comes from the JWT, never from the request body
    return this.academicoService.findAll(user.institucion_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicoService.findOne(id, user.institucion_id);
  }

  @Post()
  create(@Body() dto: CreateAcademicoDto, @CurrentUser() user: JwtPayload) {
    return this.academicoService.create(dto, user.institucion_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAcademicoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.academicoService.update(id, dto, user.institucion_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.academicoService.remove(id, user.institucion_id);
  }
}
