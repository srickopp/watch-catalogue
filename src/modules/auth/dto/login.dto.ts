import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Min } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
