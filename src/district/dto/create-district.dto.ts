import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDistrictDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  image: string;

  @Transform(({ value }) => Number(value)) // Stringni Numberga aylantiramiz
  @IsNumber()
  @ApiProperty()
  regionId: number;
}
