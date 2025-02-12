import { Injectable } from "@nestjs/common";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import { UpdateFavouriteDto } from "./dto/update-favourite.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Favourite } from "./models/favourite.model";

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite) private favouriteModel: typeof Favourite
  ) {}
  create(createFavouriteDto: CreateFavouriteDto) {
    return this.favouriteModel.create(createFavouriteDto);
  }

  findAll() {
    return this.favouriteModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.favouriteModel.findByPk(id);
  }

  update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    return this.favouriteModel.update(updateFavouriteDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.favouriteModel.destroy({ where: { id } });
  }
}
