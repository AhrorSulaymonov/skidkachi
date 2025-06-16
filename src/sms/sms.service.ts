import * as fs from "fs";
import * as path from "path";
import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SmsService {
  private envFilePath = path.resolve(__dirname, "../../.env");

  async sendSMS(phone_number: string, otp: string) {
    await this.checkAndRefreshToken();

    const data = new FormData();
    data.append("mobile_phone", phone_number);
    data.append("message", otp);
    data.append("form", "4546");

    const config = {
      method: "post",
      url: process.env.SMS_SERVICE_URL,
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("SMS yuborishda xatolik:", error.message);
      return { status: 500 };
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));

      if (!decodedPayload.exp) {
        console.error("Token ichida 'exp' muddati yo‘q.");
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp < currentTime;
    } catch (error) {
      console.error("Tokenni tekshirishda xatolik:", error.message);
      return true;
    }
  }

  async refreshToken() {
    try {
      const response = await axios.post(
        "https://notify.eskiz.uz/api/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.SMS_TOKEN}`,
          },
        }
      );

      if (response.data && response.data.data.token) {
        const newToken = response.data.data.token;
        this.updateEnvFile("SMS_TOKEN", newToken); // .env faylni yangilash
        process.env.SMS_TOKEN = newToken; // Yangi tokenni process.env ichida ham yangilash
        console.log("Token muvaffaqiyatli yangilandi.");
        return response.data;
      }

      throw new Error("Tokenni yangilashda muammo yuz berdi.");
    } catch (error) {
      console.error("Eskiz tokenini yangilashda xatolik:", error.message);
      return { status: 500, message: "Tokenni yangilash muvaffaqiyatsiz" };
    }
  }

  async checkAndRefreshToken() {
    const token = process.env.SMS_TOKEN;

    if (!token || (await this.isTokenExpired(token))) {
      console.log("Token eskirgan yoki mavjud emas. Yangilanmoqda...");
      return await this.refreshToken();
    } else {
      console.log("Token hali ham yaroqli.");
      return { status: 200, message: "Token yaroqli, yangilash shart emas." };
    }
  }

  private updateEnvFile(key: string, value: string) {
    try {
      const envFile = fs.readFileSync(this.envFilePath, "utf8");
      const envLines = envFile.split("\n");

      // Har bir qatordan `SMS_TOKEN` ni topamiz va o‘zgartiramiz
      const newEnvLines = envLines.map((line) => {
        if (line.startsWith(`${key}=`)) {
          return `${key}=${value}`;
        }
        return line;
      });

      fs.writeFileSync(this.envFilePath, newEnvLines.join("\n"));
      console.log(`.env fayl ichidagi ${key} muvaffaqiyatli yangilandi.`);
    } catch (error) {
      console.error(".env faylni yangilashda xatolik:", error.message);
    }
  }
}
