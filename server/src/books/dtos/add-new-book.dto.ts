import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddNewBookDTO {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  cover_image: string;

  @IsNumber()
  stock_quantity: number;
}
