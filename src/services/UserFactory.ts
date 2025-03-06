import { User } from "../data/models/interfaces/User.ts"
import { UserResponse } from "../data/models/interfaces/UserResponse.ts"

export class UserFactory {
    static userResponse(user: User): UserResponse {
        const userResponse: UserResponse = {
            id: user.id!,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }

        return userResponse
    }
}