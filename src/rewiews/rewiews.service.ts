import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateRewiewDto } from "./dto/create-rewiew.dto";
import { UpdateRewiewDto } from "./dto/update-rewiew.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Rewiew } from "./models/rewiew.model";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Injectable()
export class RewiewsService {
  constructor(
    @InjectModel(Rewiew) private rewiewmodel: typeof Rewiew,
    private readonly fileAmazonService: FileAmazonService
  ) {}
  async create(createRewiewDto: CreateRewiewDto, image: Express.Multer.File) {
    try {
      const fileName = await this.fileAmazonService.uploadFile(image);
      if (fileName) {
        return this.rewiewmodel.create({
          ...createRewiewDto,
          photo: fileName,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "File yuklashda xatolik ro'y berdi"
      );
    }
  }

  findAll() {
    return this.rewiewmodel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const findRegion = await this.rewiewmodel.findByPk(id);
    return findRegion;
  }

  update(id: number, updateRewiewDto: UpdateRewiewDto) {
    return this.rewiewmodel.update(updateRewiewDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.rewiewmodel.destroy({ where: { id } });
  }
}
