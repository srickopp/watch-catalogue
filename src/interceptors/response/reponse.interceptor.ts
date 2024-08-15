import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),

      catchError((error: HttpException) => {
        const statusCode =
          error instanceof HttpException
            ? error?.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorData: string = "INTERNAL_SERVER_ERROR";
        let message = error.message;
        if (statusCode != HttpStatus.INTERNAL_SERVER_ERROR) {
          const errDetail = error.getResponse();

          if (typeof errDetail === "object") {
            errorData = Object(errDetail)["error_code"];
            message = Object(errDetail)["message"].toString();
          } else {
            errorData = errDetail;
          }
        }

        return throwError(
          () =>
            new HttpException(
              {
                status: false,
                message: message,
                result: errorData,
              },
              statusCode,
              { cause: error }
            )
        );
      })
    );
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return {
      status: true,
      result: res,
      message: response?.message,
    };
  }
}
