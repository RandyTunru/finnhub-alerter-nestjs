import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1762004905832 implements MigrationInterface {
    name = 'CreateUserTable1762004905832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "apiKeyEncrypted" text NOT NULL, "apiKeyCreatedAt" TIMESTAMP NOT NULL, "apiKeyExpiresAt" TIMESTAMP, "apiKeyRevoked" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP, "lastLoginAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_USER_NAME" ON "users" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_APIKEY_ENCRYPTED" ON "users" ("apiKeyEncrypted") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_APIKEY_ENCRYPTED"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_NAME"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
