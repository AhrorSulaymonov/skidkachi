import { IsNotEmpty, IsString } from "class-validator";

export class CreateDiscountTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
