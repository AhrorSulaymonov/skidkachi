import { Injectable } from "@nestjs/common";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Store } from "./models/store.model";

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store)
    private storeModel: typeof Store
  ) {}
  create(createStoreDto: CreateStoreDto) {
    return this.storeModel.create(createStoreDto);
  }

  findAll() {
    return this.storeModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.storeModel.findByPk(id);
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return this.storeModel.update(updateStoreDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.storeModel.destroy({ where: { id } });
  }
}
