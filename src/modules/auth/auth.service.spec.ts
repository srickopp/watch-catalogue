import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "../../models/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Role } from "../../enums/role.enum";

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const registerDto: RegisterDto = {
        fullname: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (userRepository.save as jest.Mock).mockResolvedValue({
        id: 1,
        fullname: "Test User",
        email: "test@example.com",
        role: Role.ADMIN,
      });

      const result = await service.register(registerDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        fullname: registerDto.fullname,
        email: registerDto.email,
        password: "hashedpassword",
        role: Role.ADMIN,
      });
      expect(result).toEqual({
        id: 1,
        fullname: "Test User",
        email: "test@example.com",
        role: Role.ADMIN,
      });
    });

    it("should throw an UnauthorizedException if email is already in use", async () => {
      const registerDto: RegisterDto = {
        fullname: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("login", () => {
    it("should return an access token if credentials are valid", async () => {
      const loginDto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        fullname: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        role: Role.ADMIN,
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue("signed-token");

      const result = await service.login(loginDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({ access_token: "signed-token" });
    });

    it("should throw an UnauthorizedException if email is not found", async () => {
      const loginDto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw an UnauthorizedException if password is invalid", async () => {
      const loginDto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        fullname: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        role: Role.ADMIN,
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
