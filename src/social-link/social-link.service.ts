import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateSocialLinkDto } from "./dto/create-social-link.dto";
import { UpdateSocialLinkDto } from "./dto/update-social-link.dto";
import { InjectModel } from "@nestjs/sequelize";
import { SocialLink } from "./models/social-link.model";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Injectable()
export class SocialLinkService {
  constructor(
    @InjectModel(SocialLink) private socialLinkModel: typeof SocialLink,
    private readonly fileAmazonService: FileAmazonService
  ) {}
  async create(
    createSocialLinkDto: CreateSocialLinkDto,
    image: Express.Multer.File
  ) {
    try {
      const fileName = await this.fileAmazonService.uploadFile(image);
      if (fileName) {
        return this.socialLinkModel.create({
          ...createSocialLinkDto,
          icon: fileName,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.socialLinkModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.socialLinkModel.findByPk(id);
  }

  update(id: number, updateSocialLinkDto: UpdateSocialLinkDto) {
    return this.socialLinkModel.update(updateSocialLinkDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.socialLinkModel.destroy({ where: { id } });
  }
}
