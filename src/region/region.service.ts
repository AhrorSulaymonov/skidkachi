import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Region } from "./model/region.model";
import { FileService } from "../file/file.service";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region) private regionmodel: typeof Region,
    private readonly fileService: FileService,
    private readonly fileAmazonService: FileAmazonService
  ) {}

  async create(createRegionDto: CreateRegionDto, image: Express.Multer.File) {
    try {
      const fileName = await this.fileAmazonService.uploadFile(image);
      if (fileName) {
        return this.regionmodel.create({
          ...createRegionDto,
          image: fileName,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "File yuklashda xatolik ro'y berdi"
      );
    }
    // const fileName = await this.fileService.saveFile(image);
  }

  findAll() {
    return this.regionmodel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const findRegion = await this.regionmodel.findByPk(id);
    return findRegion;
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.regionmodel.update(updateRegionDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.regionmodel.destroy({ where: { id } });
  }
}
