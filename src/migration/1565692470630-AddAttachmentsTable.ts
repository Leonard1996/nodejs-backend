import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAttachmentsTable1565692470630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `attachments` (`deleted` tinyint(1) NOT NULL DEFAULT '0', `id` int NOT NULL AUTO_INCREMENT, `ts_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `ts_last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `name` varchar(256) NOT NULL, `original_name` varchar(256) NOT NULL, `mime_type` varchar(128) NOT NULL, `extension` varchar(128) NOT NULL, `size_in_bytes` int NOT NULL, `path` mediumtext NULL, INDEX `IDX_57f4205162470cedb447cc1486` (`deleted`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_57f4205162470cedb447cc1486` ON `attachments`");
        await queryRunner.query("DROP TABLE `attachments`");
    }

}
