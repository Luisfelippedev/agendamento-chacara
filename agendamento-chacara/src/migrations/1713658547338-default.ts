import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713658547338 implements MigrationInterface {
    name = 'Default1713658547338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduling" ("id" SERIAL NOT NULL, "clientName" text NOT NULL, "schedulingTime" text NOT NULL, "status" text NOT NULL, CONSTRAINT "PK_a19510fdc2c3f1c9daff8b6e395" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day-of-schedule" ("id" SERIAL NOT NULL, "entryTime" text NOT NULL, "departureTime" text NOT NULL, "monthDay" integer NOT NULL, "status" text NOT NULL, "country-house_id" integer, "schedulingId" integer, CONSTRAINT "PK_daeb666cfbf33a1f66ba37af77e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP COLUMN "numberAddress"`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD "address" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_eec356b6b05ff712cda93b23120" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_a5023b33297deeba1be593bf6cc" FOREIGN KEY ("schedulingId") REFERENCES "scheduling"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_a5023b33297deeba1be593bf6cc"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_eec356b6b05ff712cda93b23120"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD "numberAddress" integer`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD "city" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD "street" text NOT NULL`);
        await queryRunner.query(`DROP TABLE "day-of-schedule"`);
        await queryRunner.query(`DROP TABLE "scheduling"`);
    }

}
