import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateMotorReglasDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  valor?: number;
}
