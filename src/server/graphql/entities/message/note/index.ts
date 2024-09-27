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
	@Field(() => Message!)
	@ManyToOne(() => Message!, (msg) => msg.notes, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: ["insert", "update", "remove"],
	})
	message: Relation<Message>;

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
