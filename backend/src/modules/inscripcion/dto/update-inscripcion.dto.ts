import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateInscripcionDto {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmada', 'cancelada'])
  estado?: string;
}
