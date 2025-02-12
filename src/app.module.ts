import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { DistrictModule } from "./district/district.module";
import { RegionModule } from "./region/region.module";
import { District } from "./district/model/district.model";
import { Region } from "./region/model/region.model";
import { FileAmazonModule } from "./file-amazon/file-amazon.module";
import { FileModule } from "./file/file.module";
import { AdminsModule } from "./admins/admins.module";
import { Admin } from "./admins/models/admin.model";
import { SocialLinkModule } from "./social-link/social-link.module";
import { SocialLink } from "./social-link/models/social-link.model";
import { DiscountTypeModule } from "./discount-type/discount-type.module";
import { DiscountType } from "./discount-type/models/discount-type.model";
import { CategoryModule } from "./category/category.module";
import { Category } from "./category/models/category.model";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { StoreSocialLinkModule } from "./store-social-link/store-social-link.module";
import { StoreSocialLink } from "./store-social-link/models/store-social-link.model";
import { StoreModule } from "./store/store.module";
import { Store } from "./store/models/store.model";
import { StoreSubscribeModule } from "./store-subscribe/store-subscribe.module";
import { StoreSubscribe } from "./store-subscribe/models/store-subscribe.model";
import { Bot } from "./bot/models/bot.model";
import { DiscountModule } from "./discount/discount.module";
import { Discount } from "./discount/models/discount.model";
import { FavouriteModule } from "./favourite/favourite.module";
import { Favourite } from "./favourite/models/favourite.model";
import { PhotoModule } from "./photo/photo.module";
import { Photo } from "./photo/models/photo.model";
import { Address } from "./bot/models/address.model";
import { RewiewsModule } from "./rewiews/rewiews.module";
import { Rewiew } from "./rewiews/models/rewiew.model";
import { Car } from "./bot/models/cars.model";
import { OtpModule } from "./otp/otp.module";
import { Otp } from "./otp/models/otp.model";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN || "12345",
        middlewares: [],
        include: [BotModule],
      }),
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: `postgres`,
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        District,
        Region,
        Admin,
        SocialLink,
        DiscountType,
        Category,
        StoreSocialLink,
        Store,
        StoreSubscribe,
        Bot,
        Discount,
        Favourite,
        Photo,
        Address,
        Rewiew,
        Car,
        Otp,
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    DistrictModule,
    RegionModule,
    FileAmazonModule,
    FileModule,
    AdminsModule,
    SocialLinkModule,
    DiscountTypeModule,
    CategoryModule,
    BotModule,
    StoreSocialLinkModule,
    StoreModule,
    StoreSubscribeModule,
    DiscountModule,
    FavouriteModule,
    PhotoModule,
    RewiewsModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
