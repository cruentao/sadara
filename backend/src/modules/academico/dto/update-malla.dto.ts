import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMallaDto {
  @ApiPropertyOptional({ example: 'v2' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  version?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  esta_activa?: boolean;
}
