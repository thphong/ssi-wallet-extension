

import { type UserInput, type UserInfo } from "../types/types";

export async function createUser(user: UserInput): Promise<UserInfo> {
    return {
        displayName: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        did: user.urlDid
    }
}