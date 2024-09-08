import { gql } from "@/common/gql";

export const VERIFY = gql(`
	query verifyQuery($token: String!) {
		verify(token: $token) {
			success
			msg
			id
		}
	}
`);
