import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAlertsTable1762176678286 implements MigrationInterface {
    name = 'CreateAlertsTable1762176678286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."alerts_condition_enum" AS ENUM('GREATER_THAN', 'LESS_THAN')`);
        await queryRunner.query(`CREATE TYPE "public"."alerts_status_enum" AS ENUM('ACTIVE', 'TRIGGERED', 'PAUSED')`);
        await queryRunner.query(`CREATE TABLE "alerts" ("id" uuid NOT NULL, "stockSymbol" text NOT NULL, "targetPrice" double precision NOT NULL, "condition" "public"."alerts_condition_enum" NOT NULL, "status" "public"."alerts_status_enum" NOT NULL DEFAULT 'ACTIVE', "userId" uuid NOT NULL, CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ALERT_STATUS" ON "alerts" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_ALERT_STOCK_SYMBOL" ON "alerts" ("stockSymbol") `);
        await queryRunner.query(`CREATE INDEX "IDX_ALERT_USER_ID" ON "alerts" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ALERT_ID" ON "alerts" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_USER_ALERT" ON "alerts" ("userId", "stockSymbol", "targetPrice", "condition") `);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_f2678f7b11e5128abbbc4511906" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_f2678f7b11e5128abbbc4511906"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_USER_ALERT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ALERT_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ALERT_USER_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ALERT_STOCK_SYMBOL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ALERT_STATUS"`);
        await queryRunner.query(`DROP TABLE "alerts"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_condition_enum"`);
    }

}
