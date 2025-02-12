import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class SignInDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;
}
