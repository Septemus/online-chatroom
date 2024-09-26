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
} from "typeorm";
import { ObjectType, Field, InputType, registerEnumType } from "type-graphql";
import { Length } from "class-validator";
import { Users } from "../user";
import { Note } from "./note";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
	@Field(() => String)
	@PrimaryColumn()
	id: string;

	@Field(() => [Users!])
	@ManyToMany(() => Users!, {
		cascade: ["insert", "update"],
	})
	@JoinTable()
	usersInvolved: Relation<Users[]>;

	@Field(() => [Note!])
	@OneToMany(() => Note, (note) => note.message, {
		cascade: ["insert", "update"],
	})
	notes: Relation<Note[]>;
}
