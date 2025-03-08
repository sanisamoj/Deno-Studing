import { Document, ObjectId } from "npm:mongodb@6.1.0";
import { Collections } from "../../src/../mongodb/Collections.ts"
import { MongodbOperations } from "../../src/../mongodb/MongodbOperations.ts"
import { Repository } from "../models/abstract/Repository.ts"
import { User } from "../models/interfaces/User.ts"
import { Errors } from "../models/types/Errors.ts"
import { MessageToSend } from "../models/interfaces/MessageToSend.ts";
import { BotApi } from "./BotApi.ts";
import { BotCreateRequest } from "../models/interfaces/BotCreateRequest.ts";
import { BotResponse } from "../models/interfaces/BotResponse.ts";
import { Bot } from "../models/interfaces/Bot.ts";

export class DefaultRepository extends Repository {

    constructor() { super() }

    public override async saveUser(user: User): Promise<User> {
        const mongodbOperations: MongodbOperations = await MongodbOperations.getInstance()
        const userId: ObjectId = await mongodbOperations.save(Collections.USERS, user)
        const savedUser: User & Document | null = await mongodbOperations.findOne(Collections.USERS, { _id: userId })
        if (!savedUser) throw new Error(Errors.ItemNotFound)
        return savedUser
    }

    public override async updateUser(user: User & Document): Promise<User> {
        const userId: ObjectId = new ObjectId(user._id.toString())
        const mongodbOperations = await MongodbOperations.getInstance()
        const userInDb: User & Document | null = await mongodbOperations.findOne(Collections.USERS, { _id: userId })
        if (!userInDb) throw new Error(Errors.ItemNotFound)

        const { id, ...userToUpdate } = user
        const updatedUser: User & Document = await mongodbOperations.updateItem(Collections.USERS, { _id: userId }, userToUpdate)
        return updatedUser
    }

    public override async deleteUser(userId: string): Promise<void> {
        const mongodbOperations = await MongodbOperations.getInstance()
        await mongodbOperations.deleteItem(Collections.USERS, { _id: new ObjectId(userId) })
    }

    public override async findUserById(userId: string): Promise<User> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const user: User | null = await mongodbOperations.findOne(Collections.USERS, { _id: new ObjectId(userId) })
        if (!user) throw new Error(Errors.ItemNotFound)

        return user
    }

    public override async findUserByEmail(email: string): Promise<User | null> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const user: User | null = await mongodbOperations.findOne(Collections.USERS, { email: email })
        return user ? user : null
    }

    public override async createBot(request: BotCreateRequest): Promise<Bot> {
        const mongodbOperations = await MongodbOperations.getInstance()

        const user: User | null = await mongodbOperations.findOne(Collections.USERS, { _id: new ObjectId(request.userId) })
        if (!user) throw new Error(Errors.ItemNotFound)

        const botApi = BotApi.getInstance()
        const botResponse: BotResponse = await botApi.createBot(request)
        const botToSaveWithBsonId: Bot & Document = { ...botResponse, userId: request.userId!, _id: new ObjectId(botResponse.id) }
        const { id, ...botToSave } = botToSaveWithBsonId

        const botId: ObjectId = await mongodbOperations.save(Collections.BOTS, botToSave)
        const savedBot: Bot & Document | null = await mongodbOperations.findOne(Collections.BOTS, { _id: botId })
        if (!savedBot) throw new Error(Errors.ItemNotFound)

        return savedBot
    }

    public override async deleteBot(botId: string): Promise<void> {
        const mongodbOperations = await MongodbOperations.getInstance()
        return mongodbOperations.deleteItem(Collections.BOTS, { _id: new ObjectId(botId) })
    }

    public override async findBotById(botId: string): Promise<Bot> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const bot: Bot & Document | null = await mongodbOperations.findOne(Collections.BOTS, { _id: new ObjectId(botId) })
        if (!bot) throw new Error(Errors.ItemNotFound)
        return bot
    }
    public override async getAllBotFromTheUser(userId: string): Promise<Bot[]> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const bots: Bot[] = await mongodbOperations.findAll(Collections.BOTS, { userId: userId })
        return bots
    }

    public override async sendMessage(botId: string, messageToSend: MessageToSend): Promise<void> {
        const botApi = BotApi.getInstance()
        await botApi.sendMessage(botId, messageToSend)
    }

}