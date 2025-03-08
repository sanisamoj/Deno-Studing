import { BotStatus } from "../types/BotStatus.ts";
import { BotType } from "../types/BotType.ts";
import { BotConfigResponse } from "./BotConfigResponse.ts";
import { ContactResponse } from "./ContactResponse.ts";
import { GroupResponse } from "./GroupResponse.ts";
import { MediaStorageResponse } from "./MediaStorageResponse.ts";

export interface Bot {
    id: string
    userId: string
    name: string
    description: string
    number: string
    profileImageUrl: string
    qrCode: string
    groups: GroupResponse[]
    contacts: ContactResponse[]
    config: BotConfigResponse
    mediaStorage: MediaStorageResponse[]
    status: BotStatus
    botType: BotType
    createdAt: string
}