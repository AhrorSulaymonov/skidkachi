import { Injectable } from "@nestjs/common";
import { CreateStoreSubscribeDto } from "./dto/create-store-subscribe.dto";
import { UpdateStoreSubscribeDto } from "./dto/update-store-subscribe.dto";
import { InjectModel } from "@nestjs/sequelize";
import { StoreSubscribe } from "./models/store-subscribe.model";

@Injectable()
export class StoreSubscribeService {
  constructor(
    @InjectModel(StoreSubscribe)
    private storeSubscribemodel: typeof StoreSubscribe
  ) {}
  create(createStoreSubscribeDto: CreateStoreSubscribeDto) {
    return this.storeSubscribemodel.create(createStoreSubscribeDto);
  }

  findAll() {
    return this.storeSubscribemodel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.storeSubscribemodel.findByPk(id);
  }

  update(id: number, updateStoreSubscribeDto: UpdateStoreSubscribeDto) {
    return this.storeSubscribemodel.update(updateStoreSubscribeDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.storeSubscribemodel.destroy({ where: { id } });
  }
}
