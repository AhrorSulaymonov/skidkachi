import { Module } from "@nestjs/common";
import { StoreSubscribeService } from "./store-subscribe.service";
import { StoreSubscribeController } from "./store-subscribe.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { StoreSubscribe } from "./models/store-subscribe.model";

@Module({
  imports: [SequelizeModule.forFeature([StoreSubscribe])],
  controllers: [StoreSubscribeController],
  providers: [StoreSubscribeService],
})
export class StoreSubscribeModule {}
