import {MigrationInterface, QueryRunner} from "typeorm";

export class jobs1645369730640 implements MigrationInterface {
    name = 'jobs1645369730640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jobs\` (\`deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`description\` varchar(256) NULL, \`status\` varchar(256) NOT NULL DEFAULT 'PENDING', INDEX \`IDX_7f7f0db975becd89777846a1e5\` (\`deleted\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7f7f0db975becd89777846a1e5\` ON \`jobs\``);
        await queryRunner.query(`DROP TABLE \`jobs\``);
    }

}
