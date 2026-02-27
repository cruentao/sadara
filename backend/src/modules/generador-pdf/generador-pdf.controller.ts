import { Body, Controller, Post, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { GeneradorPdfService } from './generador-pdf.service';

// TODO: future improvement — extend access to admin_institucion so admins can
// generate PDFs for any student in their institution (e.g. for printing or archiving).

@ApiTags('generador-pdf')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
@Controller('generador-pdf')
export class GeneradorPdfController {
  constructor(private readonly generadorPdfService: GeneradorPdfService) {}

  @Post('generar')
  @ApiOperation({
    summary: 'Generar un PDF',
    description:
      'Genera un PDF de malla curricular o de horario de inscripciones del período activo. ' +
      'La respuesta es un archivo binario application/pdf.',
  })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 201, description: 'PDF generado exitosamente (archivo binario)' })
  @ApiResponse({ status: 404, description: 'Matrícula no encontrada o sin inscripciones activas' })
  async generate(
    @Body() dto: GeneratePdfDto,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.generadorPdfService.generate(dto, user.sub, user.institucion_id);
    const filename = dto.tipo === 'malla_curricular' ? 'malla-curricular.pdf' : 'horario-inscripciones.pdf';

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(buffer);
  }
}
