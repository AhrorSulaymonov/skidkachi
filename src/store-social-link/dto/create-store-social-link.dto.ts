import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateStoreSocialLinkDto {
  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber()
  @ApiProperty()
  socialLinkId: number;
}
