import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertUsers1565352228162 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("INSERT INTO `users` (username, name, surname, email, password, role, profile_picture, verified) VALUES ('a@a.com', 'admin', 'admin', 'a@a.com', 'c969763138290aa0a8d6ab4623abbf77', 'ADMIN', 'default-user.png', 1), ('u@u.com', 'user', 'user', 'u@u.com', 'c969763138290aa0a8d6ab4623abbf77', 'USER', 'default-user.png', 1)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DELETE FROM `users` WHERE email = 'a@a.com' OR email='u@u.com'");
    }
}
