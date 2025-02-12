import { Module } from "@nestjs/common";
import { DistrictService } from "./district.service";
import { DistrictController } from "./district.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { District } from "./model/district.model";
import { FileAmazonModule } from "../file-amazon/file-amazon.module";

@Module({
  imports: [SequelizeModule.forFeature([District]), FileAmazonModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
