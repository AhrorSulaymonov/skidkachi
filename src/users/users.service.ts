import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { MailService } from "../mail/mail.service";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";
import { BotService } from "../bot/bot.service";
import * as otpGenerator from "otp-generator";
import { PhoneUserDto } from "./dto/phone-user.dto";
import { Otp } from "../otp/models/otp.model";
import { AddMinutesToDate } from "../helpers/addMinutes";
import { time } from "console";
import { timestamp } from "rxjs";
import { decode, encode } from "../helpers/crypto";
import { Json } from "sequelize/types/utils";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService
  ) {}

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefrashToken(id: number, hashed_refresh_token: string | null) {
    const updateUser = await this.usersModel.update(
      { hashed_refresh_token },
      { where: { id } }
    );
    return updateUser;
  }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);

    const activation_link = uuid.v4();
    const newUser = await this.usersModel.create({
      ...createUserDto,
      hashed_password,
      activation_link,
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }

    return newUser;
  }

  findAll() {
    return this.usersModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.usersModel.findByPk(id);
  }

  findUserByEmail(email: string) {
    return this.usersModel.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.usersModel.destroy({ where: { id } });
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }
    const updateUser = await this.usersModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );

    if (!updateUser[1][0]) {
      throw new BadRequestException("User already activated");
    }
    const response = {
      message: "User activated successfully",
      user: updateUser[1][0].is_active,
    };
    return response;
  }

  async findUser(findUserDto: FindUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where["name"] = {
        [Op.iLike]: `%${name}%`,
      };
    }
    if (email) {
      where["email"] = {
        [Op.iLike]: `%${email}%`,
      };
    }
    if (phone) {
      where["phone"] = {
        [Op.like]: `%${phone}%`,
      };
    }
    console.log(where);

    const users = await this.usersModel.findAll({ where });

    if (!users) {
      throw new NotFoundException("User not found");
    }
    return users;
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // // --------------------------BOT---------------------

    // const isSend = await this.botService.sendOtp(phone_number, otp);
    // if (!isSend) {
    //   throw new BadRequestException("Avval botdan ro'yxatdan o'ting");
    // }
    // return {
    //   message: "OTP botga yuborildi",
    // };

    // --------------------------SMS---------------------

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpData = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      phone_number,
      expiration_time,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpData.id,
    };
    const encodedData = await encode(JSON.stringify(details));
    const isSend = await this.botService.sendOtp(phone_number, otp);
    if (!isSend) {
      throw new BadRequestException("Avval botdan ro'yxatdan o'ting");
    }
    return {
      message: "OTP botga yuborildi",
      verification_key: encodedData,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone_number, otp } = verifyOtpDto;

    const currentDate = new Date();
    const decodedData = await decode(verification_key);
    const detailes = JSON.parse(decodedData);
    if (detailes.phone_number != phone_number) {
      throw new BadRequestException("OTP bu telefon raqamga yuborilmagan");
    }

    const resultOTP = await this.otpModel.findByPk(detailes.otp_id);

    if (resultOTP == null) {
      throw new BadRequestException("Bunday OTP yo'q");
    }
    if (resultOTP.verified) {
      throw new BadRequestException("Bu OTP avval tekshirilgan");
    }

    if (resultOTP.expiration_time < currentDate) {
      throw new BadRequestException("Bu OTP vaqti tugagan");
    }

    if (resultOTP.otp != otp) {
      throw new BadRequestException("OTP mos emas");
    }

    const user = await this.usersModel.update(
      {
        is_owner: true,
      },
      {
        where: { phone: phone_number },
        returning: true,
      }
    );

    if (!user[1][0]) {
      throw new BadRequestException("Bunday raqamli foydalanuvchi yo'q");
    }

    await this.otpModel.update(
      { verified: true },
      { where: { id: detailes.otp_id } }
    );

    return {
      message: "Tabriklayman siz owner bo'ldingiz",
    };
  }
}
