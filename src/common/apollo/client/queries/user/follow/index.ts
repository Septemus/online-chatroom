import { gql } from "@/common/gql";

export const FOLLOW = gql(`
    mutation followMutation($data: followInput!) {
        addFollowing(data: $data) {
            success
            msg
        }
    }    
`);
