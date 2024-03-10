import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddNewBookDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsDefined()
  price: number;

  @IsString()
  @IsOptional()
  cover_image: string;

  @IsNumber()
  @IsDefined()
  @Min(1)
  stock_quantity: number;
}
