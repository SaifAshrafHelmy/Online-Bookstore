import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FilterQueryDTO {
  // Pagination

  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;

  // Filters

  @IsOptional()
  category: string;

  @IsOptional()
  author: string;

  @IsOptional()
  published_year: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceGTE: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceLTE: number;
}
