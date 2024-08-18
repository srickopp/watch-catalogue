import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Min } from "class-validator";

export class RegisterDto {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
