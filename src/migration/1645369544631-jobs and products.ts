import {MigrationInterface, QueryRunner} from "typeorm";

export class jobsAndProducts1645369544631 implements MigrationInterface {
    name = 'jobsAndProducts1645369544631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b2a33d7f394763e171ef11acc5\` ON \`users\``);
        await queryRunner.query(`CREATE TABLE \`products\` (\`deleted\` tinyint(1) NOT NULL DEFAULT '0', \`id\` int NOT NULL AUTO_INCREMENT, \`ts_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ts_last_modified\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(256) NULL, \`description\` text NULL, \`sku\` varchar(256) NULL, \`image\` varchar(256) NULL, \`url\` varchar(256) NULL, \`mpn\` varchar(256) NULL, \`raw\` text NULL, \`category\` varchar(256) NULL, \`offer\` text NULL, \`brand\` text NULL, INDEX \`IDX_c51eb773bfc52f2a6a0e3d844b\` (\`deleted\`), INDEX \`IDX_c3932231d2385ac248d0888d95\` (\`category\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_b147a0c758f65b438f114cc193\` ON \`users\` (\`deleted\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b147a0c758f65b438f114cc193\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_c3932231d2385ac248d0888d95\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_c51eb773bfc52f2a6a0e3d844b\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`CREATE INDEX \`IDX_b2a33d7f394763e171ef11acc5\` ON \`users\` (\`deleted\`)`);
    }

}
