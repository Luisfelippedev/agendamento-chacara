import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1714255845248 implements MigrationInterface {
    name = 'Default1714255845248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduling" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientName" text NOT NULL, "phoneNumber" text NOT NULL, CONSTRAINT "PK_a19510fdc2c3f1c9daff8b6e395" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."day-of-schedule_status_enum" AS ENUM('free', 'ocupado')`);
        await queryRunner.query(`CREATE TABLE "day-of-schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" text NOT NULL, "endTime" text NOT NULL, "date" text NOT NULL, "status" "public"."day-of-schedule_status_enum" NOT NULL DEFAULT 'free', "country-house_id" uuid, CONSTRAINT "PK_daeb666cfbf33a1f66ba37af77e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country-house" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "status" text NOT NULL, "address" jsonb NOT NULL, "user-admin_id" uuid, CONSTRAINT "REL_c4017b7995b6edaa737bb8c4e1" UNIQUE ("user-admin_id"), CONSTRAINT "PK_fc4b559fcebabb4bd1c8de72d91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "phoneNumber" text NOT NULL, "country-house_id" uuid, CONSTRAINT "UQ_a6235b5ef0939d8deaad755fc87" UNIQUE ("cpf"), CONSTRAINT "REL_f59b47dce6c95b61d5e08db841" UNIQUE ("country-house_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day-of-schedule_scheduling" ("scheduling_id" uuid NOT NULL, "dayOfSchedule_id" uuid NOT NULL, CONSTRAINT "PK_d926a9fa39b3d595b5467de6d3a" PRIMARY KEY ("scheduling_id", "dayOfSchedule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e8ffc4ef8633d1d457cea57474" ON "day-of-schedule_scheduling" ("scheduling_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_be5b4010e07b225b1087e4baf1" ON "day-of-schedule_scheduling" ("dayOfSchedule_id") `);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_eec356b6b05ff712cda93b23120" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a" FOREIGN KEY ("user-admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f59b47dce6c95b61d5e08db8419" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule_scheduling" ADD CONSTRAINT "FK_e8ffc4ef8633d1d457cea574744" FOREIGN KEY ("scheduling_id") REFERENCES "day-of-schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule_scheduling" ADD CONSTRAINT "FK_be5b4010e07b225b1087e4baf1d" FOREIGN KEY ("dayOfSchedule_id") REFERENCES "scheduling"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day-of-schedule_scheduling" DROP CONSTRAINT "FK_be5b4010e07b225b1087e4baf1d"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule_scheduling" DROP CONSTRAINT "FK_e8ffc4ef8633d1d457cea574744"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f59b47dce6c95b61d5e08db8419"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_eec356b6b05ff712cda93b23120"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be5b4010e07b225b1087e4baf1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8ffc4ef8633d1d457cea57474"`);
        await queryRunner.query(`DROP TABLE "day-of-schedule_scheduling"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "country-house"`);
        await queryRunner.query(`DROP TABLE "day-of-schedule"`);
        await queryRunner.query(`DROP TYPE "public"."day-of-schedule_status_enum"`);
        await queryRunner.query(`DROP TABLE "scheduling"`);
    }

}
