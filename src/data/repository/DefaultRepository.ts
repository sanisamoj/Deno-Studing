import { Document, ObjectId } from "npm:mongodb@6.1.0";
import { Collections } from "../../src/../mongodb/Collections.ts"
import { MongodbOperations } from "../../src/../mongodb/MongodbOperations.ts"
import { mapUserDocument } from "../../src/../utils/mapUserDocument.ts"
import { Repository } from "../models/abstract/Repository.ts"
import { User } from "../models/interfaces/User.ts"
import { Errors } from "../models/types/Errors.ts"
import { MessageToSend } from "../models/interfaces/MessageToSend.ts";
import { BotApi } from "./BotApi.ts";

export class DefaultRepository extends Repository {

    constructor() { super() }

    public override async saveUser(user: User): Promise<User & Document> {
        const mongodbOperations: MongodbOperations = await MongodbOperations.getInstance()
        const userId: ObjectId = await mongodbOperations.save(Collections.USERS, user)
        return { ...user, id: userId.toString() }
    }
    public override async updateUser(user: User & Document): Promise<User & Document> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const userInDb: User & Document | null = await mongodbOperations.findOne(Collections.USERS, { _id: user._id })
        if (!userInDb) throw new Error(Errors.ItemNotFound)

        const updatedUser: User & Document = await mongodbOperations.updateItem(Collections.USERS, { _id: user._id }, user)
        return mapUserDocument(updatedUser)
    }

    public override async deleteUser(userId: string): Promise<void> {
        const mongodbOperations = await MongodbOperations.getInstance()
        await mongodbOperations.deleteItem(Collections.USERS, { _id: new ObjectId(userId) })
    }
    public override async findUserById(userId: string): Promise<User & Document> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const user: User | null = await mongodbOperations.findOne(Collections.USERS, { _id: new ObjectId(userId) })
        if (!user) throw new Error(Errors.ItemNotFound)

        return mapUserDocument(user)
    }
    public override async findUserByEmail(email: string): Promise<User & Document | null> {
        const mongodbOperations = await MongodbOperations.getInstance()
        const user: User | null = await mongodbOperations.findOne(Collections.USERS, { email: email })
        return user
    }

    public override async sendMessage(botId: string, messageToSend: MessageToSend): Promise<void> {
        const botApi = BotApi.getInstance()
        await botApi.sendMessage(botId, messageToSend)
    }

}