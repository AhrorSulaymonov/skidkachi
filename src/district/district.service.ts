import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { InjectModel } from "@nestjs/sequelize";
import { District } from "./model/district.model";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District) private districtModel: typeof District,
    private readonly fileAmazonService: FileAmazonService
  ) {}

  async create(
    createDistrictDto: CreateDistrictDto,
    image: Express.Multer.File
  ) {
    try {
      const fileName = await this.fileAmazonService.uploadFile(image);
      if (fileName) {
        return this.districtModel.create({
          ...createDistrictDto,
          image: fileName,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        "File yuklashda xatolik ro'y berdi"
      );
    }
  }

  findAll() {
    return this.districtModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.districtModel.findByPk(id);
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return this.districtModel.update(updateDistrictDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.districtModel.destroy({ where: { id } });
  }
}
