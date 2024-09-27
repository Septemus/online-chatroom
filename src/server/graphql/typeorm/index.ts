import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "@/server/graphql/entities/book";
import { Users } from "@/server/graphql/entities/user";
import { Message } from "../entities/message";
import { Note } from "../entities/message/note";
export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "joe",
	password: "123456",
	database: process.env.db_name,
	synchronize: true,
	logging: process.env.NODE_ENV === "development",
	entities: [Book, Users, Message, Note],
});
AppDataSource.initialize();
export const BookRepo = AppDataSource.getRepository(Book);
export const UserRepo = AppDataSource.getRepository(Users);
export const MessageRepo = AppDataSource.getRepository(Message);
