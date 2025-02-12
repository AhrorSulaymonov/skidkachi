import { Module } from "@nestjs/common";
import { DiscountTypeService } from "./discount-type.service";
import { DiscountTypeController } from "./discount-type.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { DiscountType } from "./models/discount-type.model";

@Module({
  imports: [SequelizeModule.forFeature([DiscountType])],
  controllers: [DiscountTypeController],
  providers: [DiscountTypeService],
})
export class DiscountTypeModule {}
