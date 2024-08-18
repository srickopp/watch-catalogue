import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ResponseInterceptor } from "./interceptors/response/reponse.interceptor";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3000;

  // app config
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  // swagger config
  const config = new DocumentBuilder()
    .setTitle("Wristcheck - Watch Catalog API")
    .setDescription("Watch Catalog API Documentations")
    .setVersion("v0.0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, document);

  await app.listen(port);
}
bootstrap();
