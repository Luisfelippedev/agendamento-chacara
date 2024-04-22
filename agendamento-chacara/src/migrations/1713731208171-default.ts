import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713731208171 implements MigrationInterface {
    name = 'Default1713731208171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduling" ("id" SERIAL NOT NULL, "clientName" text NOT NULL, "schedulingTime" text NOT NULL, "status" text NOT NULL, CONSTRAINT "PK_a19510fdc2c3f1c9daff8b6e395" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day-of-schedule" ("id" SERIAL NOT NULL, "entryTime" text NOT NULL, "departureTime" text NOT NULL, "monthDay" integer NOT NULL, "status" text NOT NULL, "country-house_id" integer, "scheduling_id" integer, CONSTRAINT "PK_daeb666cfbf33a1f66ba37af77e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country-house" ("id" SERIAL NOT NULL, "name" text NOT NULL, "status" text NOT NULL, "address" jsonb NOT NULL, "user-admin_id" integer, CONSTRAINT "REL_c4017b7995b6edaa737bb8c4e1" UNIQUE ("user-admin_id"), CONSTRAINT "PK_fc4b559fcebabb4bd1c8de72d91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "cpf" text NOT NULL, "name" text NOT NULL, "phoneNumber" text NOT NULL, "country-house_id" integer, CONSTRAINT "REL_f59b47dce6c95b61d5e08db841" UNIQUE ("country-house_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_eec356b6b05ff712cda93b23120" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_441bad2b4431b1ea44ee715422d" FOREIGN KEY ("scheduling_id") REFERENCES "scheduling"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a" FOREIGN KEY ("user-admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f59b47dce6c95b61d5e08db8419" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f59b47dce6c95b61d5e08db8419"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_441bad2b4431b1ea44ee715422d"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_eec356b6b05ff712cda93b23120"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "country-house"`);
        await queryRunner.query(`DROP TABLE "day-of-schedule"`);
        await queryRunner.query(`DROP TABLE "scheduling"`);
    }

}
