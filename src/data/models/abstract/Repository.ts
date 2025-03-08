import { Bot } from "../interfaces/Bot.ts";
import { BotCreateRequest } from "../interfaces/BotCreateRequest.ts";
import { MessageToSend } from "../interfaces/MessageToSend.ts";
import { User } from "../interfaces/User.ts"

export abstract class Repository {
    public abstract saveUser(user: User): Promise<User>
    public abstract updateUser(user: User): Promise<User>
    public abstract deleteUser(userId: string): Promise<void>
    public abstract findUserById(userId: string): Promise<User>
    public abstract findUserByEmail(email: string): Promise<User | null>

    public abstract createBot(request: BotCreateRequest): Promise<Bot>
    public abstract findBotById(botId: string): Promise<Bot>
    public abstract getAllBotFromTheUser(userId: string): Promise<Bot[]>
    public abstract deleteBot(botId: string): Promise<void>
    public abstract sendMessage(botId: string, messageToSend: MessageToSend): Promise<void>
}