import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Car } from "./models/cars.model";

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Car) private readonly carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onCar(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi mashinalari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["Mening mashinalarim", "Yangi mashina qo'shish"],
        ]).resize(),
      });
    } catch (error) {
      console.log("OnCar error:", error);
    }
  }

  async onCommandNewCar(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard(["/start"]).resize(),
        });
      } else {
        await this.carModel.create({ user_id, last_state: "car_number" });
      }
      await ctx.reply(
        `Yangi mashinangizni raqamini kiriting (masalan, <i>70 |145| AA</i>):`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    } catch (error) {
      console.log("onCommandNewCar error:", error);
    }
  }

  async onCommandMyCars(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz ro'yxatdan o'tmagansiz`, {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["/start"], //inline
          ]).resize(),
        });
      } else {
        const cars = await this.carModel.findAll({
          where: { user_id, last_state: "finish" },
        });
        cars.forEach(async (car) => {
          await ctx.replyWithHTML(
            `<b> Mashena raqami:</b> ${car.car_number}` +
              ` <b> Mashena modeli:</b> ${car.model} ` +
              ` <b> Mashena rangi:</b> ${car.color} ` +
              ` <b> Mashena yili:</b> ${car.year} `
          );
        });
      }
    } catch (error) {
      console.log("onCommandMyCars err", error);
    }
  }
}
