import { Injectable } from "@nestjs/common";
import { CreateDiscountTypeDto } from "./dto/create-discount-type.dto";
import { UpdateDiscountTypeDto } from "./dto/update-discount-type.dto";
import { InjectModel } from "@nestjs/sequelize";
import { DiscountType } from "./models/discount-type.model";

@Injectable()
export class DiscountTypeService {
  constructor(
    @InjectModel(DiscountType) private discountTypeModel: typeof DiscountType
  ) {}
  create(createDiscountTypeDto: CreateDiscountTypeDto) {
    return this.discountTypeModel.create(createDiscountTypeDto);
  }

  findAll() {
    return this.discountTypeModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.discountTypeModel.findByPk(id);
  }
  update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
    return this.discountTypeModel.update(updateDiscountTypeDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.discountTypeModel.destroy({ where: { id } });
  }
}
