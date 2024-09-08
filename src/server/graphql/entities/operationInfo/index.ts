import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OperationInfo {
	@Field({ nullable: true })
	msg?: string;

	@Field()
	success: boolean;

	@Field({ nullable: true })
	token?: string;

	@Field({ nullable: true })
	id?: string;
}
