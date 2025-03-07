import { User } from "../data/models/interfaces/User.ts"
import {  Document } from "npm:mongodb@6.1.0"
import { UserResponse } from "../data/models/interfaces/UserResponse.ts"

export class UserFactory {
    static userResponse(user: User & Document): UserResponse {
        const userResponse: UserResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt
        }

        return userResponse
    }
}