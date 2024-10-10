import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description: string;
}

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
