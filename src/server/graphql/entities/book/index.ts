import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";

@Entity()
@ObjectType()
export class Book extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: string;

	@Field(() => String)
	@Column()
	title: string;

	@Field(() => String)
	@Column()
	author: string;

	@Field(() => Boolean)
	@Column({ default: false })
	isPublished: boolean;
}

@InputType()
export class CreateBookInput {
	@Field()
	title: string;

	@Field()
	author: string;
}

@InputType()
export class UpdateBookInput {
	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	author?: string;

	@Field({ nullable: true })
	isPublished?: boolean;
}
