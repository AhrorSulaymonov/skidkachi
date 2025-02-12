import { Module } from "@nestjs/common";
import { RegionService } from "./region.service";
import { RegionController } from "./region.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Region } from "./model/region.model";
import { FileModule } from "../file/file.module";
import { FileAmazonModule } from "../file-amazon/file-amazon.module";

@Module({
  imports: [SequelizeModule.forFeature([Region]), FileModule, FileAmazonModule],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
