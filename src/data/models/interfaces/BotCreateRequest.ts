import { BotConfigRequest } from "./BotConfigRequest.ts"

export interface BotCreateRequest {
    name: string
    description: string
    profileImage: string
    admins: string[]
    config?: BotConfigRequest
    botType: string
}