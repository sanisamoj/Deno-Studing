import { Repository } from "../../data/models/abstract/Repository.ts";
import { Bot } from "../../data/models/interfaces/Bot.ts";
import { BotCreateRequest } from "../../data/models/interfaces/BotCreateRequest.ts";
import { User } from "../../data/models/interfaces/User.ts";
import { Errors } from "../../data/models/types/Errors.ts";
import { DefaultRepository } from "../../data/repository/DefaultRepository.ts";
import { mapDocument } from "../../utils/mapDocument.ts";

export class BotService {
    private repository: Repository

    constructor(repository: Repository = new DefaultRepository()) {
        this.repository = repository
    }

    public async createBot(request: BotCreateRequest): Promise<Bot> {
        const botResponse: Bot = await this.repository.createBot(request)
        return mapDocument(botResponse)
    }

    public async deleteBot(userId: string, botId: string): Promise<void> {
        const bot: Bot = await this.repository.findBotById(botId)
        if (bot.userId !== userId) throw new Error(Errors.UserDoesNotHavePermission)

        await this.repository.deleteBot(botId) 
    }

    public async findBotById(botId: string): Promise<Bot> {
        const botResponse: Bot = await this.repository.findBotById(botId)
        return mapDocument(botResponse)
    }

    public async getAllBotsFromTheUser(userId: string): Promise<Bot[]> {
        const bots: Bot[] = await this.repository.getAllBotFromTheUser(userId)
        return bots.map(mapDocument)
    }

}