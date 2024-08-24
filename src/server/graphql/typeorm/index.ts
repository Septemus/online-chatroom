import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "@/server/graphql/entities/book";
export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "joe",
	password: "123456",
	database: process.env.db_name,
	synchronize: true,
	logging: true,
	entities: [Book],
});
AppDataSource.initialize();
export const BookRepo = AppDataSource.getRepository(Book);
