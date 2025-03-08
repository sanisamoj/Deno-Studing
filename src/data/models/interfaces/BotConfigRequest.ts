export interface BotConfigRequest {
    automaticMessagePermission: boolean | null
    automaticMessage: string | null
    callPermission: boolean | null
    automaticCallMessage: string | null
}