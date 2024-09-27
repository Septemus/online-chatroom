import { Arg, Query, Resolver } from "type-graphql";
import { getMessageInput, Message } from "../../entities/message";
import { Note } from "../../entities/message/note";
import { MessageRepo, UserRepo } from "../../typeorm";
import { Brackets } from "typeorm";
export async function selectMessageBetween(user1_id: string, user2_id: string) {
	const targetId = (
		await MessageRepo.createQueryBuilder("message")
			.leftJoinAndSelect("message.usersInvolved", "user1")
			.leftJoinAndSelect("message.usersInvolved", "user2")
			.leftJoinAndSelect("message.notes", "notes")
			.where(
				new Brackets((qb) => {
					return qb
						.where("user1.id = :id1", { id1: user1_id })
						.orWhere("user1.email = :id1", { id1: user1_id });
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					return qb
						.where("user2.id = :id2", { id2: user2_id })
						.orWhere("user2.email = :id2", { id2: user2_id });
				}),
			)
			.getOne()
	)?.id;
	if (targetId) {
		const target = await MessageRepo.findOne({
			where: { id: targetId! },
			relations: {
				usersInvolved: true,
				notes: true,
			},
		});
		console.log("@@joetesting:select message result:", target);
		return target;
	} else {
		return null;
	}
}

export async function newNote(
	content: string,
	{ id1, id2 }: { id1: string; id2: string },
) {
	console.log(`@@joetesting:finding message between ${id1} and ${id2}`);
	let msg: Message | null = await selectMessageBetween(id1, id2);
	if (!msg) {
		console.log("@@joetesting:no message between them,creating a new one");
		const involved = await UserRepo.find({
			where: [{ id: id1 }, { email: id1 }, { id: id2 }, { email: id2 }],
		});
		msg = new Message();
		msg.usersInvolved = involved;
		msg.notes = [];
	}
	const note = new Note();
	note.message = msg;
	note.content = content;
	msg.notes.push(note);
	console.log("@@joetesting:saving modified message into database");
	await MessageRepo.save(msg);
}

@Resolver()
export class MessageResolver {
	@Query(() => Message, { nullable: true })
	Message(@Arg("data") data: getMessageInput): Promise<Message | null> {
		return selectMessageBetween(data.id1, data.id2);
	}
}
