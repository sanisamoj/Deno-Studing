import { UserResponse } from "./UserResponse.ts";

export interface loginResponse {
    content: UserResponse
    token: string
}