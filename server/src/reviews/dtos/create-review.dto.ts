import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDTO {
  @IsString()
  @IsOptional()
  @MaxLength(250)
  comment: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}
