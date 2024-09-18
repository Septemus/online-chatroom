import {
	Entity,
	BaseEntity,
	PrimaryColumn,
	Column,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { ObjectType, Field, InputType, registerEnumType } from "type-graphql";
import { Length } from "class-validator";
enum Gender {
	male = "Male",
	female = "Female",
	nottosay = "Prefer not to say",
}
registerEnumType(Gender, {
	name: "Gender", // Mandatory
});
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

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	website: string;

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	bio: string;

	@Field(() => Gender, { nullable: true })
	@Column({ nullable: true })
	gender: Gender;

	@Field(() => String)
	@Column({ default: "images/avatars/default.jpg" })
	avatar: string;

	@Field(() => [Users!])
	@ManyToMany(() => Users, {
		cascade: ["insert", "update"],
	})
	@JoinTable()
	followers: Users[];

	@Field(() => [Users!])
	@ManyToMany(() => Users, {
		cascade: ["insert", "update"],
	})
	@JoinTable()
	following: Users[];
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
export class UpdateUserInput {
	@Field(() => String, { nullable: true })
	id: string;
	@Field(() => String, { nullable: true })
	name?: string;
	@Field(() => String, { nullable: true })
	website?: string;
	@Field(() => String, { nullable: true })
	bio?: string;
	@Field(() => Gender, { nullable: true })
	gender?: Gender;
}

@InputType()
export class loginInput {
	@Field(() => String)
	id: string;
	@Field(() => String)
	password: string;
}
@InputType()
export class followInput {
	@Field(() => String)
	followedId: string;

	@Field(() => String)
	followerId: string;
}
