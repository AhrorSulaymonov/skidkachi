import { Injectable } from "@nestjs/common";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Discount } from "./models/discount.model";

@Injectable()
export class DiscountService {
  constructor(@InjectModel(Discount) private discountModel: typeof Discount) {}

  create(createDiscountDto: CreateDiscountDto) {
    return this.discountModel.create(createDiscountDto);
  }

  findAll() {
    return this.discountModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.discountModel.findByPk(id);
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return this.discountModel.update(updateDiscountDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.discountModel.destroy({ where: { id } });
  }
}
