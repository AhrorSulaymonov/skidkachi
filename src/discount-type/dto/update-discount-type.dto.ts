import { PartialType } from '@nestjs/swagger';
import { CreateDiscountTypeDto } from './create-discount-type.dto';

export class UpdateDiscountTypeDto extends PartialType(CreateDiscountTypeDto) {}
