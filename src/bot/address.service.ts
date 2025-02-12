import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { where } from "sequelize";

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onAddress1(ctx: Context) {
    try {
    } catch (error) {}
  }

  async onClickLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const contextMessage = ctx.callbackQuery!["message"];
      console.log(contextMessage);

      const address_id = contextAction.split("_")[1];
      const address = await this.addressModel.findByPk(address_id);
      await ctx.deleteMessage(contextMessage?.message_id);
      await ctx.deleteMessage(contextMessage?.message_id! - 1);
      // await ctx.deleteMessage(contextMessage?.message_id! - 2);
      // await ctx.deleteMessage(contextMessage?.message_id! - 3);
      //tekshir lokatsiyani
      await ctx.replyWithLocation(
        Number(address?.location?.split(",")[0]),
        Number(address?.location?.split(",")[1])
      );
    } catch (error) {
      console.log("onAddress err", error);
    }
  }

  async onClickDelete(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];
      const address = await this.addressModel.destroy({
        where: { id: address_id },
      });
      //tekshir lokatsiyani
      await ctx.editMessageText("Address o'chirildi");
    } catch (error) {
      console.log("onAddress err", error);
    }
  }

  async onAddress(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi manzillari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["Mening manzillarim", "Yangi manzil qo'shish"],
        ]).resize(),
      });
    } catch (error) {
      console.log("OnStop error:", error);
    }
  }

  async onCommandNewAddress(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: "HTML",
          ...Markup.keyboard(["/start"]).resize(),
        });
      } else {
        await this.addressModel.create({ user_id, last_state: "name" });
      }
      await ctx.reply(
        `Yangi manzilingiz nomini kiriting (masalan, <i>uyim</i>):`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    } catch (error) {
      console.log("onCommandNewAddress error:", error);
    }
  }

  async OnCommandMyAddresses(ctx: Context) {
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
        const addresses = await this.addressModel.findAll({
          where: { user_id, last_state: "finish" },
        });
        addresses.forEach(async (address) => {
          await ctx.replyWithHTML(
            `<b> Manzil nomi:</b> ${address.name}` +
              ` <b> Manzil:</b> ${address.address} `,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Lokatsiyani ko'rish",
                      callback_data: `loc_${address.id}`,
                    },
                    {
                      text: "Manzilni o'chirish",
                      callback_data: `del_${address.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("onCommandMyAddresses err", error);
    }
  }
}
