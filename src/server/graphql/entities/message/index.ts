import {
	Entity,
	BaseEntity,
	PrimaryColumn,
	Column,
	ManyToMany,
	JoinTable,
	OneToOne,
	OneToMany,
	ManyToOne,
	type Relation,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, InputType, registerEnumType } from "type-graphql";
import { Length } from "class-validator";
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
		cascade: ["insert", "update", "remove"],
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
