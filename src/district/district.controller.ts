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
import { DistrictService } from "./district.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("district")
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

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
    @Body() createDistrictDto: CreateDistrictDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.districtService.create(createDistrictDto, image);
  }

  @Get()
  findAll() {
    return this.districtService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.districtService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDistrictDto: UpdateDistrictDto
  ) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.districtService.remove(+id);
  }
}
