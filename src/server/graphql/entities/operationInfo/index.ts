import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OperationInfo {
	@Field({ nullable: true })
	msg?: string;

	@Field()
	success: boolean;
}
