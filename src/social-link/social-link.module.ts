import { Module } from "@nestjs/common";
import { SocialLinkService } from "./social-link.service";
import { SocialLinkController } from "./social-link.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { SocialLink } from "./models/social-link.model";
import { FileAmazonModule } from "../file-amazon/file-amazon.module";

@Module({
  imports: [SequelizeModule.forFeature([SocialLink]), FileAmazonModule],
  controllers: [SocialLinkController],
  providers: [SocialLinkService],
})
export class SocialLinkModule {}
