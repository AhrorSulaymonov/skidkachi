import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
} from "@nestjs/common";
import { RewiewsService } from "./rewiews.service";
import { CreateRewiewDto } from "./dto/create-rewiew.dto";
import { UpdateRewiewDto } from "./dto/update-rewiew.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("rewiews")
export class RewiewsController {
  constructor(private readonly rewiewsService: RewiewsService) {}

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
    @Body() createRewiewDto: CreateRewiewDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.rewiewsService.create(createRewiewDto, image);
  }

  @Get()
  findAll() {
    return this.rewiewsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rewiewsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRewiewDto: UpdateRewiewDto) {
    return this.rewiewsService.update(+id, updateRewiewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rewiewsService.remove(+id);
  }
}
