export const testDatabseConfig = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "scraper_db",
    synchronize: false,
    logging: false,
    entities: [
        "src/**/*.entity.ts"
    ]
}