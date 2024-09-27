import { gql } from "@/common/gql";

export const REFRESH = gql(`
	query refreshQuery($oldToken:String!) {
		refresh(oldToken: $oldToken) {
			msg
			success
			token
		}
	}
`);
