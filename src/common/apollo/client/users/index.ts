import { gql } from "@/common/gql";

export const USERS = gql(`
	query usersQuery {
		users {
			id
			isOnline
			name
			avatar
		}
	}
`);
