import { Injectable } from "@nestjs/common";
import { CreateStoreSocialLinkDto } from "./dto/create-store-social-link.dto";
import { UpdateStoreSocialLinkDto } from "./dto/update-store-social-link.dto";
import { InjectModel } from "@nestjs/sequelize";
import { StoreSocialLink } from "./models/store-social-link.model";

@Injectable()
export class StoreSocialLinkService {
  constructor(
    @InjectModel(StoreSocialLink)
    private storeSocialLinkModel: typeof StoreSocialLink
  ) {}
  create(createStoreSocialLinkDto: CreateStoreSocialLinkDto) {
    return this.storeSocialLinkModel.create(createStoreSocialLinkDto);
  }

  findAll() {
    return this.storeSocialLinkModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.storeSocialLinkModel.findByPk(id);
  }

  update(id: number, updateStoreSocialLinkDto: UpdateStoreSocialLinkDto) {
    return this.storeSocialLinkModel.update(updateStoreSocialLinkDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.storeSocialLinkModel.destroy({ where: { id } });
  }
}
