import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713654638152 implements MigrationInterface {
    name = 'Default1713654638152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "country-house" ("id" SERIAL NOT NULL, "name" text NOT NULL, "status" text NOT NULL, "street" text NOT NULL, "city" text NOT NULL, "numberAddress" integer, "user-admin_id" integer, CONSTRAINT "REL_c4017b7995b6edaa737bb8c4e1" UNIQUE ("user-admin_id"), CONSTRAINT "PK_fc4b559fcebabb4bd1c8de72d91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-admin" ("id" SERIAL NOT NULL, "cpf" integer NOT NULL, "name" text NOT NULL, "phoneNumber" integer NOT NULL, "country-house_id" integer, CONSTRAINT "REL_602ac3aa3c514229b722e9c768" UNIQUE ("country-house_id"), CONSTRAINT "PK_6583ac1401fb41c2781cf8b1c58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "country-house" ADD CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a" FOREIGN KEY ("user-admin_id") REFERENCES "user-admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-admin" ADD CONSTRAINT "FK_602ac3aa3c514229b722e9c768b" FOREIGN KEY ("country-house_id") REFERENCES "country-house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-admin" DROP CONSTRAINT "FK_602ac3aa3c514229b722e9c768b"`);
        await queryRunner.query(`ALTER TABLE "country-house" DROP CONSTRAINT "FK_c4017b7995b6edaa737bb8c4e1a"`);
        await queryRunner.query(`DROP TABLE "user-admin"`);
        await queryRunner.query(`DROP TABLE "country-house"`);
    }

}
