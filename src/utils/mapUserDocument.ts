import { Document } from "npm:mongodb@6.1.0";
import { User } from "../data/models/interfaces/User.ts"

export function mapUserDocument(user: User & Document): User {
    if (!user) return user
    
    const { _id, ...rest } = user
    return { id: _id?.toString(), ...rest }
}
