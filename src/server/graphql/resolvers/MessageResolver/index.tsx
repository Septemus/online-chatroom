import {
	Arg,
	Authorized,
	Mutation,
	Query,
	Resolver,
	Root,
	Subscription,
} from "type-graphql";
import {
	addMessageInput,
	getMessageInput,
	Message,
} from "../../entities/message";
import { NewNoteNotification, Note } from "../../entities/message/note";
import { MessageRepo, UserRepo } from "../../typeorm";
import { Brackets } from "typeorm";
import { type NEW_NOTE_PAYLOAD, pubSub } from "../../pubsub";
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
				notes: {
					sender: true,
				},
			},
		});
		return target;
	} else {
		return null;
	}
}
export async function selectLastNoteBetween(
	user1_id: string,
	user2_id: string,
) {
	const msg = await selectMessageBetween(user1_id, user2_id);
	return msg?.notes.at(-1);
}
export async function newNote({ id1, id2, content, sender }: addMessageInput) {
	let msg: Message | null = await selectMessageBetween(id1, id2);
	if (!msg) {
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
	note.sender = (await UserRepo.findOne({
		where: {
			id: sender,
		},
	}))!;
	msg.notes.push(note);
	console.log(
		"@@joetesting:saving modified message into database",
		msg,
		sender,
	);
	await MessageRepo.save(msg);
	return note;
}

@Resolver()
export class MessageResolver {
	@Authorized()
	@Query(() => Message, { nullable: true })
	Message(@Arg("data") data: getMessageInput): Promise<Message | null> {
		return selectMessageBetween(data.id1, data.id2);
	}

	@Authorized()
	@Query(() => Note, { nullable: true })
	LastNote(@Arg("data") data: getMessageInput): Promise<Note | undefined> {
		return selectLastNoteBetween(data.id1, data.id2);
	}
	@Authorized()
	@Mutation(() => Note, { nullable: true })
	async AddNote(@Arg("data") data: addMessageInput): Promise<Note> {
		const ret = await newNote(data);
		pubSub.publish("NEW_NOTE", data.id1, {
			target_id: data.id2,
			newNote: ret,
		});
		pubSub.publish("NEW_NOTE", data.id2, {
			target_id: data.id1,
			newNote: ret,
		});
		return ret;
	}

	@Authorized()
	@Subscription({
		topics: "NEW_NOTE",
		topicId: ({ args }) => args.recipientID,
	})
	newNote(
		@Arg("recipientID", () => String) recipientID: string,
		@Root() new_note: NEW_NOTE_PAYLOAD,
	): NewNoteNotification {
		const ret = new NewNoteNotification();
		Object.assign(ret, new_note);
		return ret;
	}
}
