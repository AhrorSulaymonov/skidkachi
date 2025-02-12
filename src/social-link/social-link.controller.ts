import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from "@nestjs/common";
import { SocialLinkService } from "./social-link.service";
import { CreateSocialLinkDto } from "./dto/create-social-link.dto";
import { UpdateSocialLinkDto } from "./dto/update-social-link.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("social-link")
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException("Faqat image filelar yuklash mumkin!"),
            false
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // Maksimal fayl hajmi: 2MB
      },
    })
  )
  create(
    @Body() createSocialLinkDto: CreateSocialLinkDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.socialLinkService.create(createSocialLinkDto, image);
  }

  @Get()
  findAll() {
    return this.socialLinkService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.socialLinkService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto
  ) {
    return this.socialLinkService.update(+id, updateSocialLinkDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.socialLinkService.remove(+id);
  }
}
