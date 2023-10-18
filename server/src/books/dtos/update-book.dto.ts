import { AddNewBookDTO } from './add-new-book.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBookDTO extends PartialType(AddNewBookDTO) {}
