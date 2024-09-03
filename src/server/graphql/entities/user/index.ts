import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
	@Field(() => String)
	@PrimaryColumn()
	id: string;

	@Field(() => Boolean)
	@Column({ default: false })
	isOnline: boolean;

	@Field(() => String)
	@Column()
	name: string;

	@Field(() => String)
	@Column({ nullable: true })
	password: string;

	@Field(() => String)
	@Column({ default: "images/avatars/default.jpg" })
	avatar: string;
}
@InputType()
export class CreateUserInput {
	@Field(() => String)
	name: string;
	@Field(() => String)
	password: string;
}

@InputType()
export class loginInput {
	@Field(() => String)
	id: string;
	@Field(() => String)
	password: string;
}
