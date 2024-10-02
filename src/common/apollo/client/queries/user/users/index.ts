import { gql } from "@/common/gql";

export const USERS = gql(`
	query usersQuery($finderId: String) {
		users(finderId: $finderId) {
			id
			isOnline
			name
			avatar
			lastNote {
			content
			createdDate
			}
		}
	}
`);
