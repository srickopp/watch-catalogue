import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/models/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { Role } from "src/enums/role.enum";
import { JwtPayload } from "./dto/jwt-payload.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(payload: RegisterDto): Promise<User> {
    try {
      const existingUser = await this.userRepo.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new UnauthorizedException("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      return await this.userRepo.save({
        fullname: payload.fullname,
        email: payload.email,
        password: hashedPassword,
        role: Role.ADMIN,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(payload: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userRepo.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        payload.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(jwtPayload);

      return { access_token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
