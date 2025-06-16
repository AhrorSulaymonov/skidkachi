import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Address } from "./models/address.model";
import { AddressService } from "./address.service";
import { AddressUpdate } from "./address.update";
import { Car } from "./models/cars.model";
import { CarService } from "./car.service";
import { CarUpdate } from "./car.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Address, Car])],
  providers: [
    CarService,
    CarUpdate,
    AddressService,
    AddressUpdate,
    BotService,
    BotUpdate,
  ],
  exports: [BotService],
})
export class BotModule {}
