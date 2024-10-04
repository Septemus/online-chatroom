import { createPubSub } from "@graphql-yoga/subscription";
import { Note } from "../entities/message/note";
export type NEW_NOTE_PAYLOAD = { target_id: string; newNote: Note };
export const pubSub = createPubSub<{
	NEW_NOTE: [string, NEW_NOTE_PAYLOAD];
}>();
