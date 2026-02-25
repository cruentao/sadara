import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateAcademicoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  creditos?: number;
}
