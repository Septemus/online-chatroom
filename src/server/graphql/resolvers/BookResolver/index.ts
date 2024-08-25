import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
	Book,
	CreateBookInput,
	UpdateBookInput,
} from "@/server/graphql/entities/book";
import { BookRepo } from "@/server/graphql/typeorm";
import { OperationInfo } from "../../entities/operationInfo";
@Resolver()
export class BookResolver {
	@Query(() => [Book])
	books(): Promise<Book[]> {
		return BookRepo.find();
	}

	@Query(() => Book)
	book(@Arg("id") id: string): Promise<Book | null> {
		return BookRepo.findOne({ where: { id } });
	}

	@Mutation(() => Book)
	async createBook(@Arg("data") data: CreateBookInput): Promise<Book> {
		const b = new Book();
		b.title = data.title;
		b.author = data.author;
		await BookRepo.save(b);
		return b;
	}

	@Mutation(() => Book)
	async updateBook(
		@Arg("id") id: string,
		@Arg("data") data: UpdateBookInput,
	): Promise<Book> {
		const book = await BookRepo.findOne({ where: { id } });
		if (!book) throw new Error("Book not found!");
		Object.assign(book, data);
		await BookRepo.save(book);
		return book;
	}

	@Mutation(() => OperationInfo)
	async deleteBook(@Arg("id") id: string): Promise<OperationInfo> {
		const book = await BookRepo.findOne({ where: { id } });
		if (!book) {
			return {
				success: false,
				msg: "图书不存在！",
			};
		}
		await BookRepo.remove(book);
		return {
			success: true,
			msg: "删除成功！",
		};
	}
}
