import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713662534543 implements MigrationInterface {
    name = 'Default1713662534543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_a5023b33297deeba1be593bf6cc"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" RENAME COLUMN "schedulingId" TO "scheduling_id"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_441bad2b4431b1ea44ee715422d" FOREIGN KEY ("scheduling_id") REFERENCES "scheduling"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day-of-schedule" DROP CONSTRAINT "FK_441bad2b4431b1ea44ee715422d"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" RENAME COLUMN "scheduling_id" TO "schedulingId"`);
        await queryRunner.query(`ALTER TABLE "day-of-schedule" ADD CONSTRAINT "FK_a5023b33297deeba1be593bf6cc" FOREIGN KEY ("schedulingId") REFERENCES "scheduling"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
