import { MigrationInterface, QueryRunner } from "typeorm";

export class IntializeUserAndWatchTable1723736133573
  implements MigrationInterface
{
  name = "IntializeUserAndWatchTable1723736133573";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "fullname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "watches" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, "reference_number" character varying NOT NULL, "retail_price" numeric(10,2) NOT NULL, "release_date" date NOT NULL, "origin_country" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_efcff4004279a1fb7b7b0b2b072" UNIQUE ("reference_number"), CONSTRAINT "PK_c5e1fa5d29486c3bdada54343b3" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "watches"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
