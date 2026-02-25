import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdatePrioridadDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  puntaje?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  motivo?: string;
}
