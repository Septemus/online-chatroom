import {
	Entity,
	BaseEntity,
	ManyToMany,
	JoinTable,
	OneToMany,
	type Relation,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
import { Users } from "../user";
import { Note } from "./note";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => [Users!]!)
	@ManyToMany(() => Users!, {
		cascade: ["insert", "update"],
	})
	@JoinTable()
	usersInvolved: Relation<Users[]>;

	@Field(() => [Note!]!)
	@OneToMany(() => Note, (note) => note.message, {
		cascade: ["insert", "update"],
	})
	notes: Relation<Note[]>;
}
@InputType()
export class getMessageInput {
	@Field(() => String)
	id1: string;
	@Field(() => String)
	id2: string;
}

@InputType()
export class addMessageInput {
	@Field(() => String)
	id1: string;
	@Field(() => String)
	id2: string;
	@Field(() => String)
	content: string;
	@Field(() => String)
	sender: string;
}
