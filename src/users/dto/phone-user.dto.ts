import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class PhoneUserDto {
  @IsPhoneNumber("UZ")
  phone: string;
}
