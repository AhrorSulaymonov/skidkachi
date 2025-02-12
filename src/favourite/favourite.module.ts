import { Module } from "@nestjs/common";
import { FavouriteService } from "./favourite.service";
import { FavouriteController } from "./favourite.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Favourite } from "./models/favourite.model";

@Module({
  imports: [SequelizeModule.forFeature([Favourite])],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
