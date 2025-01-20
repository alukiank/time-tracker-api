import { MigrationInterface, QueryRunner } from "typeorm";

export class TimeEntryTableCreate1737377982554 implements MigrationInterface {
    name = 'TimeEntryTableCreate1737377982554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "time_entries" ("id" SERIAL NOT NULL, "description" text NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "duration" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b8bc5f10269ba2fe88708904aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_f051d95ecf3cd671445ef0c9be8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_d1b452d7f0d45863303b7d30000" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_d1b452d7f0d45863303b7d30000"`);
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_f051d95ecf3cd671445ef0c9be8"`);
        await queryRunner.query(`DROP TABLE "time_entries"`);
    }

}
