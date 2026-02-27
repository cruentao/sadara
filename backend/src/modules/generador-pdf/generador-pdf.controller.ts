import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { GeneradorPdfService } from './generador-pdf.service';

@ApiTags('generador-pdf')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin_institucion', 'estudiante')
@Controller('generador-pdf')
export class GeneradorPdfController {
  constructor(private readonly generadorPdfService: GeneradorPdfService) {}

  @Post('generar')
  generate(@Body() dto: GeneratePdfDto, @CurrentUser() user: JwtPayload) {
    return this.generadorPdfService.generate(dto, user.sub, user.institucion_id);
  }
}
