import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateSocialLinkDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  icon: string;
}
