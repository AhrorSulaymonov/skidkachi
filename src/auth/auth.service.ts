import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";
import { AdminsService } from "../admins/admins.service";
import { JwtService } from "@nestjs/jwt";
import { access } from "fs";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly adminService: AdminsService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.userService.findUserByEmail(
      createUserDto.email
    );

    if (candidate) {
      throw new BadRequestException("Bunday Foydalanuvchi mavjud");
    }

    const newUser = await this.userService.create(createUserDto);
    const response = {
      message: "Tabriklayman tizimga qo'shildingiz",
      userId: newUser.id,
    };
    return response;
  }

  async signUpAdmin(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.findAdminByEmail(
      createAdminDto.email
    );

    if (candidate) {
      throw new BadRequestException("Bunday Admin mavjud");
    }

    const newAdmin = await this.adminService.create(createAdminDto);
    const response = {
      message: "Tabriklayman tizimga qo'shildingiz",
      adminId: newAdmin.id,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas");
    }
    if (!user.is_active) {
      throw new BadRequestException("user active emas");
    }
    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException("Password do not match");
    }

    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.userService.updateRefrashToken(
      user.id,
      hashed_refresh_token
    );
    if (!updateUser) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User logged in",
      userId: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signInAdmin(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas");
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException("Password do not match");
    }

    const tokens = await this.adminService.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateAdmin = await this.adminService.updateRefrashToken(
      admin.id,
      hashed_refresh_token
    );
    if (!updateAdmin) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "Admin logged in",
      adminId: admin.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!userData) {
      throw new ForbiddenException("User not verified");
    }

    const hashed_refresh_token = null;

    await this.userService.updateRefrashToken(
      userData.id,
      hashed_refresh_token
    );

    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out successfully",
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (userId !== decodedToken["id"]) {
      throw new BadRequestException("Ruxsat etilmagan");
    }

    const user = await this.userService.findOne(userId);

    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException("user not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );
    if (!tokenMatch) {
      throw new ForbiddenException("Forbiddin");
    }

    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefrashToken(user.id, hashed_refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User refreshed",
      user: user.id,
      access_token: tokens.access_token,
    };

    return response;
  }
}
