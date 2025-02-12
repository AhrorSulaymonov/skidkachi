import { Module } from "@nestjs/common";
import { RewiewsService } from "./rewiews.service";
import { RewiewsController } from "./rewiews.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Rewiew } from "./models/rewiew.model";
import { FileAmazonModule } from "../file-amazon/file-amazon.module";

@Module({
  imports: [SequelizeModule.forFeature([Rewiew]), FileAmazonModule],
  controllers: [RewiewsController],
  providers: [RewiewsService],
})
export class RewiewsModule {}
