import {MigrationInterface, QueryRunner} from "typeorm";

export class jobsIdToProducts1645380472590 implements MigrationInterface {
    name = 'jobsIdToProducts1645380472590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`job_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_8c68ecb30d516c407b6e447e4ae\` FOREIGN KEY (\`job_id\`) REFERENCES \`jobs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_8c68ecb30d516c407b6e447e4ae\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`job_id\``);
    }

}
