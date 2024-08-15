import * as dotenv from "dotenv";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

dotenv.config();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("Api Key is missing");
    }

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException("Api key is invalid");
    }
    return true;
  }
}
