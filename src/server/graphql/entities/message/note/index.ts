import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { Message } from "..";

@Entity()
@ObjectType()
export class Note extends BaseEntity {
	@Field(() => [Message!])
	@ManyToOne(() => Message!, (msg) => msg.notes, {
		cascade: ["insert", "update"],
	})
	message: Relation<Message>;

	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column()
	content: string;
}
