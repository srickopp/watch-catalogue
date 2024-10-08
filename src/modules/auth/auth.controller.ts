import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "src/models/entities/user.entity";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/guards/api-key.guard";

@ApiHeader({
  name: "x-api-key",
  required: false,
})
@UseGuards(ApiKeyGuard)
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
