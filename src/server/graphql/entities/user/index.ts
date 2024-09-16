import {
	Entity,
	BaseEntity,
	PrimaryColumn,
	Column,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
import { Length } from "class-validator";
@Entity()
@ObjectType()
export class Users extends BaseEntity {
	@Field(() => String)
	@PrimaryColumn()
	id: string;

	@Field(() => String)
	@Column({
		unique: true,
	})
	email: string;

	@Field(() => Boolean)
	@Column({ default: false })
	isOnline: boolean;

	@Field(() => String)
	@Column()
	@Length(4, 18)
	name: string;

	@Field(() => String)
	@Column({ nullable: true })
	password: string;

	@Field(() => String)
	@Column({ default: "images/avatars/default.jpg" })
	avatar: string;

	@Field(() => Users)
	@ManyToMany(() => Users, {
		cascade: ["insert", "update"],
	})
	@JoinTable()
	friends: Users[];
}
@InputType()
export class CreateUserInput {
	@Field(() => String)
	name: string;
	@Field(() => String)
	email: string;
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
