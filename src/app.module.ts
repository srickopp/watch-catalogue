import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import ormconfig from "./database/ormconfig";
import { JwtModule } from "@nestjs/jwt";
import { WatchesModule } from "./modules/watches/watches.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    AuthModule,
    WatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
