import { User } from "../data/models/interfaces/User.ts"

export function mapUserDocument(user: any): User {
    if (!user) return user
    
    const { _id, ...rest } = user
    return { id: _id?.toString(), ...rest }
}
