import { BotConfigRequest } from "./BotConfigRequest.ts"

export interface BotCreateRequest {
    userId?: string
    name: string
    description: string
    profileImage: string
    admins: string[]
    config?: BotConfigRequest
    botType: string
}