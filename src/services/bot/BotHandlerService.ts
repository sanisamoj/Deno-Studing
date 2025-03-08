import { Repository } from "../../data/models/abstract/Repository.ts";
import { Bot } from "../../data/models/interfaces/Bot.ts";
import { BotTokenResponse } from "../../data/models/interfaces/BotTokenResponse.ts";
import { MessageToSend } from "../../data/models/interfaces/MessageToSend.ts";
import { SendMessageRequest } from "../../data/models/interfaces/SendMessageRequest.ts";
import { Errors } from "../../data/models/types/Errors.ts";
import { DefaultRepository } from "../../data/repository/DefaultRepository.ts";
import { TokenGenerator } from "../../utils/TokenGenerator.ts";

export class BotHandlerService {
    private repository: Repository

    constructor(repository: Repository = new DefaultRepository()) {
        this.repository = repository
    }

    public async accessBotTokenGenerate(userId: string): Promise<BotTokenResponse> {
        const token: string = await TokenGenerator.botGenerateToken(userId)
        const botToken: BotTokenResponse = { token: token }
        return botToken
    }

    public async sendMessage(request: SendMessageRequest): Promise<void> {
        const bot: Bot = await this.repository.findBotById(request.botId)
        if(bot.userId !== request.userId) throw new Error(Errors.UserDoesNotHavePermission)
        const messageToSend: MessageToSend = { phone: request.phone, message: request.message, imageUrl: request.imageUrl }
        await this.repository.sendMessage(request.botId, messageToSend)
    }
}