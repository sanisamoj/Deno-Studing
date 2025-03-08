import { BotConfigRequest } from "./BotConfigRequest.ts"

export interface UpdateBotConfigRequest {
    botId: string
    config: BotConfigRequest
}