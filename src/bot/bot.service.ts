import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { Car } from "./models/cars.model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Car) private readonly carModel: typeof Car,

    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from?.id;
    const user = await this.botModel.findByPk(user_id);

    if (!user) {
      await this.botModel.create({
        user_id,
        username: ctx.from?.username,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        lang: ctx.from?.language_code,
      });
      await ctx.reply(
        `Iltimos, <b>📞 Telefon raqamini yuborish</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamini yuborish")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos, <b>📞 Telefon raqamini yuborish</b> tugmasini bosing`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("📞 Telefon raqamini yuborish")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id!, "record_video");
      await ctx.reply(
        `Ushbu bot Skidkachi foydalanuvchilarini faollashtirish uchun`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.reply("Iltimos <b>Start</b> tugmasini bosing", {
          parse_mode: "HTML",
          ...Markup.keyboard(["/start"]).resize().oneTime(),
        });
      } else if (ctx.message?.contact.user_id != user_id) {
        await ctx.reply(
          `Iltimos, <b>📞  o'zingizning telefon raqamingizni yuborish</b> tugmasini bosing`,
          {
            parse_mode: "HTML",
            ...Markup.keyboard([
              [Markup.button.contactRequest("📞 Telefon raqamini yuborish")],
            ])
              .resize()
              .oneTime(),
          }
        );
      } else {
        let phone = ctx.message.contact.phone_number;
        if (phone[0] != "+") {
          phone = "+" + phone;
        }
        user.phone_number = phone;
        user.status = true;
        await user.save();
        await ctx.reply(`Tabriklayman, sizning hisobingiz faollashtirildi!`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (user && user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.reply(`Sizni yana kutib qolamiz`);
      }
    } catch (error) {
      console.log("OnStop error:", error);
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);

        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard(["/start"]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });

          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
            address.last_state = `finish`;
            await address.save();
            await ctx.reply("Manzil saqlandi", {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Mening manzillarim", "Yangi manzil qo'shish"],
              ]).resize(),
            });
          }
        }
      }
    } catch (error) {
      console.log("onLocation error:", error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);

        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard(["/start"]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });
          const car = await this.carModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });
          if (address && address.last_state !== "finish") {
            if (address.last_state == "name") {
              address.name = ctx.message.text;
              address.last_state = "address";
              await address.save();
              await ctx.reply("Manzilingizni kiriting", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (address.last_state == "address") {
              address.address = ctx.message.text;
              address.last_state = "location";
              await address.save();
              await ctx.reply(`Manzilingizni locatsiyasini yuboring`, {
                ...Markup.keyboard([
                  [Markup.button.locationRequest("📍 Locatsiyani yuboring")],
                ])
                  .resize()
                  .oneTime(),
              });
            }
          }
          if (car && car.last_state !== "finish") {
            if (car.last_state == "car_number") {
              car.car_number = ctx.message.text;
              car.last_state = "model";
              await car.save();
              await ctx.reply("Mashenagiz modelini kiriting", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "model") {
              car.model = ctx.message.text;
              car.last_state = "color";
              await car.save();
              await ctx.reply(`Mashenagiz rangini kiriting`);
            } else if (car.last_state == "color") {
              car.color = ctx.message.text;
              car.last_state = "year";
              await car.save();
              await ctx.reply(`Mashenagiz yilini kiriting`);
            } else if (car.last_state == "year") {
              car.year = +ctx.message.text;
              car.last_state = "finish";
              await car.save();
              await ctx.reply("Mashena saqlandi", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["Mening mashinalarim", "Yangi mashina qo'shish"],
                ]).resize(),
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("OnStop error:", error);
    }
  }

  async deleteUnCoutchedMessage(ctx: Context) {
    try {
      const message_id = ctx.message!.message_id;
      console.log(message_id);
      await ctx.deleteMessage(message_id);
      await ctx.editMessageText("Address o'chirildi");
    } catch (error) {
      console.log("deleteUnCoutchedMessage err", error);
    }
  }

  async admin_menu(ctx: Context, menu_text = `<b>Admin menyusi</b>`) {
    try {
      await ctx.reply(menu_text, {
        parse_mode: "HTML",
        ...Markup.keyboard([["Mijozlar", "Ustalar"]])
          .oneTime()
          .resize(),
      });
    } catch (error) {
      console.log("Admin menyusida xatolik", error);
    }
  }

  async sendOtp(
    phone_number: string,
    OTP: string
  ): Promise<boolean | undefined> {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });

      if (!user || !user.status) {
        return false;
      }

      await this.bot.telegram.sendMessage(
        user.user_id!,
        `Verification OTP code:${OTP}`
      );

      return true;
    } catch (error) {
      console.log("sendOtp err", error);
    }
  }
}

// async start(ctx: Context) {
//   const _id = ctx.from?.id;
//   const master = await this.userModel.findByPk(_id);
//   if (!master) {
//     await this.userModel.create({
//       _id,
//       name: ctx.from?.name,
//       first_name: ctx.from?.first_name,
//       last_name: ctx.from?.last_name,
//       lang: ctx.from?.language_code,
//     });
//     await ctx.reply(
//       `Iltimos, <b>😶‍🌫️ Botdan ro'yxatdan o'tish</b> tugmasini bosing`,
//       {
//         parse_mode: "HTML",
//         ...Markup.keyboard(["😶‍🌫️ Botdan ro'yxatdan o'tish"])
//           .resize()
//           .oneTime(),
//       }
//     );
//   } else if (!.status || master?.status) {
//     await ctx.reply(
//       `Iltimos, <b>😶‍🌫️ Botdan ro'yxatdan o'tish</b> tugmasini bosing`,
//       {
//         parse_mode: "HTML",
//         ...Markup.keyboard(["😶‍🌫️ Botdan ro'yxatdan o'tish"])
//           .resize()
//           .oneTime(),
//       }
//     );
//   } else {
//     await this.bot.telegram.sendChatAction(_id!, "record_video");
//     await ctx.reply(`Ushbu bot maishiy xizmatlar uchun`, {
//       parse_mode: "HTML",
//       ...Markup.removeKeyboard(),
//     });
//   }
// }
