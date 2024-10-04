import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { Message } from "..";
import { Users } from "../../user";

@Entity()
@ObjectType()
export class Note extends BaseEntity {
	@Field(() => Message!)
	@ManyToOne(() => Message!, (msg) => msg.notes, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: ["insert", "update", "remove"],
	})
	message: Relation<Message>;

	@Field(() => Users!)
	@ManyToOne(() => Users!, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: ["insert", "update"],
	})
	sender: Relation<Users>;

	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String!)
	@Column()
	content: string;

	@Field(() => Date)
	@Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdDate: Date;
}
@ObjectType()
export class NewNoteNotification extends BaseEntity {
	@Field(() => String)
	target_id: string;

	@Field(() => Note!)
	newNote: Note;
}
