import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

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
    @Body() createRegionDto: CreateRegionDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.regionService.create(createRegionDto, image);
  }

  @Get()
  findAll() {
    return this.regionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.regionService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.regionService.remove(+id);
  }
}
