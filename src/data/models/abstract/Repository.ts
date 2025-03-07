import { MessageToSend } from "../interfaces/MessageToSend.ts";
import { User } from "../interfaces/User.ts"

export abstract class Repository {
    public abstract saveUser(user: User): Promise<User>
    public abstract updateUser(user: User): Promise<User>
    public abstract deleteUser(userId: string): Promise<void>
    public abstract findUserById(userId: string): Promise<User>
    public abstract findUserByEmail(email: string): Promise<User | null>

    public abstract sendMessage(botId: string, messageToSend: MessageToSend): Promise<void>
}